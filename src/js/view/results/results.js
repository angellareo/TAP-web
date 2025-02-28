export function initializeEventListeners() {
    const prevSlideButton = document.getElementById('prevSlide');
    const nextSlideButton = document.getElementById('nextSlide');
    let currentSlideIndex = 0;

    if (prevSlideButton && nextSlideButton) {
        prevSlideButton.addEventListener('click', () => {
            showSlide(currentSlideIndex - 1);
        });

        nextSlideButton.addEventListener('click', () => {
            showSlide(currentSlideIndex + 1);
        });
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.result-slide');
    if (index >= 0 && index < slides.length) {
        slides[currentSlideIndex].style.transform = `translateX(-${index * 100}%)`;
        currentSlideIndex = index;
    }
}

function showResults(title, comments, result, totalPossibleScore, quickTestItemResults) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous contents

    const resultElement = document.createElement('div');
    resultElement.className = 'result-slide';
    resultElement.innerText = formatResult(title, comments, result, totalPossibleScore, quickTestItemResults);
    resultsContainer.appendChild(resultElement);

    const downloadLink = document.createElement('a');
    downloadLink.id = 'downloadLink';
    downloadLink.className = 'btn btn-success btn-lg mt-3';
    downloadLink.style.display = 'none';
    downloadLink.innerText = 'Download Results';
    resultsContainer.appendChild(downloadLink);

    const blob = new Blob([formatResult(title, comments, result, totalPossibleScore, quickTestItemResults)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'result.txt';
    downloadLink.style.display = 'block';

    // Show results container
    document.getElementById('editDataContainer').classList.add('hidden');
    document.querySelector('.main-menu').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    document.getElementById('resultsContainer').classList.add('fade-in');
}

function formatResult(title, comments, result, totalPossibleScore, quickTestItemResults) {
    // Implementation of result formatting
    return `Title: ${title}\nComments: ${comments}\nResult: ${result}\nTotal Possible Score: ${totalPossibleScore}\nQuick Test Item Results: ${quickTestItemResults}`;
}

const formatQuickExamineeResults = (title, comments, metrics, totalPossibleScore) => {
    return `Title: ${title}\nComments: ${comments}\n` +
           `Number of Examinees: ${metrics.numExaminees}\n` +
           `Total Possible Score: ${totalPossibleScore}\n` +
           `Minimum Score: ${metrics.minScore.toFixed(3)} = ${(metrics.minScore / totalPossibleScore * 100).toFixed(1)}%\n` +
           `Maximum Score: ${metrics.maxScore.toFixed(3)} = ${(metrics.maxScore / totalPossibleScore * 100).toFixed(1)}%\n` +
           `Median Score: ${metrics.median.toFixed(3)} = ${(metrics.median / totalPossibleScore * 100).toFixed(1)}%\n` +
           `Mean Score: ${metrics.mean.toFixed(3)} = ${(metrics.mean / totalPossibleScore * 100).toFixed(1)}%\n` +
           `Standard Deviation: ${metrics.stdDevPop.toFixed(3)}\n` +
           `Variance: ${metrics.varPop.toFixed(3)}\n` +
           `Skewness: ${metrics.skewness.toFixed(3)}\n` +
           `Kurtosis: ${metrics.kurtosis.toFixed(3)}\n`;
};

const formatQuickTestItemResults = (quickTestItemResults) => {
    return `Number of Items Excluded: ${quickTestItemResults.numItemsExcluded}\n` +
           `Number of Items Analyzed: ${quickTestItemResults.numItemsAnalyzed}\n` +
           `Mean Item Difficulty: ${(quickTestItemResults.meanItemDifficulty * 100).toFixed(1)}%\n` +
           `Mean Discrimination Index: ${quickTestItemResults.meanDiscriminationIndex.toFixed(3)}\n` +
           `Mean Point Biserial: ${quickTestItemResults.meanPointBiserial.toFixed(3)}\n` +
           `Mean Adj. Point Biserial: ${quickTestItemResults.meanAdjPointBiserial.toFixed(3)}`;
};

const formatResultsOFile = (title, comments, quickExamineeResultsStr, quickTestItemResultsStr) => {
    return `${title}\n${comments}\n${quickExamineeResultsStr}\n${quickTestItemResultsStr}`;
};

export {
    formatQuickExamineeResults,
    formatQuickTestItemResults,
    formatResultsOFile,
    showResults, 
    formatResult,
    showSlide
};
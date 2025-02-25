const math = require('mathjs');

function updateCounter(inputId, counterId) {
    let input = document.getElementById(inputId);
    let counter = document.getElementById(counterId);
    counter.textContent = input.value.length;
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Ensure the counters are updated on page load
    const keyInput = document.getElementById('key');
    if (keyInput) {
        keyInput.addEventListener('input', () => updateCounter('key', 'charCounterKey'));
    }

    const optionsInput = document.getElementById('options');
    if (optionsInput) {
        optionsInput.addEventListener('input', () => updateCounter('options', 'charCounterOptions'));
    }

    const includeInput = document.getElementById('include');
    if (includeInput) {
        includeInput.addEventListener('input', () => updateCounter('include', 'charCounterInclude'));
    }

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

    function showSlide(index) {
        const slides = document.querySelectorAll('.result-slide');
        if (index >= 0 && index < slides.length) {
            slides[currentSlideIndex].style.transform = `translateX(-${index * 100}%)`;
            currentSlideIndex = index;
        }
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const loadDataButton = document.getElementById('loadDataButton');
    const editDataButton = document.getElementById('editDataButton');
    const loadDataContainer = document.getElementById('loadDataContainer');
    const editDataContainer = document.getElementById('editDataContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const mainMenu = document.querySelector('.main-menu');
    const backButton1 = document.getElementById('backButton1');
    const backButton2 = document.getElementById('backButton2');
    const backButton3 = document.getElementById('backButton3');
    const processManualDataButton = document.getElementById('processManualDataButton');

    if (loadDataButton) {
        loadDataButton.addEventListener('click', () => {
            mainMenu.classList.add('hidden');
            loadDataContainer.classList.remove('hidden');
            loadDataContainer.classList.add('fade-in');
        });
    }

    if (editDataButton) {
        editDataButton.addEventListener('click', () => {
            mainMenu.classList.add('hidden');
            editDataContainer.classList.remove('hidden');
            editDataContainer.classList.add('fade-in');
        });
    }

    if (backButton1) {
        backButton1.addEventListener('click', () => {
            loadDataContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    if (backButton2) {
        backButton2.addEventListener('click', () => {
            editDataContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    if (backButton3) {
        backButton3.addEventListener('click', () => {
            resultsContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    if (processManualDataButton) {
        processManualDataButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent page reload
            const manualData = document.getElementById('manualDataInput').value;
            processDataFromManualInput(manualData);
        });
    }
});

function handleFileSelect() {
    const fileInput = document.getElementById('dataFileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            processDataFromFile(contents);
        };
        reader.readAsText(file);
    } else {
        alert('No file selected');
    }
}

function processDataFromFile(data) {
    const lines = data.split('\n');
    const title = lines[0];
    const comments = lines[1];
    const numberOfStudents = parseInt(lines[2]);
    const numberOfItems = parseInt(lines[3]);
    const offset = parseInt(lines[4]);
    const key = lines[5];
    const options = lines[6];
    const include = lines[7];
    const studentData = lines.slice(8, 8 + numberOfStudents).join('\n');

    // Validate inputs
    if (key.length !== numberOfItems || options.length !== numberOfItems || include.length !== numberOfItems) {
        alert('Key, Options, and Include lengths must match the number of Test Items.');
        return;
    }

    const totalPossibleScore = calculateTotalPossibleScore(include);
    const scores = getScores(studentData, numberOfStudents, key, include, offset);
    const result = calculateMetrics(scores, numberOfItems);

    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous contents

    const resultElement = document.createElement('div');
    resultElement.className = 'result-slide';
    resultElement.innerText = formatResult(title, comments, result, totalPossibleScore);
    resultsContainer.appendChild(resultElement);

    const downloadLink = document.createElement('a');
    downloadLink.id = 'downloadLink';
    downloadLink.className = 'btn btn-success btn-lg mt-3';
    downloadLink.style.display = 'none';
    downloadLink.innerText = 'Download Results';
    resultsContainer.appendChild(downloadLink);

    const blob = new Blob([formatResult(title, comments, result)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'result.txt';
    downloadLink.style.display = 'block';

    // Show results container
    document.querySelector('.main-menu').classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    resultsContainer.classList.add('fade-in');
}

function calculateTotalPossibleScore(include) {
    return include.split('').reduce((acc, val) => val.toLowerCase() === 'y' ? acc + 1 : acc, 0);
}

function processDataFromManualInput(data) {
    const title = document.getElementById('title').value;
    const comments = document.getElementById('comments').value;
    const numberOfStudents = parseInt(document.getElementById('students').value);
    const numberOfItems = parseInt(document.getElementById('items').value);
    const offset = parseInt(document.getElementById('offset').value);
    const key = document.getElementById('key').value;
    const options = document.getElementById('options').value;
    const include = document.getElementById('include').value;

    // Validate inputs
    if (key.length !== numberOfItems || options.length !== numberOfItems || include.length !== numberOfItems) {
        alert('Key, Options, and Include lengths must match the number of Test Items.');
        return;
    }

    const totalPossibleScore = calculateTotalPossibleScore(include);
    const scores = getScores(data, numberOfStudents, key, include, offset);
    const result = calculateMetrics(scores, numberOfItems);

    const resultsSlides = document.getElementById('resultsSlides');
    resultsSlides.innerHTML = ''; // Clear previous slides

    const resultElement = document.createElement('div');
    resultElement.className = 'result-slide';
    resultElement.innerText = formatResult(title, comments, result, totalPossibleScore);
    resultsSlides.appendChild(resultElement);

    const downloadLink = document.createElement('a');
    downloadLink.id = 'downloadLink';
    downloadLink.className = 'btn btn-success btn-lg mt-3';
    downloadLink.style.display = 'none';
    downloadLink.innerText = 'Download Results';
    resultsSlides.appendChild(downloadLink);

    const blob = new Blob([formatResult(title, comments, result)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'result.txt';
    downloadLink.style.display = 'block';

    // Show results container
    document.getElementById('editDataContainer').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    document.getElementById('resultsContainer').classList.add('fade-in');
}

function getScores(data, numberOfStudents, key, include, offset) {
    const lines = data.split('\n').slice(0, numberOfStudents);
    const scores = lines.map(line => calculateScore(line, key, include, offset));
    return scores;
}

function calculateScore(line, key, include, offset) {
    line = line.slice(offset);
    let score = 0;
    for (let i = 0; i < key.length; i++) {
        if (include[i].toLowerCase() === 'y' && line[i] === key[i]) {
            score++;
        }
    }
    return score;
}

function calculateSkewness(scores, n, mean, stdDev) {
    return scores.reduce((acc, score) => acc + Math.pow(score - mean, 3), 0) / (n * Math.pow(stdDev, 3));
}

function calculateKurtosis(scores, n, mean, stdDev) {
    return scores.reduce((acc, score) => acc + Math.pow(score - mean, 4), 0) / (n * Math.pow(stdDev, 4));
}

function calculateMetrics(scores) {
    const numExaminees = scores.length;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const mean = math.mean(scores);
    const median = math.median(scores);
    const stdDevSamp = math.std(scores);
    const stdDevPop = math.std(scores, 'uncorrected');
    const varSamp = math.variance(scores);
    const varPop = math.variance(scores, 'uncorrected');
    const skewness = calculateSkewness(scores, numExaminees, mean, stdDevPop);
    const kurtosis = calculateKurtosis(scores, numExaminees, mean, stdDevPop)-3; // The -3 is to compare kurtosis with normal distribution;

    return {
        numExaminees,
        minScore,
        maxScore,
        mean,
        median,
        stdDevSamp,
        stdDevPop,
        varSamp,
        varPop,
        skewness,
        kurtosis
    };
}

function formatResult(title, comments, metrics, totalPossibleScore) {
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
           `Kurtosis: ${metrics.kurtosis.toFixed(3)}`;
}

module.exports = {
    calculateScore,
    getScores,
    calculateMetrics,
    calculateSkewness,
    calculateKurtosis,
    calculateTotalPossibleScore
};
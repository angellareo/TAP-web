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
});

document.addEventListener('DOMContentLoaded', (event) => {
    const dataFileInput = document.getElementById('dataFileInput');
    if (dataFileInput) {
        // Remove this event listener
        // dataFileInput.addEventListener('change', handleFileSelect, false);
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const loadDataButton = document.getElementById('loadDataButton');
    if (loadDataButton) {
        loadDataButton.addEventListener('click', handleFileSelect);
    }
});

function handleFileSelect() {
    const fileInput = document.getElementById('dataFileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            processData(contents);
        };
        reader.readAsText(file);
    } else {
        alert('No file selected');
    }
}

function calculateTotalPossibleScore(include) {
    return include.split('').reduce((acc, val) => val.toLowerCase() === 'y' ? acc + 1 : acc, 0);
}

function processData(data) {
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

    const tutorialContainer = document.querySelector('.tutorial-container');
    tutorialContainer.innerHTML = ''; // Clear previous contents

    const resultElement = document.createElement('p');
    resultElement.id = 'result';
    resultElement.className = 'result-animation';
    resultElement.innerText = formatResult(title, comments, result, totalPossibleScore);
    tutorialContainer.appendChild(resultElement);

    const downloadLink = document.createElement('a');
    downloadLink.id = 'downloadLink';
    downloadLink.className = 'btn btn-success btn-lg mt-3';
    downloadLink.style.display = 'none';
    downloadLink.innerText = 'Download Results';
    tutorialContainer.appendChild(downloadLink);

    const blob = new Blob([formatResult(title, comments, result)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'result.txt';
    downloadLink.style.display = 'block';

    // Trigger animation
    setTimeout(() => {
        resultElement.classList.add('show');
    }, 10);
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
           `Minimum Score: ${metrics.minScore.toFixed(3)} = ${(metrics.minScore / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Maximum Score: ${metrics.maxScore.toFixed(3)} = ${(metrics.maxScore / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Median Score: ${metrics.median.toFixed(3)} = ${(metrics.median / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Mean Score: ${metrics.mean.toFixed(3)} = ${(metrics.mean / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
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
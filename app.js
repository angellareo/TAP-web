const math = require('mathjs');

document.addEventListener('DOMContentLoaded', (event) => {
    const dataFileInput = document.getElementById('dataFileInput');
    if (dataFileInput) {
        dataFileInput.addEventListener('change', handleFileSelect, false);
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

    document.getElementById('result').innerText = formatResult(title, comments, result, totalPossibleScore);

    const blob = new Blob([formatResult(title, comments, result)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'result.txt';
    downloadLink.style.display = 'block';
    downloadLink.innerText = 'Download Result';
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

function calculateSkewness(scores) {
    const n = scores.length;
    const mean = math.mean(scores);
    const stdDev = math.std(scores);
    return scores.reduce((acc, score) => acc + Math.pow(score - mean, 3), 0) / (n * Math.pow(stdDev, 3));
}

function calculateKurtosis(scores) {
    const n = scores.length;
    const mean = math.mean(scores);
    const stdDev = math.std(scores);
    return scores.reduce((acc, score) => acc + Math.pow(score - mean, 4), 0) / (n * Math.pow(stdDev, 4));
}

function calculateMetrics(scores) {
    const numExaminees = scores.length;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const meanScore = math.mean(scores);
    const medianScore = math.median(scores);
    const stdDev = math.std(scores);
    const variance = math.variance(scores);
    const skewness = calculateSkewness(scores);
    const kurtosis = calculateKurtosis(scores);

    return {
        numExaminees,
        minScore,
        maxScore,
        meanScore,
        medianScore,
        stdDev,
        variance,
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
           `Median Score: ${metrics.medianScore.toFixed(3)} = ${(metrics.medianScore / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Mean Score: ${metrics.meanScore.toFixed(3)} = ${(metrics.meanScore / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Standard Deviation: ${metrics.stdDev.toFixed(3)}\n` +
           `Variance: ${metrics.variance.toFixed(3)}\n` +
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
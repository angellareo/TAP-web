import {  } from "../../controller/dataProcessors";

function initializeEventListeners() {
    const quickExamineeResultsButton = document.getElementById('quickExamineeResultsButton');
    const quickTestItemResultsButton = document.getElementById('quickTestItemResultsButton');

    if (quickExamineeResultsButton) {
        quickExamineeResultsButton.addEventListener('click', () => {
            showQuickExamineeResults();
        });
    }

    if (quickTestItemResultsButton) {
        quickTestItemResultsButton.addEventListener('click', () => {
            showQuickTestItemResults();
        });
    }
}

function showQuickExamineeResults() {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = '<h2>Quick Examinee Results</h2>' + formatQuickExamineeResults();
}

function showQuickTestItemResults() {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = '<h2>Quick Test/Item Results</h2>' + formatQuickTestItemResults(currentResults.quickTestItemResults);
}

function showResults(title, comments, result, totalPossibleScore, quickTestItemResults) {
    currentResults = { title, comments, result, totalPossibleScore, quickTestItemResults };

    const resultsMenu = document.getElementById('resultsMenu');
    resultsMenu.innerHTML = `
        <button id="quickExamineeResultsButton" class="btn btn-secondary">Quick Examinee Results</button>
        <button id="quickTestItemResultsButton" class="btn btn-secondary">Quick Test/Item Results</button>
    `;

    initializeEventListeners();

    // Show results container
    document.getElementById('editDataContainer').classList.add('hidden');
    document.querySelector('.main-menu').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    document.getElementById('resultsContainer').classList.add('fade-in');

    // Add header according to the current results being shown
    const resultsHeader = document.getElementById('resultsHeader');
    resultsHeader.innerHTML = `<h1>${title}</h1>`;
}

function formatQuickExamineeResults() {
    const totalPossibleScore = sessionStorage.getItem('totalPossibleScore');
    const metrics = JSON.parse(sessionStorage.getItem('examineeResults'));
    return `<p>Number of Examinees: ${metrics.numExaminees}</p>` +
           `<p>Total Possible Score: ${totalPossibleScore}</p>` +
           `<p>Minimum Score: ${metrics.minScore.toFixed(3)} = ${(metrics.minScore / totalPossibleScore * 100).toFixed(1)}%</p>` +
           `<p>Maximum Score: ${metrics.maxScore.toFixed(3)} = ${(metrics.maxScore / totalPossibleScore * 100).toFixed(1)}%</p>` +
           `<p>Median Score: ${metrics.median.toFixed(3)} = ${(metrics.median / totalPossibleScore * 100).toFixed(1)}%</p>` +
           `<p>Mean Score: ${metrics.mean.toFixed(3)} = ${(metrics.mean / totalPossibleScore * 100).toFixed(1)}%</p>` +
           `<p>Standard Deviation: ${metrics.stdDevPop.toFixed(3)}</p>` +
           `<p>Variance: ${metrics.varPop.toFixed(3)}</p>` +
           `<p>Skewness: ${metrics.skewness.toFixed(3)}</p>` +
           `<p>Kurtosis: ${metrics.kurtosis.toFixed(3)}</p>`;
}

function formatQuickTestItemResults() {
    const quickTestItemResults = JSON.parse(sessionStorage.getItem('testItemResults'));
    return `<p>Number of Items Excluded: ${quickTestItemResults.numItemsExcluded}</p>` +
           `<p>Number of Items Analyzed: ${quickTestItemResults.numItemsAnalyzed}</p>` +
           `<p>Mean Item Difficulty: ${(quickTestItemResults.meanItemDifficulty * 100).toFixed(1)}%</p>` +
           `<p>Mean Discrimination Index: ${quickTestItemResults.meanDiscriminationIndex.toFixed(3)}</p>` +
           `<p>Mean Point Biserial: ${quickTestItemResults.meanPointBiserial.toFixed(3)}</p>` +
           `<p>Mean Adj. Point Biserial: ${quickTestItemResults.meanAdjPointBiserial.toFixed(3)}</p>`;
}

let currentResults = {};

export {
    showResults,
    formatQuickExamineeResults,
    formatQuickTestItemResults,
    initializeEventListeners
};
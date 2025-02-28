const { 
    calculateMeanDiscriminationIndex,
    calculateMeanItemDifficulty,
    calculateMeanPointBiserial,
    calculateMeanAdjPointBiserial
 } = require('../dataProcessors');

function calculateQuickTestItemResults(studentData, key, include) {
    const numItemsExcluded = include.split('').filter(char => char.toLowerCase() === 'n').length;
    const numItemsAnalyzed = include.split('').filter(char => char.toLowerCase() === 'y').length;
    const meanItemDifficulty = calculateMeanItemDifficulty(studentData, key, include);
    const meanDiscriminationIndex = calculateMeanDiscriminationIndex(studentData, key, include);
    const meanPointBiserial = calculateMeanPointBiserial(studentData, key, include);
    const meanAdjPointBiserial = calculateMeanAdjPointBiserial(studentData, key, include);

    return {
        numItemsExcluded,
        numItemsAnalyzed,
        meanItemDifficulty,
        meanDiscriminationIndex,
        meanPointBiserial,
        meanAdjPointBiserial
    };
}

module.exports = {
    calculateQuickTestItemResults
}
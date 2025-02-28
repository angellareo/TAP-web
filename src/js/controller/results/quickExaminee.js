const math = require('mathjs');
const { calculateSkewness, calculateKurtosis } = require('../dataProcessors');

function calculateQuickExamineeResults(scores) {
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

module.exports = {
    calculateQuickExamineeResults
};
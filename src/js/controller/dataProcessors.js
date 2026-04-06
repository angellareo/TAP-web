/**
 * dataProcessors.js
 * Orchestrates the full test-analysis pipeline.
 * Delegates pure calculations to analysisUtils.js and file parsing to fileParser.js.
 * Writes all results to sessionStorage for consumption by the results view.
 */

const math   = require('mathjs');
const utils  = require('./analysisUtils.js');
const parser = require('./fileParser.js');

// ─── Re-export sub-module functions (backward-compatible public API) ──────────
const { getDataFromFile, getDataFromTapFile, getDataFromDatFile }            = parser;
const { calculateScore, getScores, calculateTotalPossibleScore }             = utils;
const { calculateSkewness, calculateKurtosis }                               = utils;
const { calculateMeanItemDifficulty, calculateMeanDiscriminationIndex }      = utils;
const { calculateMeanPointBiserial, calculateMeanAdjPointBiserial }          = utils;

// ─── Validation ───────────────────────────────────────────────────────────────

function validateInputs(key, options, include, numberOfItems) {
    return key.length === numberOfItems &&
           options.length === numberOfItems &&
           include.length === numberOfItems;
}

// ─── Main pipeline ────────────────────────────────────────────────────────────

function processData(offset, key, options, include, studentData) {
    const noOffsetData       = utils.removeOffset(studentData, offset);
    const fixed              = utils.removeNValues(key, options, include, noOffsetData);
    const totalPossibleScore = utils.calculateTotalPossibleScore(include);
    const fscores            = utils.getScores(fixed.studentData, fixed.key);

    // Attach score + original-order index, then sort descending by score
    fixed.studentData = fixed.studentData
        .map((responses, idx) => ({ responses, score: fscores[idx], group: '', originalIndex: idx }))
        .sort((a, b) => b.score - a.score);

    // Label top/middle/bottom 27% groups
    const groupSize = Math.floor(fixed.studentData.length * 0.27);
    fixed.studentData.forEach((student, idx) => {
        if      (idx < groupSize)                                  student.group = 't';
        else if (idx >= fixed.studentData.length - groupSize)      student.group = 'b';
        else                                                        student.group = 'm';
    });

    sessionStorage.setItem('key',               fixed.key);
    sessionStorage.setItem('options',           fixed.options);
    sessionStorage.setItem('studentData',       JSON.stringify(fixed.studentData));
    sessionStorage.setItem('totalPossibleScore', totalPossibleScore);
    sessionStorage.setItem('scores',            JSON.stringify(fscores));

    const examineeStats = calculateQuickExamineeResults(fscores);
    calculateQuickTestItemResults(fixed.studentData, fixed.key, include);
    const perItems = calculatePerItemResults(fixed.studentData, fixed.key);

    const reliability = calculateReliabilityMetrics(fscores, perItems, totalPossibleScore);
    calculateScoreDistribution(fscores, examineeStats.mean, examineeStats.stdDevPop, totalPossibleScore);
    calculateExamineeList(fixed.studentData, totalPossibleScore, reliability.sem);

    return { totalPossibleScore, fscores };
}

// ─── sessionStorage writers ──────────────────────────────────────────────────

function calculateQuickExamineeResults(scores) {
    const numExaminees = scores.length;
    const minScore     = Math.min(...scores);
    const maxScore     = Math.max(...scores);
    const mean         = math.mean(scores);
    const median       = math.median(scores);
    const stdDevSamp   = math.std(scores);
    const stdDevPop    = math.std(scores, 'uncorrected');
    const varSamp      = math.variance(scores);
    const varPop       = math.variance(scores, 'uncorrected');
    const skewness     = utils.calculateSkewness(scores, numExaminees, mean, stdDevPop);
    const rawKurtosis  = utils.calculateKurtosis(scores, numExaminees, mean, stdDevPop);
    const kurtosis     = rawKurtosis !== null ? rawKurtosis - 3 : null; // excess kurtosis

    const result = { numExaminees, minScore, maxScore, mean, median,
                     stdDevSamp, stdDevPop, varSamp, varPop, skewness, kurtosis };
    sessionStorage.setItem('examineeResults', JSON.stringify(result));
    return result;
}

function calculateQuickTestItemResults(studentData, key, include) {
    const result = {
        numItemsExcluded:        include.split('').filter(c => c.toLowerCase() === 'n').length,
        numItemsAnalyzed:        include.split('').filter(c => c.toLowerCase() === 'y').length,
        meanItemDifficulty:      utils.calculateMeanItemDifficulty(studentData, key),
        meanDiscriminationIndex: utils.calculateMeanDiscriminationIndex(studentData, key),
        meanPointBiserial:       utils.calculateMeanPointBiserial(studentData, key),
        meanAdjPointBiserial:    utils.calculateMeanAdjPointBiserial(studentData, key),
    };
    sessionStorage.setItem('testItemResults', JSON.stringify(result));
    return result;
}

function calculatePerItemResults(studentData, key) {
    const n           = studentData.length;
    const topGroup    = studentData.filter(s => s.group === 't');
    const bottomGroup = studentData.filter(s => s.group === 'b');
    const totals      = studentData.map(s => s.score);
    const meanTotal   = totals.reduce((a, b) => a + b, 0) / n;
    const stdTotal    = Math.sqrt(totals.reduce((sum, s) => sum + Math.pow(s - meanTotal, 2), 0) / n);

    const items = Array.from({ length: key.length }, (_, i) => {
        const correct   = studentData.filter(s => s.responses[i] === key[i]);
        const incorrect = studentData.filter(s => s.responses[i] !== key[i]);
        const p = correct.length / n;
        const q = 1 - p;

        let pointBiserial = null;
        if (p > 0 && q > 0 && stdTotal > 0) {
            const mC = correct.reduce((sum, s)   => sum + s.score, 0) / correct.length;
            const mI = incorrect.length ? incorrect.reduce((sum, s) => sum + s.score, 0) / incorrect.length : 0;
            pointBiserial = ((mC - mI) / stdTotal) * Math.sqrt(p * q);
        }

        const adjScores = studentData.map(s => s.score - (s.responses[i] === key[i] ? 1 : 0));
        const meanAdj   = adjScores.reduce((a, b) => a + b, 0) / n;
        const stdAdj    = Math.sqrt(adjScores.reduce((sum, s) => sum + Math.pow(s - meanAdj, 2), 0) / n);
        let adjPointBiserial = null;
        if (p > 0 && q > 0 && stdAdj > 0) {
            const mCA = correct.reduce((sum, s)   => sum + (s.score - 1), 0) / correct.length;
            const mIA = incorrect.length ? incorrect.reduce((sum, s) => sum + s.score, 0) / incorrect.length : 0;
            adjPointBiserial = ((mCA - mIA) / stdAdj) * Math.sqrt(p * q);
        }

        const ST = topGroup.length    ? topGroup.filter(s    => s.responses[i] === key[i]).length / topGroup.length    : 0;
        const SB = bottomGroup.length ? bottomGroup.filter(s => s.responses[i] === key[i]).length / bottomGroup.length : 0;

        return {
            itemNumber: i + 1,
            key:        key[i],
            numCorrect: correct.length,
            difficulty: p,
            discIndex:  ST - SB,
            ST, SB,
            nTop:           topGroup.length,
            nBottom:        bottomGroup.length,
            nTopCorrect:    topGroup.filter(s    => s.responses[i] === key[i]).length,
            nBottomCorrect: bottomGroup.filter(s => s.responses[i] === key[i]).length,
            pointBiserial,
            adjPointBiserial,
            isProblem: p <= 0.20 || p >= 0.95 || (ST - SB) < 0 ||
                       (adjPointBiserial !== null && adjPointBiserial < 0),
        };
    });

    sessionStorage.setItem('perItemResults', JSON.stringify(items));
    return items;
}

function calculateReliabilityMetrics(scores, perItemResults, totalPossibleScore) {
    const result = utils.calculateReliabilityValues(scores, perItemResults, totalPossibleScore);
    sessionStorage.setItem('reliabilityResults', JSON.stringify(result));
    return result;
}

function calculateScoreDistribution(scores, mean, stdDevPop, totalPossibleScore) {
    const rows = utils.calculateScoreDistributionRows(scores, mean, stdDevPop);
    sessionStorage.setItem('scoreDistribution', JSON.stringify({ rows, totalPossibleScore, mean, stdDevPop }));
    return rows;
}

function calculateExamineeList(studentData, totalPossibleScore, sem) {
    const rows = utils.calculateExamineeListRows(studentData, totalPossibleScore, sem);
    sessionStorage.setItem('examineeList', JSON.stringify(rows));
    return rows;
}

// ─── Module exports (backward-compatible) ────────────────────────────────────

module.exports = {
    // File parsing (from fileParser.js)
    getDataFromFile,
    getDataFromTapFile,
    getDataFromDatFile,
    // Pure utilities (from analysisUtils.js)
    calculateScore,
    getScores,
    calculateTotalPossibleScore,
    calculateSkewness,
    calculateKurtosis,
    calculateMeanItemDifficulty,
    calculateMeanDiscriminationIndex,
    calculateMeanPointBiserial,
    calculateMeanAdjPointBiserial,
    // Orchestrator functions
    processData,
    validateInputs,
    calculateQuickExamineeResults,
    calculateQuickTestItemResults,
    calculatePerItemResults,
    calculateReliabilityMetrics,
    calculateScoreDistribution,
    calculateExamineeList,
};

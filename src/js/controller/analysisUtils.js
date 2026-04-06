/**
 * analysisUtils.js
 * Pure statistical and scoring functions — no sessionStorage, no side effects.
 * All functions are independently testable.
 */

// ─── Score calculation ────────────────────────────────────────────────────────

function calculateScore(line, key) {
    let score = 0;
    for (let i = 0; i < key.length; i++) {
        if (line[i] === key[i]) score++;
    }
    return score;
}

function getScores(data, key) {
    if (!Array.isArray(data)) data = data.split('\n');
    return data.map(line => calculateScore(line, key));
}

function calculateTotalPossibleScore(include) {
    return include.split('').filter(c => c.toLowerCase() === 'y').length;
}

// ─── Data preparation ─────────────────────────────────────────────────────────

function removeOffset(studentData, offset) {
    return studentData.map(line => line.slice(offset));
}

function removeNValues(key, options, include, studentData) {
    const keep = (str) =>
        String(str).split('').filter((_, i) => include[i].toLowerCase() === 'y').join('');
    return {
        key:         keep(key),
        options:     keep(options),
        studentData: studentData.map(keep),
    };
}

// ─── Descriptive statistics ───────────────────────────────────────────────────

function calculateSkewness(scores, n, mean, stdDev) {
    if (stdDev === 0) return null;
    return scores.reduce((acc, s) => acc + Math.pow(s - mean, 3), 0) / (n * Math.pow(stdDev, 3));
}

function calculateKurtosis(scores, n, mean, stdDev) {
    if (stdDev === 0) return null;
    return scores.reduce((acc, s) => acc + Math.pow(s - mean, 4), 0) / (n * Math.pow(stdDev, 4));
}

// ─── Score distribution helpers ───────────────────────────────────────────────

/**
 * Rational approximation of the inverse standard normal CDF.
 * Max error < 4.5e-4. (Abramowitz & Stegun 26.2.17)
 */
function normalInvCDF(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const sign = p < 0.5 ? -1 : 1;
    const q   = p < 0.5 ? p : 1 - p;
    const t   = Math.sqrt(-2 * Math.log(q));
    const num = 2.515517 + 0.802853 * t + 0.010328 * t * t;
    const den = 1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t;
    return sign * (t - num / den);
}

/**
 * Stanine from percentile rank.
 * Boundaries: 4, 11, 23, 40, 60, 77, 89, 95.
 */
function getStanine(pr) {
    const cutpoints = [4, 11, 23, 40, 60, 77, 89, 95];
    for (let i = 0; i < cutpoints.length; i++) {
        if (pr < cutpoints[i]) return i + 1;
    }
    return 9;
}

/**
 * Returns per-unique-score distribution rows sorted ascending.
 * Each row: { score, freq, relFreq, cumFreq, cumPercent, zScore, percentileRank, stanine, normalizedZ }
 */
function calculateScoreDistributionRows(scores, mean, stdDevPop) {
    const n = scores.length;
    const freqMap = {};
    scores.forEach(s => { freqMap[s] = (freqMap[s] || 0) + 1; });
    const uniqueScores = Object.keys(freqMap).map(Number).sort((a, b) => a - b);

    let cumFreq = 0;
    return uniqueScores.map(score => {
        const freq          = freqMap[score];
        const freqBelow     = cumFreq;
        cumFreq            += freq;
        const relFreq       = freq / n;
        const cumPercent    = (cumFreq / n) * 100;
        const zScore        = stdDevPop > 0 ? (score - mean) / stdDevPop : null;
        const percentileRank = (freqBelow + 0.5 * freq) / n * 100;
        const stanine       = getStanine(percentileRank);
        const normalizedZ   = normalInvCDF(percentileRank / 100);
        return { score, freq, relFreq, cumFreq, cumPercent, zScore, percentileRank, stanine, normalizedZ };
    });
}

// ─── Grading ──────────────────────────────────────────────────────────────────

function getLetterGrade(pct) {
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
}

// ─── Reliability (KR20, KR21, SEM) ───────────────────────────────────────────

/**
 * Computes KR20, KR21, and SEM.
 * Uses KR20 when per-item difficulty data is available, otherwise KR21.
 * Returns { kr20, kr21, sem }.
 */
function calculateReliabilityValues(scores, perItemResults, totalPossibleScore) {
    const n     = scores.length;
    const k     = perItemResults ? perItemResults.length : totalPossibleScore;
    const mean  = scores.reduce((a, b) => a + b, 0) / n;
    const varPop = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
    const stdDevPop = Math.sqrt(varPop);

    let kr20 = null;
    if (varPop > 0 && k > 1 && perItemResults && perItemResults.length > 0) {
        const sumPQ = perItemResults.reduce((sum, item) => sum + item.difficulty * (1 - item.difficulty), 0);
        kr20 = (k / (k - 1)) * (1 - sumPQ / varPop);
    }

    let kr21 = null;
    if (varPop > 0 && k > 1) {
        kr21 = (k / (k - 1)) * (1 - (mean * (k - mean)) / (k * varPop));
    }

    const reliability = kr20 !== null ? kr20 : kr21;
    const sem = (reliability !== null && reliability >= 0 && reliability < 1)
        ? stdDevPop * Math.sqrt(1 - reliability)
        : stdDevPop;

    return { kr20, kr21, sem };
}

// ─── Examinee list ────────────────────────────────────────────────────────────

/**
 * Returns per-student rows sorted by originalIndex (i.e., original input order).
 * Each row: { originalIndex, score, percent, grade, ciLow, ciHigh,
 *             ciLowPct, ciHighPct, ciLowGrade, ciHighGrade, responses }
 */
function calculateExamineeListRows(studentData, totalPossibleScore, sem) {
    return studentData
        .slice()
        .sort((a, b) => a.originalIndex - b.originalIndex)
        .map(student => {
            const pct       = totalPossibleScore > 0 ? (student.score / totalPossibleScore) * 100 : 0;
            const grade     = getLetterGrade(pct);
            const ciLow     = Math.max(0, student.score - sem);
            const ciHigh    = Math.min(totalPossibleScore, student.score + sem);
            const ciLowPct  = totalPossibleScore > 0 ? (ciLow  / totalPossibleScore) * 100 : 0;
            const ciHighPct = totalPossibleScore > 0 ? (ciHigh / totalPossibleScore) * 100 : 0;
            return {
                originalIndex: student.originalIndex,
                score:         student.score,
                percent:       pct,
                grade,
                ciLow,
                ciHigh,
                ciLowPct,
                ciHighPct,
                ciLowGrade:  getLetterGrade(ciLowPct),
                ciHighGrade: getLetterGrade(ciHighPct),
                responses:   student.responses,
            };
        });
}

// ─── Item analysis ────────────────────────────────────────────────────────────

function calculateMeanItemDifficulty(studentData, key) {
    let totalMatches = 0, totalItems = 0;
    studentData.forEach(student => {
        for (let i = 0; i < key.length; i++) {
            totalItems++;
            if (student.responses[i] === key[i]) totalMatches++;
        }
    });
    return totalMatches / totalItems;
}

function calculateMeanDiscriminationIndex(studentData, key) {
    const topGroup    = studentData.filter(s => s.group === 't');
    const bottomGroup = studentData.filter(s => s.group === 'b');
    let total = 0;
    for (let i = 0; i < key.length; i++) {
        const ST = topGroup.length    ? topGroup.filter(s    => s.responses[i] === key[i]).length / topGroup.length    : 0;
        const SB = bottomGroup.length ? bottomGroup.filter(s => s.responses[i] === key[i]).length / bottomGroup.length : 0;
        total += ST - SB;
    }
    return total / key.length;
}

function calculateMeanPointBiserial(studentData, key) {
    const totals     = studentData.map(s => s.score);
    const meanTotal  = totals.reduce((a, b) => a + b, 0) / studentData.length;
    const stdTotal   = Math.sqrt(totals.reduce((sum, s) => sum + Math.pow(s - meanTotal, 2), 0) / studentData.length);
    let total = 0;
    for (let i = 0; i < key.length; i++) {
        const correct   = studentData.filter(s => s.responses[i] === key[i]);
        const incorrect = studentData.filter(s => s.responses[i] !== key[i]);
        const p = correct.length / studentData.length;
        const q = 1 - p;
        if (p === 0 || q === 0 || stdTotal === 0) continue;
        const mC = correct.reduce((sum, s)   => sum + s.score, 0) / correct.length;
        const mI = incorrect.reduce((sum, s) => sum + s.score, 0) / incorrect.length;
        total += ((mC - mI) / stdTotal) * Math.sqrt(p * q);
    }
    return total / key.length;
}

function calculateMeanAdjPointBiserial(studentData, key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
        const adjScores = studentData.map(s => s.score - (s.responses[i] === key[i] ? 1 : 0));
        const meanAdj   = adjScores.reduce((a, b) => a + b, 0) / studentData.length;
        const stdAdj    = Math.sqrt(adjScores.reduce((sum, s) => sum + Math.pow(s - meanAdj, 2), 0) / studentData.length);
        const correct   = studentData.filter(s => s.responses[i] === key[i]);
        const incorrect = studentData.filter(s => s.responses[i] !== key[i]);
        const p = correct.length / studentData.length;
        const q = 1 - p;
        if (p === 0 || q === 0 || stdAdj === 0) continue;
        const mCA = correct.reduce((sum, s)   => sum + (s.score - 1), 0) / correct.length;
        const mIA = incorrect.reduce((sum, s) => sum + s.score, 0) / incorrect.length;
        total += ((mCA - mIA) / stdAdj) * Math.sqrt(p * q);
    }
    return total / key.length;
}

module.exports = {
    calculateScore,
    getScores,
    calculateTotalPossibleScore,
    removeOffset,
    removeNValues,
    calculateSkewness,
    calculateKurtosis,
    normalInvCDF,
    getStanine,
    calculateScoreDistributionRows,
    getLetterGrade,
    calculateReliabilityValues,
    calculateExamineeListRows,
    calculateMeanItemDifficulty,
    calculateMeanDiscriminationIndex,
    calculateMeanPointBiserial,
    calculateMeanAdjPointBiserial,
};

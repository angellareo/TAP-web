function processData(offset, key, include, studentData) {
    const totalPossibleScore = calculateTotalPossibleScore(include);
    const scores = getScores(studentData.split('\n'), key, include, offset);
    return {
        totalPossibleScore,
        scores
    };
}

function validateInputs(key, options, include, numberOfItems) {
    if (key.length !== numberOfItems || options.length !== numberOfItems || include.length !== numberOfItems) {
        alert('Key, Options, and Include lengths must match the number of Test Items.');
        return false;
    }
    return true;
}

function calculateSkewness(scores, n, mean, stdDev) {
    return scores.reduce((acc, score) => acc + Math.pow(score - mean, 3), 0) / (n * Math.pow(stdDev, 3));
}

function calculateKurtosis(scores, n, mean, stdDev) {
    return scores.reduce((acc, score) => acc + Math.pow(score - mean, 4), 0) / (n * Math.pow(stdDev, 4));
}

function calculateTotalPossibleScore(include) {
    if (typeof include !== 'string') {
        return 0;
    }
    return include.split('').reduce((acc, val) => val.toLowerCase() === 'y' ? acc + 1 : acc, 0);
}

function getScores(data, key, include, offset) {
    if (!Array.isArray(data)) {
        data = data.split('\n');
    }
    const scores = data.map(line => calculateScore(line, key, include, offset));
    return scores;
}

function calculateScore(line, key, include, offset) {
    console.log(line, key, include, offset);
    line = line.slice(offset);
    let score = 0;
    for (let i = 0; i < key.length; i++) {
        if (include[i].toLowerCase() === 'y' && line[i] === key[i]) {
            score++;
        }
    }
    return score;
}

function calculateMeanItemDifficulty(studentData, key, include) {
    let totalMatches = 0;
    let totalItems = 0;
    studentData.forEach(line => {
        for (let i = 0; i < key.length; i++) {
            if (include[i].toLowerCase() === 'y') {
                totalItems++;
                if (line[i] === key[i]) {
                    totalMatches++;
                }
            }
        }
    });
    return totalMatches / totalItems;
}

function calculateMeanDiscriminationIndex(studentData, key, include) {
    // Placeholder function, replace with actual calculation
    return 0.5;
}

function calculateMeanPointBiserial(studentData, key, include) {
    // Placeholder function, replace with actual calculation
    return 0.3;
}

function calculateMeanAdjPointBiserial(studentData, key, include) {
    // Placeholder function, replace with actual calculation
    return 0.4;
}

module.exports = {
    processData,
    validateInputs,
    calculateSkewness,
    calculateKurtosis,
    calculateTotalPossibleScore,
    getScores,
    calculateScore,
    calculateMeanItemDifficulty,
    calculateMeanDiscriminationIndex,
    calculateMeanPointBiserial,
    calculateMeanAdjPointBiserial
};
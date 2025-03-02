const math = require('mathjs');

function getDataFromFile(data){
    const lines = data.split('\n');
    const dataObject = {};
    let dataIndex = -1;

    lines.forEach((line, index) => {
        const [key, value] = line.split(':');
        if (key.trim() === 'data') {
            dataIndex = index + 1;
        } else if (key && value !== undefined) {
            dataObject[key.trim()] = value.trim();
        }
    });

    const title = dataObject.title;
    const comments = dataObject.comments;
    const numberOfStudents = parseInt(dataObject.nstudents);
    const numberOfItems = parseInt(dataObject.nitems);
    const offset = parseInt(dataObject.noffset);
    const key = dataObject.key;
    const options = dataObject.options;
    const include = dataObject.include;

    const studentData = lines.slice(dataIndex, dataIndex + numberOfStudents);
    if (studentData.length !== numberOfStudents || studentData.some(line => (line.length - offset) !== numberOfItems)) {
        alert('Data format error: number of students or items does not match the specified values.');
        return;
    }

    return {title, comments, offset, key, options, include, studentData};
}

function removeOffset(studentData, offset) {
    return studentData.map(line => line.slice(offset));
}

function removeNValues(key, options, include, studentData) {
    // function to remove N values from include from the key, options, and studentData
    key = key.split('').filter((_, idx) => include[idx].toLowerCase() === 'y').join('');
    options = options.split('').filter((_, idx) => include[idx].toLowerCase() === 'y').join('');
    studentData = studentData.map(line => line.split('').filter((_, idx) => include[idx].toLowerCase() === 'y').join(''));
    return {key, options, studentData};
}

function processData(offset, key, options, include, studentData) {
    const noOffStudentData = removeOffset(studentData, offset);
    const fixed = removeNValues(key, options, include, noOffStudentData);
    const totalPossibleScore = calculateTotalPossibleScore(include);
    const fscores = getScores(fixed.studentData, fixed.key);

    // Create studentData as an object containing responses, score, and group
    fixed.studentData = fixed.studentData.map((line, idx) => {
        return {responses: line, score: fscores[idx], group: ''};
    }).sort((a, b) => b.score - a.score);

    // Label studentData top, middle, and bottom groups
    const groupSize = Math.floor(fixed.studentData.length * 0.27);
    fixed.studentData.forEach((student, idx) => {
        if (idx < groupSize) {
            student.group = 't';
        } else if (idx >= groupSize && idx < fixed.studentData.length - groupSize) {
            student.group = 'm';
        } else {
            student.group = 'b';
        }
    });

    sessionStorage.setItem('key', fixed.key);
    sessionStorage.setItem('options', fixed.options);
    sessionStorage.setItem('studentData', JSON.stringify(fixed.studentData));
    sessionStorage.setItem('totalPossibleScore', totalPossibleScore);
    sessionStorage.setItem('scores', JSON.stringify(fscores));

    calculateQuickExamineeResults(fscores);
    calculateQuickTestItemResults(fixed.studentData, fixed.key, include);
    calculateItemResults(fixed.studentData, fixed.key);
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
    return include.split('').filter(char => char.toLowerCase() === 'y').length;
}

function getScores(data, key) {
    if (!Array.isArray(data)) {
        data = data.split('\n');
    }
    const scores = data.map(line => calculateScore(line, key));
    return scores;
}

function calculateScore(line, key) {
    let score = 0;
    for (let i = 0; i < key.length; i++) {
        if (line[i] === key[i]) {
            score++;
        }
    }
    return score;
}

function calculateMeanItemDifficulty(studentData, key) {
    let totalMatches = 0;
    let totalItems = 0;
    studentData.forEach(student => {
        for (let i = 0; i < key.length; i++) {
            totalItems++;
            if (student.responses[i] === key[i]) {
                totalMatches++;
            }
        }
    });
    return totalMatches / totalItems;
}

function calculateMeanDiscriminationIndex(studentData, key) {
    const numItems = key.length;
    let totalDiscriminationIndex = 0;

    for (let i = 0; i < numItems; i++) {
        const topGroup = studentData.filter(student => student.group === 't');
        const bottomGroup = studentData.filter(student => student.group === 'b');
        const ST = topGroup.filter(student => student.responses[i] === key[i]).length / topGroup.length;
        const SB = bottomGroup.filter(student => student.responses[i] === key[i]).length / bottomGroup.length;
        const discriminationIndex = ST - SB;
        totalDiscriminationIndex += discriminationIndex;
    }

    return totalDiscriminationIndex / numItems;
}

function calculateMeanPointBiserial(studentData, key) {
    const numItems = key.length;
    let totalPointBiserial = 0;

    // Compute total test scores for all students
    const totalScores = studentData.map(student => student.score);
    const meanTotalScore = totalScores.reduce((sum, score) => sum + score, 0) / studentData.length;
    const stdDevTotalScore = Math.sqrt(
        totalScores.reduce((sum, score) => sum + Math.pow(score - meanTotalScore, 2), 0) / studentData.length
    );

    for (let i = 0; i < numItems; i++) {
        // Separate students into correct and incorrect responses
        const correctGroup = studentData.filter(student => student.responses[i] === key[i]);
        const incorrectGroup = studentData.filter(student => student.responses[i] !== key[i]);

        const p = correctGroup.length / studentData.length;
        const q = 1 - p;

        if (p === 0 || q === 0) {
            continue; // Avoid division by zero
        }

        const meanCorrect = correctGroup.reduce((sum, student) => sum + student.score, 0) / correctGroup.length;
        const meanIncorrect = incorrectGroup.reduce((sum, student) => sum + student.score, 0) / incorrectGroup.length;

        // Compute point-biserial correlation for this item
        const pointBiserial = ((meanCorrect - meanIncorrect) / stdDevTotalScore) * Math.sqrt(p * q);

        totalPointBiserial += pointBiserial;
    }

    return totalPointBiserial / numItems; // Average point-biserial
}

function calculateMeanAdjPointBiserial(studentData, key) {
    const numItems = key.length;
    let totalAdjPointBiserial = 0;

    for (let i = 0; i < numItems; i++) {
        // Adjusted total scores (excluding the current item)
        const adjustedScores = studentData.map(student => {
            const itemScore = student.responses[i] === key[i] ? 1 : 0;
            return student.score - itemScore; // Remove item's contribution
        });

        // Compute mean and standard deviation of adjusted scores
        const meanAdjScore = adjustedScores.reduce((sum, score) => sum + score, 0) / studentData.length;
        const stdDevAdjScore = Math.sqrt(
            adjustedScores.reduce((sum, score) => sum + Math.pow(score - meanAdjScore, 2), 0) / studentData.length
        );

        // Separate students into correct and incorrect groups
        const correctGroup = studentData.filter(student => student.responses[i] === key[i]);
        const incorrectGroup = studentData.filter(student => student.responses[i] !== key[i]);

        const p = correctGroup.length / studentData.length;
        const q = 1 - p;

        if (p === 0 || q === 0 || stdDevAdjScore === 0) {
            continue; // Avoid division by zero
        }

        // Compute mean adjusted total scores for correct/incorrect groups
        const meanCorrectAdj = correctGroup.reduce((sum, student) => sum + (student.score - (student.responses[i] === key[i] ? 1 : 0)), 0) / correctGroup.length;
        const meanIncorrectAdj = incorrectGroup.reduce((sum, student) => sum + (student.score - (student.responses[i] === key[i] ? 1 : 0)), 0) / incorrectGroup.length;

        // Compute adjusted point-biserial correlation for this item
        const adjPointBiserial = ((meanCorrectAdj - meanIncorrectAdj) / stdDevAdjScore) * Math.sqrt(p * q);

        totalAdjPointBiserial += adjPointBiserial;
    }

    return totalAdjPointBiserial / numItems; // Average adjusted point-biserial
}


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

    sessionStorage.setItem('examineeResults', JSON.stringify({
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
    }));

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

function calculateQuickTestItemResults(studentData, key, include) {
    const numItemsExcluded = include.split('').filter(char => char.toLowerCase() === 'n').length;
    const numItemsAnalyzed = include.split('').filter(char => char.toLowerCase() === 'y').length;
    const meanItemDifficulty = calculateMeanItemDifficulty(studentData, key);
    const meanDiscriminationIndex = calculateMeanDiscriminationIndex(studentData, key);
    const meanPointBiserial = calculateMeanPointBiserial(studentData, key, include);
    const meanAdjPointBiserial = calculateMeanAdjPointBiserial(studentData, key, include);

    sessionStorage.setItem('testItemResults', JSON.stringify({
        numItemsExcluded,
        numItemsAnalyzed,
        meanItemDifficulty,
        meanDiscriminationIndex,
        meanPointBiserial,
        meanAdjPointBiserial
    }));

    return { numItemsExcluded, numItemsAnalyzed, meanItemDifficulty, meanDiscriminationIndex, meanPointBiserial, meanAdjPointBiserial };
}

function calculateItemResults(studentData, key){
    // For each item calculate #corrects in top and bottom groups
    const numItems = key.length;
    const numStudents = studentData.length;
    const itemResults = [];
    for (let i = 0; i < numItems; i++) {
        const topGroup = studentData.filter(student => student.group === 't');
        const bottomGroup = studentData.filter(student => student.group === 'b');
        const ST = topGroup.filter(student => student.responses[i] === key[i]).length;
        const SB = bottomGroup.filter(student => student.responses[i] === key[i]).length;
        itemResults.push({ST, SB});
        console.log(`Item ${i+1}: ST = ${ST}, SB = ${SB}`);
    }
    return itemResults;
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
    calculateMeanAdjPointBiserial,
    getDataFromFile,
    calculateQuickTestItemResults,
    calculateQuickExamineeResults
};
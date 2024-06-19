document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            processCSV(contents);
        };
        reader.readAsText(file);
    } else {
        alert('No file selected');
    }
}

function processCSV(csv) {
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

    const lines = csv.split('\n').slice(0, numberOfStudents);
    const scores = lines.map(line => calculateScore(line, key, include, offset));

    const result = calculateMetrics(scores);

    document.getElementById('result').innerText = formatResult(title, comments, result);

    const blob = new Blob([formatResult(title, comments, result)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'result.txt';
    downloadLink.style.display = 'block';
    downloadLink.innerText = 'Download Result';
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

function calculateMetrics(scores) {
    const numExaminees = scores.length;
    const totalPossibleScore = scores.length > 0 ? scores[0].length : 0;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const meanScore = math.mean(scores);
    const medianScore = math.median(scores);
    const stdDev = math.std(scores);
    const variance = math.var(scores);
    const skewness = math.skewness(scores);
    const kurtosis = math.kurtosis(scores);

    return {
        numExaminees,
        totalPossibleScore,
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

function formatResult(title, comments, metrics) {
    return `Title: ${title}\nComments: ${comments}\n` +
           `Number of Examinees: ${metrics.numExaminees}\n` +
           `Total Possible Score: ${metrics.totalPossibleScore}\n` +
           `Minimum Score: ${metrics.minScore.toFixed(3)} = ${(metrics.minScore / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Maximum Score: ${metrics.maxScore.toFixed(3)} = ${(metrics.maxScore / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Median Score: ${metrics.medianScore.toFixed(3)} = ${(metrics.medianScore / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Mean Score: ${metrics.meanScore.toFixed(3)} = ${(metrics.meanScore / metrics.totalPossibleScore * 100).toFixed(1)}%\n` +
           `Standard Deviation: ${metrics.stdDev.toFixed(3)}\n` +
           `Variance: ${metrics.variance.toFixed(3)}\n` +
           `Skewness: ${metrics.skewness.toFixed(3)}\n` +
           `Kurtosis: ${metrics.kurtosis.toFixed(3)}`;
}
document.getElementById('dataFileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
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

function processData(data) {
    const lines = data.split('\n');
    const result = calculateMetrics(lines);

    document.getElementById('result').innerText = result;

    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'result.txt';
    downloadLink.style.display = 'block';
    downloadLink.innerText = 'Download Result';
}

function calculateMetrics(lines) {
    // Example metric: Count the number of lines (excluding header)
    const numberOfLines = lines.length - 1; // Assuming the first line is a header
    return `Number of data lines: ${numberOfLines}`;
}

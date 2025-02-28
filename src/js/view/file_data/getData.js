import { processData } from '../../controller/dataProcessors.js';
import { validateInputs } from '../../controller/dataProcessors.js';
import { calculateQuickTestItemResults } from '../../controller/results/quickTestItem.js';

function handleFileSelect() {
    const fileInput = document.getElementById('dataFileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            getDataFromFile(contents);
        };
        reader.readAsText(file);
    } else {
        alert('No file selected');
    }
}

function getDataFromFile(data) {
    const lines = data.split('\n');
    const title = lines[0];
    const comments = lines[1];
    const numberOfStudents = parseInt(lines[2]);
    const numberOfItems = parseInt(lines[3]);
    const offset = parseInt(lines[4]);
    const key = lines[5];
    const options = lines[6];
    const include = lines[7];
    const studentData = lines.slice(8, 8 + numberOfStudents).join('\n');

    if (validateInputs(key, options, include, numberOfItems)) {
        const { totalPossibleScore, scores, result } = processData(numberOfStudents, offset, key, include, studentData);
        const quickTestItemResults = calculateQuickTestItemResults(studentData, key, include);
        showResults(title, comments, result, totalPossibleScore, quickTestItemResults);
    }
}

export { 
    handleFileSelect,
    getDataFromFile
};
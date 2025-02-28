import { processData } from '../../controller/dataProcessors.js';
import { validateInputs } from '../../controller/dataProcessors.js';
import { calculateQuickTestItemResults } from '../../controller/results/quickTestItem.js';
import { showResults } from '../results/results.js';

function handleFileSelect(fileInput) {
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
    if (studentData.length !== numberOfStudents || studentData.some(line => line.length !== numberOfItems)) {
        alert('Data format error: number of students or items does not match the specified values.');
        return;
    }

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
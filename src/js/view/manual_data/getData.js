import { processData, validateInputs } from '../../controller/dataProcessors.js';
import { calculateQuickTestItemResults } from '../../controller/results/quickTestItem.js';
import { showResults } from '../results/results.js';

function getDataFromManualInput(data) {
    const title = document.getElementById('title').value;
    const comments = document.getElementById('comments').value;
    const numberOfStudents = parseInt(document.getElementById('students').value);
    const numberOfItems = parseInt(document.getElementById('items').value);
    const offset = parseInt(document.getElementById('offset').value);
    const key = document.getElementById('key').value;
    const options = document.getElementById('options').value;
    const include = document.getElementById('include').value;
    const studentData = document.getElementById('manualDataInput').value.split('\n').slice(0, numberOfStudents);

    if (validateInputs (key, options, include, numberOfItems)){
        const { totalPossibleScore, scores, result } = processData(numberOfStudents, offset, key, include, studentData);
        const quickTestItemResults = calculateQuickTestItemResults(studentData, key, include);
        showResults(title, comments, result, totalPossibleScore, quickTestItemResults);
    }
}

export {
    getDataFromManualInput
};
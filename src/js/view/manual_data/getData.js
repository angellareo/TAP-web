import { processData, validateInputs } from '../../controller/dataProcessors.js';
import { showResults } from '../results/results.js';
import { getItemGridValues } from './itemGrid.js';
import { showNotification } from '../notifications.js';

function getDataFromManualInput() {
    const { key, options, include } = getItemGridValues();
    const numberOfStudents = parseInt(document.getElementById('students').value);
    return {
        title: document.getElementById('title').value,
        comments: document.getElementById('comments').value,
        numberOfStudents,
        numberOfItems: parseInt(document.getElementById('items').value),
        offset: parseInt(document.getElementById('offset').value) || 0,
        key,
        options,
        include,
        studentData: document.getElementById('manualDataInput').value
            .split('\n')
            .map(line => line.replace(/\r$/, ''))   // handle Windows line endings
            .filter(line => line.length > 0)         // drop blank lines
            .slice(0, numberOfStudents)
    };
}

function processDataFromManualInput() {
    const inputData = getDataFromManualInput();

    if (isNaN(inputData.numberOfItems) || inputData.numberOfItems < 1) {
        showNotification('Enter the number of test items to configure the answer key.', 'danger');
        return;
    }
    if (isNaN(inputData.numberOfStudents) || inputData.numberOfStudents < 1) {
        showNotification('Enter the number of students.', 'danger');
        return;
    }
    if (!inputData.studentData.length) {
        showNotification('Enter student response data in the Student Response Data section.', 'danger');
        return;
    }
    if (!validateInputs(inputData.key, inputData.options, inputData.include, inputData.numberOfItems)) {
        showNotification(
            `Answer key must have exactly ${inputData.numberOfItems} character(s). ` +
            'Complete the Answer Key String in the Items Configuration section.',
            'danger'
        );
        return;
    }
    try {
        const { totalPossibleScore } = processData(
            inputData.offset, inputData.key, inputData.options, inputData.include, inputData.studentData
        );
        showResults(inputData.title, inputData.comments, totalPossibleScore);
    } catch (err) {
        showNotification(`Analysis failed: ${err.message}`, 'danger');
    }
}

function saveDataFromManualInput() {
    const inputData = getDataFromManualInput();
    if (!validateInputs(inputData.key, inputData.options, inputData.include, inputData.numberOfItems)) {
        showNotification(
            `Answer key must have exactly ${inputData.numberOfItems} character(s). ` +
            'Complete the Answer Key String in the Items Configuration section.',
            'danger'
        );
        return;
    }
    const content = buildTapFileContent(inputData);
    const filename = (inputData.title || 'test-data').replace(/[^a-z0-9]/gi, '-') + '.tap';
    triggerDownload(content, filename);
    showNotification('File saved successfully.', 'success');
}

function buildTapFileContent({ title, comments, numberOfStudents, numberOfItems, offset, key, options, include, studentData }) {
    return [
        `title: ${title}`,
        `comments: ${comments}`,
        `nstudents: ${numberOfStudents}`,
        `nitems: ${numberOfItems}`,
        `noffset: ${offset}`,
        `key: ${key}`,
        `options: ${options}`,
        `include: ${include}`,
        'data:',
        ...studentData
    ].join('\n');
}

function triggerDownload(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export {
    processDataFromManualInput,
    saveDataFromManualInput
};
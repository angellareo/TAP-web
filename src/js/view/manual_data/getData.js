import { processData, validateInputs } from '../../controller/dataProcessors.js';
import { showResults } from '../results/results.js';
import { getItemGridValues } from './itemGrid.js';

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
            .slice(0, numberOfStudents)
    };
}

function processDataFromManualInput() {
    const inputData = getDataFromManualInput();
    if (validateInputs(inputData.key, inputData.options, inputData.include, inputData.numberOfItems)) {
        const { totalPossibleScore } = processData(
            inputData.offset, inputData.key, inputData.options, inputData.include, inputData.studentData
        );
        showResults(inputData.title, inputData.comments, totalPossibleScore);
    }
}

function saveDataFromManualInput() {
    const inputData = getDataFromManualInput();
    if (validateInputs(inputData.key, inputData.options, inputData.include, inputData.numberOfItems)) {
        const content = buildTapFileContent(inputData);
        const filename = (inputData.title || 'test-data').replace(/[^a-z0-9]/gi, '-') + '.tap';
        triggerDownload(content, filename);
    }
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
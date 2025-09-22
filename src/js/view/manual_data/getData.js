import { processData, validateInputs, calculateQuickTestItemResults } from '../../controller/dataProcessors.js';
import { showResults } from '../results/results.js';

function getDataFromManualInput(data) {
    const inputData = {
        title: document.getElementById('title').value,
        comments: document.getElementById('comments').value,
        numberOfStudents: parseInt(document.getElementById('students').value),
        numberOfItems: parseInt(document.getElementById('items').value),
        offset: parseInt(document.getElementById('offset').value),
        key: document.getElementById('key').value,
        options: document.getElementById('options').value,
        include: document.getElementById('include').value,
        studentData: document.getElementById('manualDataInput').value.split('\n').slice(0, parseInt(document.getElementById('students').value))
    };
    return inputData;
}

function processDataFromManualInput(data) {
    const inputData = getDataFromManualInput(data);
    if (validateInputs (inputData.key, inputData.options, inputData.include, inputData.numberOfItems)){
        const { totalPossibleScore, scores} = processData(inputData.offset, inputData.key,  inputData.options, inputData.include, inputData.studentData);
        showResults(inputData.title, inputData.comments, inputData.result, totalPossibleScore);
    }
}

function saveDataFromManualInput(data) {
    const inputData = getDataFromManualInput(data);
    if (validateInputs (key, options, include, numberOfItems)){
        // Print to console for now; later, implement saving to file
        console.log("Saving Data:");
        console.log("Title:", title);
        console.log("Comments:", comments);
        console.log("Number of Students:", numberOfStudents);
        console.log("Number of Items:", numberOfItems);
        console.log("Offset:", offset);
        console.log("Key:", key);
        console.log("Options:", options);
        console.log("Include:", include);
        console.log("Student Data:", studentData);
        alert("Data saved to console (for now).");
    }
}

export {
    processDataFromManualInput,
    saveDataFromManualInput
};
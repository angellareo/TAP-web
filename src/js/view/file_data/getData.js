import { processData, getDataFromFile, calculateQuickTestItemResults } from '../../controller/dataProcessors.js';
import { showResults } from '../results/results.js';

function handleFileSelect(fileInput) {
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            handleDataLoad(contents);
        };
        reader.readAsText(file);
    } else {
        alert('No file selected');
    }
}

function handleDataLoad(data) {
    const {
        title,
        comments, 
        offset, 
        key, 
        options, 
        include, 
        studentData
    } = getDataFromFile(data);
    processData(offset, key, options, include, studentData);
    showResults(title, comments);
}

export { 
    handleFileSelect,
    handleDataLoad
};
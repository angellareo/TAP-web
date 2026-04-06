import { processData, getDataFromFile } from '../../controller/dataProcessors.js';
import { showResults } from '../results/results.js';
import { showNotification } from '../notifications.js';

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
    const result = getDataFromFile(data);
    if (!result) {
        showNotification(
            'Data format error: the number of students or items does not match the specified values.',
            'danger'
        );
        return;
    }
    const { title, comments, offset, key, options, include, studentData } = result;
    processData(offset, key, options, include, studentData);
    showResults(title, comments);
}
}

export { 
    handleFileSelect,
    handleDataLoad
};
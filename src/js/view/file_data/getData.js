import { processData, getDataFromFile } from '../../controller/dataProcessors.js';
import { showResults } from '../results/results.js';
import { showNotification } from '../notifications.js';
import { withLoading } from '../loading.js';

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
            'Data format error: check that the number of students, items, and offset match the actual data rows.',
            'danger'
        );
        return;
    }
    const { title, comments, offset, key, options, include, studentData } = result;
    withLoading(() => {
        try {
            const { totalPossibleScore } = processData(offset, key, options, include, studentData);
            showResults(title, comments, totalPossibleScore);
        } catch (err) {
            showNotification(`Analysis failed: ${err.message}`, 'danger');
        }
    });
}

export { 
    handleFileSelect,
    handleDataLoad
};
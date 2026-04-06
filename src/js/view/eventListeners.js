import { processDataFromManualInput, saveDataFromManualInput } from './manual_data/getData.js';
import { handleFileSelect } from './file_data/getData.js';
import { showNotification } from './notifications.js';

export function initializeEventListeners() {
    
    // INDEX screen
    const mainMenu = document.querySelector('.main-menu');
    const editDataButton = document.getElementById('editDataButton');
    const loadDataButton = document.getElementById('loadDataButton');

    if (editDataButton) {
        editDataButton.addEventListener('click', () => {
            mainMenu.classList.add('hidden');
            editDataContainer.classList.remove('hidden');
            editDataContainer.classList.add('fade-in');
        });
    }

    if (loadDataButton) {
        loadDataButton.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.dat';
            fileInput.onchange = () => handleFileSelect(fileInput);
            fileInput.click();
        });
    }

    const generateSampleDataButton = document.getElementById('generateSampleDataButton');
    if (generateSampleDataButton) {
        generateSampleDataButton.addEventListener('click', () => {
            showNotification('Generate Sample Data is not yet implemented.', 'info');
        });
    }

    // LOAD DATA screen (not needed?)
    const loadDataContainer = document.getElementById('loadDataContainer');
    const backButton1 = document.getElementById('backButton1');

    if (backButton1) {
        backButton1.addEventListener('click', () => {
            loadDataContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    // EDIT DATA screen
    const backButton2 = document.getElementById('backButton2');
    const editDataContainer = document.getElementById('editDataContainer');
    const saveDataButton = document.getElementById('saveDataButton');
    const processManualDataButton = document.getElementById('processManualDataButton');

    if (backButton2) {
        backButton2.addEventListener('click', () => {
            editDataContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    if (saveDataButton) {
        saveDataButton.addEventListener('click', () => {
            saveDataFromManualInput();
        });
    }

    if (processManualDataButton) {
        processManualDataButton.addEventListener('click', () => {
            processDataFromManualInput();
        });
    }

    // RESULTS screen    
    const backButton3 = document.getElementById('backButton3');
    const resultsContainer = document.getElementById('resultsContainer');

    if (backButton3) {
        backButton3.addEventListener('click', () => {
            resultsContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

}
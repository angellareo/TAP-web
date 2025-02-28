import { getDataFromManualInput } from './manual_data/getData.js';
import { handleFileSelect } from './file_data/getData.js';

export function initializeEventListeners() {
    const loadDataButton = document.getElementById('loadDataButton');
    const editDataButton = document.getElementById('editDataButton');
    const loadDataContainer = document.getElementById('loadDataContainer');
    const editDataContainer = document.getElementById('editDataContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const mainMenu = document.querySelector('.main-menu');
    const backButton1 = document.getElementById('backButton1');
    const backButton2 = document.getElementById('backButton2');
    const backButton3 = document.getElementById('backButton3');
    const processManualDataButton = document.getElementById('processManualDataButton');

    if (editDataButton) {
        editDataButton.addEventListener('click', () => {
            mainMenu.classList.add('hidden');
            editDataContainer.classList.remove('hidden');
            editDataContainer.classList.add('fade-in');
        });
    }

    if (backButton1) {
        backButton1.addEventListener('click', () => {
            loadDataContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    if (backButton2) {
        backButton2.addEventListener('click', () => {
            editDataContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    if (backButton3) {
        backButton3.addEventListener('click', () => {
            resultsContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    if (processManualDataButton) {
        processManualDataButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent page reload
            const manualData = document.getElementById('manualDataInput').value;
            getDataFromManualInput(manualData);
        });
    }

    if (loadDataButton) {
        loadDataButton.addEventListener('click', () => {
            handleFileSelect();
        });
    }
}
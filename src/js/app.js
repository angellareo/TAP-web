import * as view from './view/eventListeners.js';
import { initItemGrid } from './view/manual_data/itemGrid.js';
import { initValidationGrid } from './view/manual_data/validationGrid.js';

document.addEventListener('DOMContentLoaded', () => {
    view.initializeEventListeners();
    initItemGrid();
    initValidationGrid();
});

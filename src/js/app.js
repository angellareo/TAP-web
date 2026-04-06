import * as view from './view/eventListeners.js';
import * as counters from './view/manual_data/counters.js';
import { initItemGrid } from './view/manual_data/itemGrid.js';

document.addEventListener('DOMContentLoaded', () => {
    counters.initializeEventListeners();
    view.initializeEventListeners();
    initItemGrid();
});

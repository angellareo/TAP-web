import * as view from './view/eventListeners.js';
import * as counters from './view/manual_data/counters.js' ;

document.addEventListener('DOMContentLoaded', () => {
    view.initializeEventListeners();
    counters.initializeEventListeners();
});

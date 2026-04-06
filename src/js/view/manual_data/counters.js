/**
 * counters.js
 * Character-counter helpers for text inputs that display a live character count.
 * The key/options/include inputs were replaced by the itemGrid; this module is
 * kept for any future counter-enabled inputs.
 */

function updateCounter(inputId, counterId) {
    const input   = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    if (input && counter) counter.textContent = input.value.length;
}

// eslint-disable-next-line no-unused-vars
function initializeEventListeners() {
    // No counter-enabled inputs currently active.
    // Add listeners here when new inputs with char counters are introduced.
}

export {
    updateCounter,
    initializeEventListeners
};

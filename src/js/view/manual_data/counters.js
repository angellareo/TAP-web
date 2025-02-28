function initializeEventListeners() {
    const keyInput = document.getElementById('key');
    if (keyInput) {
        keyInput.addEventListener('input', () => updateCounter('key', 'charCounterKey'));
    }

    const optionsInput = document.getElementById('options');
    if (optionsInput) {
        optionsInput.addEventListener('input', () => updateCounter('options', 'charCounterOptions'));
    }

    const includeInput = document.getElementById('include');
    if (includeInput) {
        includeInput.addEventListener('input', () => updateCounter('include', 'charCounterInclude'));
    }
}

function updateCounter(inputId, counterId) {
    let input = document.getElementById(inputId);
    let counter = document.getElementById(counterId);
    counter.textContent = input.value.length;
}

export {
    updateCounter, 
    initializeEventListeners
};
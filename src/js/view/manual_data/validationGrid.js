/**
 * validationGrid.js
 * Renders a live alignment preview below the student-data textarea.
 * Each row is colour-coded:
 *   green  — correct length (offset + numItems)
 *   red    — wrong length, with an inline error message
 * A ruler shows the column positions so the user can spot misalignments.
 */

function initValidationGrid() {
    const textarea    = document.getElementById('manualDataInput');
    const itemsInput  = document.getElementById('items');
    const offsetInput = document.getElementById('offset');
    if (!textarea) return;

    const handler = () => renderValidationGrid();
    textarea.addEventListener('input', handler);
    if (itemsInput)  itemsInput.addEventListener('change', handler);
    if (offsetInput) offsetInput.addEventListener('change', handler);
}

function renderValidationGrid() {
    const container   = document.getElementById('validationGridContainer');
    if (!container) return;

    const textarea    = document.getElementById('manualDataInput');
    const itemsInput  = document.getElementById('items');
    const offsetInput = document.getElementById('offset');

    const raw      = textarea ? textarea.value : '';
    const numItems = parseInt(itemsInput  ? itemsInput.value  : '0') || 0;
    const offset   = parseInt(offsetInput ? offsetInput.value : '0') || 0;
    const expected = offset + numItems;

    const lines = raw.split('\n').filter(l => l.length > 0);

    if (lines.length === 0 || numItems === 0) {
        container.innerHTML = '';
        return;
    }

    // --- ruler ---
    let rulerHtml = '';
    for (let i = 0; i < offset; i++) {
        rulerHtml += `<span class="vg-offset">·</span>`;
    }
    for (let i = 0; i < numItems; i++) {
        rulerHtml += `<span class="vg-col">${(i + 1) % 10}</span>`;
    }

    // --- rows ---
    let rowsHtml = '';
    lines.forEach((line, idx) => {
        const ok    = line.length === expected;
        const chars = line.split('').map((ch, i) => {
            const cls = i < offset ? 'vg-offset' : 'vg-item';
            return `<span class="${cls}">${ch}</span>`;
        }).join('');
        const errMsg = ok
            ? ''
            : `<span class="vg-error-msg text-danger"> ← expected ${expected}, got ${line.length}</span>`;
        rowsHtml += `
            <div class="vg-row ${ok ? 'vg-row-ok' : 'vg-row-err'}">
                <span class="vg-linenum">${idx + 1}</span>${chars}${errMsg}
            </div>`;
    });

    container.innerHTML = `
        <div class="validation-grid font-monospace small">
            <div class="vg-ruler text-muted">${rulerHtml}</div>
            <div class="vg-rows">${rowsHtml}</div>
        </div>`;
}

export { initValidationGrid, renderValidationGrid };

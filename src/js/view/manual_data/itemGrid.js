/**
 * itemGrid.js
 * Manages the Items Configuration section:
 *   - A single key-string input (e.g. "ACBAABAABC") that populates all columns at once.
 *   - A transposed table where each column is one item, with rows: Key / # Options / Include.
 */

function initItemGrid() {
    const itemsInput = document.getElementById('items');
    if (!itemsInput) return;

    const handler = () => {
        const n = parseInt(itemsInput.value);
        if (!isNaN(n) && n > 0) renderItemGrid(n);
        else clearItemGrid();
    };

    itemsInput.addEventListener('input', handler);
    itemsInput.addEventListener('change', handler);

    const initial = parseInt(itemsInput.value);
    if (!isNaN(initial) && initial > 0) renderItemGrid(initial);
}

function renderItemGrid(numItems) {
    const container = document.getElementById('itemGridContainer');
    if (!container) return;

    // Preserve existing config if re-rendering (e.g. items count changed)
    const prevOptions = Array.from(container.querySelectorAll('.item-options')).map(s => s.value || '4');
    const prevInclude = Array.from(container.querySelectorAll('.item-include')).map(c => c.checked);
    const prevKeyStr  = document.getElementById('keyStringInput')?.value || '';

    const indices = Array.from({ length: numItems }, (_, i) => i);

    const headerCells = indices.map(i =>
        `<th class="text-center small px-2" scope="col">${i + 1}</th>`
    ).join('');

    const keyCells = indices.map(() =>
        `<td class="text-center font-monospace item-key-display align-middle py-1">—</td>`
    ).join('');

    const optsCells = indices.map(i => {
        const v = prevOptions[i] || '4';
        return `<td class="px-1 py-1">
            <select class="form-select form-select-sm item-options" aria-label="Options item ${i + 1}" style="min-width:3.5rem;">
                ${['2','3','4','5'].map(n => `<option value="${n}"${v === n ? ' selected' : ''}>${n}</option>`).join('')}
            </select>
        </td>`;
    }).join('');

    const includeCells = indices.map(i => {
        const inc = prevInclude[i] !== undefined ? prevInclude[i] : true;
        return `<td class="text-center align-middle py-1">
            <input type="checkbox" class="form-check-input item-include"${inc ? ' checked' : ''}
                aria-label="Include item ${i + 1}">
        </td>`;
    }).join('');

    const safeKeyStr = prevKeyStr.replace(/"/g, '&quot;');

    container.innerHTML = `
        <div class="mb-2">
            <label for="keyStringInput" class="form-label small fw-semibold mb-1">
                Answer Key String
                <span class="text-muted fw-normal">(type or paste the full answer key, e.g. <code>ACBAABAABC</code>)</span>
            </label>
            <input type="text" id="keyStringInput" class="form-control font-monospace"
                value="${safeKeyStr}"
                placeholder="e.g. ACBAABAABC"
                autocomplete="off" spellcheck="false"
                aria-label="Full answer key string">
        </div>
        <div class="table-responsive">
            <table class="table table-sm table-bordered item-grid-table mb-0">
                <thead class="table-light">
                    <tr>
                        <th scope="col" style="min-width:6rem;"></th>
                        ${headerCells}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row" class="align-middle text-nowrap small fw-semibold text-muted">Key</th>
                        ${keyCells}
                    </tr>
                    <tr>
                        <th scope="row" class="align-middle text-nowrap small fw-semibold text-muted"># Options</th>
                        ${optsCells}
                    </tr>
                    <tr>
                        <th scope="row" class="align-middle text-nowrap small fw-semibold text-muted">Include</th>
                        ${includeCells}
                    </tr>
                </tbody>
            </table>
        </div>`;

    // Wire key-string input → column display cells
    const keyStringInput = document.getElementById('keyStringInput');
    if (prevKeyStr) updateKeyDisplayCells(prevKeyStr.toUpperCase());
    keyStringInput.addEventListener('input', () => {
        updateKeyDisplayCells(keyStringInput.value.toUpperCase());
    });
}

/** Update the read-only key display cells from the string input */
function updateKeyDisplayCells(str) {
    const cells = document.querySelectorAll('#itemGridContainer .item-key-display');
    cells.forEach((cell, i) => {
        cell.textContent = str[i] !== undefined && str[i].trim() !== '' ? str[i] : '—';
    });
}

function clearItemGrid() {
    const container = document.getElementById('itemGridContainer');
    if (container) {
        container.innerHTML = '<p class="text-muted small mb-0">Set the number of test items above to configure each item.</p>';
    }
}

/**
 * Returns { key, options, include } strings from the current grid state.
 * key is taken from the keyStringInput, padded to numItems with '?' if shorter.
 */
function getItemGridValues() {
    const container      = document.getElementById('itemGridContainer');
    const keyStr         = (document.getElementById('keyStringInput')?.value || '').toUpperCase();
    const optSelects     = container ? Array.from(container.querySelectorAll('.item-options'))    : [];
    const incCheckboxes  = container ? Array.from(container.querySelectorAll('.item-include'))   : [];
    const numItems       = optSelects.length;

    const key     = Array.from({ length: numItems }, (_, i) => keyStr[i] || '?').join('');
    const options = optSelects.map(s => s.value || '4').join('');
    const include = incCheckboxes.map(c => c.checked ? 'Y' : 'N').join('');

    return { key, options, include };
}

export { initItemGrid, renderItemGrid, getItemGridValues };

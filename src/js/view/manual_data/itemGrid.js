/**
 * itemGrid.js
 * Manages the Items Configuration section:
 *   - A single key-string input (e.g. "ACBAABAABC") that populates all rows at once.
 *   - A per-item table for # options and Include toggles.
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

/**
 * Sync the key-string input → individual key cells, or the reverse.
 * direction: 'string-to-cells' | 'cells-to-string'
 */
function syncKey(direction) {
    const keyStringInput = document.getElementById('keyStringInput');
    const keyCells = document.querySelectorAll('#itemGridBody .item-key');
    if (!keyStringInput || !keyCells.length) return;

    if (direction === 'string-to-cells') {
        const chars = keyStringInput.value.toUpperCase().split('');
        keyCells.forEach((cell, i) => {
            cell.value = chars[i] !== undefined ? chars[i] : '';
        });
    } else {
        keyStringInput.value = Array.from(keyCells).map(c => c.value || '').join('');
    }
}

function renderItemGrid(numItems) {
    const container = document.getElementById('itemGridContainer');
    if (!container) return;

    // Preserve existing config if re-rendering (e.g. items count changed)
    const existingRows = document.querySelectorAll('#itemGridBody tr');
    const prevOptions = [], prevInclude = [];
    existingRows.forEach(row => {
        prevOptions.push(row.querySelector('.item-options')?.value || '4');
        prevInclude.push(row.querySelector('.item-include')?.checked ?? true);
    });

    let rows = '';
    for (let i = 0; i < numItems; i++) {
        const opts = prevOptions[i] || '4';
        const inc  = prevInclude[i] !== undefined ? prevInclude[i] : true;
        rows += `
            <tr>
                <td class="text-muted align-middle text-center small">${i + 1}</td>
                <td class="align-middle font-monospace text-center item-key-display">—</td>
                <td>
                    <select class="form-select form-select-sm item-options" style="width:5rem;"
                        aria-label="Number of options for item ${i + 1}">
                        <option value="2" ${opts==='2'?'selected':''}>2</option>
                        <option value="3" ${opts==='3'?'selected':''}>3</option>
                        <option value="4" ${opts==='4'?'selected':''}>4</option>
                        <option value="5" ${opts==='5'?'selected':''}>5</option>
                    </select>
                </td>
                <td class="text-center align-middle">
                    <input type="checkbox" class="form-check-input item-include" ${inc?'checked':''}
                        aria-label="Include item ${i + 1} in analysis">
                </td>
            </tr>`;
    }

    container.innerHTML = `
        <div class="mb-2">
            <label for="keyStringInput" class="form-label small fw-semibold mb-1">
                Answer Key String
                <span class="text-muted fw-normal">(paste or type the full answer key, e.g. <code>ACBAABAABC</code>)</span>
            </label>
            <input type="text" id="keyStringInput" class="form-control font-monospace"
                placeholder="e.g. ACBAABAABC"
                autocomplete="off" spellcheck="false"
                aria-label="Full answer key string">
        </div>
        <div class="table-responsive" style="max-height:220px;overflow-y:auto;">
            <table class="table table-sm table-bordered item-grid-table mb-0">
                <thead class="table-light sticky-top">
                    <tr>
                        <th style="width:3rem;">#</th>
                        <th style="width:5rem;">Key</th>
                        <th># Options</th>
                        <th>Include</th>
                    </tr>
                </thead>
                <tbody id="itemGridBody">${rows}</tbody>
            </table>
        </div>`;

    // Wire the key-string input → cell display
    const keyStringInput = document.getElementById('keyStringInput');
    keyStringInput.addEventListener('input', () => {
        updateKeyDisplayCells(keyStringInput.value.toUpperCase());
    });
}

/** Update the read-only key display cells from the string input */
function updateKeyDisplayCells(str) {
    const cells = document.querySelectorAll('#itemGridBody .item-key-display');
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
 * key is taken from the keyStringInput, trimmed to numItems chars.
 */
function getItemGridValues() {
    const rows    = document.querySelectorAll('#itemGridBody tr');
    const keyStr  = (document.getElementById('keyStringInput')?.value || '').toUpperCase();
    let options = '', include = '';
    rows.forEach((row, i) => {
        options += row.querySelector('.item-options').value || '4';
        include += row.querySelector('.item-include').checked ? 'Y' : 'N';
    });
    // key: use keyStringInput, padded/trimmed to match row count
    const key = Array.from(rows).map((_, i) => keyStr[i] || '1').join('');
    return { key, options, include };
}

export { initItemGrid, renderItemGrid, getItemGridValues };

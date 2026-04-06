/**
 * itemGrid.js
 * Manages the per-item configuration table (correct answer, # options, include toggle).
 * Replaces the old flat key/options/include text inputs.
 */

function initItemGrid() {
    const itemsInput = document.getElementById('items');
    if (!itemsInput) return;

    const handler = () => {
        const n = parseInt(itemsInput.value);
        if (!isNaN(n) && n > 0) renderItemGrid(n);
        else clearItemGrid();
    };

    // 'input' fires on every keystroke; 'change' fires on blur — listen to both
    itemsInput.addEventListener('input', handler);
    itemsInput.addEventListener('change', handler);

    // Render immediately if a value is already present (e.g. prefilled by browser)
    const initial = parseInt(itemsInput.value);
    if (!isNaN(initial) && initial > 0) renderItemGrid(initial);
}

function renderItemGrid(numItems) {
    const container = document.getElementById('itemGridContainer');
    if (!container) return;

    let rows = '';
    for (let i = 1; i <= numItems; i++) {
        rows += `
            <tr>
                <td class="text-muted align-middle text-center">${i}</td>
                <td>
                    <input type="text" class="form-control form-control-sm item-key"
                        maxlength="1" value="1"
                        style="width:3.5rem;text-align:center;"
                        aria-label="Correct answer for item ${i}">
                </td>
                <td>
                    <select class="form-select form-select-sm item-options" style="width:5rem;"
                        aria-label="Number of options for item ${i}">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4" selected>4</option>
                        <option value="5">5</option>
                    </select>
                </td>
                <td class="text-center align-middle">
                    <input type="checkbox" class="form-check-input item-include" checked
                        aria-label="Include item ${i} in analysis">
                </td>
            </tr>`;
    }

    container.innerHTML = `
        <div class="table-responsive" style="max-height:260px;overflow-y:auto;">
            <table class="table table-sm table-bordered item-grid-table mb-0">
                <thead class="table-light sticky-top">
                    <tr>
                        <th style="width:3rem;">#</th>
                        <th>Correct Answer</th>
                        <th># Options</th>
                        <th>Include</th>
                    </tr>
                </thead>
                <tbody id="itemGridBody">${rows}</tbody>
            </table>
        </div>`;
}

function clearItemGrid() {
    const container = document.getElementById('itemGridContainer');
    if (container) {
        container.innerHTML = '<p class="text-muted small mb-0">Set the number of test items above to configure each item.</p>';
    }
}

/**
 * Reads the current grid values and returns { key, options, include } strings,
 * compatible with dataProcessors expectations.
 */
function getItemGridValues() {
    const rows = document.querySelectorAll('#itemGridBody tr');
    let key = '', options = '', include = '';
    rows.forEach(row => {
        key     += (row.querySelector('.item-key').value || '1').charAt(0);
        options += row.querySelector('.item-options').value || '4';
        include += row.querySelector('.item-include').checked ? 'Y' : 'N';
    });
    return { key, options, include };
}

export { initItemGrid, renderItemGrid, getItemGridValues };

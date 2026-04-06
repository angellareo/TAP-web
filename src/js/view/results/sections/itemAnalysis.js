/**
 * itemAnalysis.js
 * Renders the Item & Test Analysis tab content from sessionStorage data.
 * Per-item values come from 'perItemResults' stored by dataProcessors.
 * Aggregate summaries come from 'testItemResults'.
 */

const fmt = (v, dec = 3) => (v !== null && v !== undefined ? v.toFixed(dec) : '—');

function renderItemRow(item) {
    const flag = item.isProblem ? ' <span class="text-danger fw-bold">#</span>' : '';
    return `
        <tr class="${item.isProblem ? 'table-warning' : ''}">
            <td class="text-nowrap">Item ${String(item.itemNumber).padStart(2, '0')}${flag}</td>
            <td class="text-center">${item.key}</td>
            <td class="text-end">${item.numCorrect}</td>
            <td class="text-end">${fmt(item.difficulty)}</td>
            <td class="text-end">${fmt(item.discIndex)}</td>
            <td class="text-end">${item.nTopCorrect} (${fmt(item.ST)})</td>
            <td class="text-end">${item.nBottomCorrect} (${fmt(item.SB)})</td>
            <td class="text-end">${item.pointBiserial !== null ? fmt(item.pointBiserial) : '—'}</td>
            <td class="text-end">${item.adjPointBiserial !== null ? fmt(item.adjPointBiserial) : '—'}</td>
        </tr>`;
}

export function renderItemAnalysis() {
    const items = JSON.parse(sessionStorage.getItem('perItemResults') || '[]');
    const summary = JSON.parse(sessionStorage.getItem('testItemResults') || '{}');
    if (!items.length) return '<p class="text-danger">No item data found.</p>';

    const tableRows = items.map(renderItemRow).join('');
    const problemCount = items.filter(i => i.isProblem).length;

    const summaryRows = [
        ['Number of Items Excluded',    summary.numItemsExcluded],
        ['Number of Items Analyzed',    summary.numItemsAnalyzed],
        ['Mean Item Difficulty',         fmt(summary.meanItemDifficulty)],
        ['Mean Discrimination Index',    fmt(summary.meanDiscriminationIndex)],
        ['Mean Point Biserial',          fmt(summary.meanPointBiserial)],
        ['Mean Adj. Point Biserial',     fmt(summary.meanAdjPointBiserial)],
        ['# Potential Problem Items (#)', problemCount],
    ].map(([label, value]) => `
        <tr><td class="fw-semibold text-nowrap">${label}</td><td>${value}</td></tr>
    `).join('');

    return `
        <h5 class="mb-3">Item &amp; Test Analysis</h5>
        <p class="small text-muted">
            <span class="text-danger fw-bold">#</span> marks potential problems
            (difficulty ≤ 0.20 or ≥ 0.95, D &lt; 0, or AdjPtBis &lt; 0).
        </p>
        <div class="table-responsive mb-4">
            <table class="table table-sm table-bordered table-hover">
                <thead class="table-light">
                    <tr>
                        <th>Item</th>
                        <th>Key</th>
                        <th class="text-end"># Correct</th>
                        <th class="text-end">Difficulty</th>
                        <th class="text-end">Disc. Index</th>
                        <th class="text-end">High Grp</th>
                        <th class="text-end">Low Grp</th>
                        <th class="text-end">Pt Biserial</th>
                        <th class="text-end">Adj Pt Bis</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
        <h6 class="mb-2">Summary</h6>
        <div class="table-responsive mb-4">
            <table class="table table-sm table-bordered w-auto">
                <tbody>${summaryRows}</tbody>
            </table>
        </div>
        <hr>
        <div class="text-muted fst-italic small">
            KR20 / KR21, SEM, split-half reliability, Spearman-Brown Prophecy —
            <em>to be implemented</em>
        </div>`;
}

/**
 * scoreDistribution.js
 * Renders the Score Distribution tab:
 *   - Frequency table (Z, rel-freq, cum-freq, cum%, percentile rank, stanine, normalized Z)
 *   - Bar chart
 *   - Stem-and-leaf display
 */

const fmt  = (v, dec = 3) => (v !== null && v !== undefined && !isNaN(v)) ? Number(v).toFixed(dec) : '—';
const fmt2 = (v)           => fmt(v, 2);

// ─── Frequency table ──────────────────────────────────────────────────────────

function renderFrequencyTable(rows, n) {
    const tbody = rows.map(r => `
        <tr>
            <td class="fw-semibold">${r.score}</td>
            <td class="text-end font-monospace">${fmt2(r.zScore)}</td>
            <td class="text-end">${r.freq}</td>
            <td class="text-end font-monospace">${fmt(r.relFreq)}</td>
            <td class="text-end">${r.cumFreq}</td>
            <td class="text-end font-monospace">${fmt2(r.cumPercent)}</td>
            <td class="text-end font-monospace">${fmt2(r.percentileRank)}</td>
            <td class="text-center">${r.stanine}</td>
            <td class="text-end font-monospace">${fmt2(r.normalizedZ)}</td>
        </tr>`).join('');

    const tfoot = `
        <tfoot class="table-light fw-semibold">
            <tr>
                <td>Totals</td>
                <td></td>
                <td class="text-end">${n}</td>
                <td class="text-end font-monospace">1.000</td>
                <td colspan="5"></td>
            </tr>
        </tfoot>`;

    return `
        <div class="table-responsive mb-4">
            <table class="table table-sm table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Score</th>
                        <th class="text-end">Z</th>
                        <th class="text-end">Freq</th>
                        <th class="text-end">Rel. Freq</th>
                        <th class="text-end">Cum. Freq</th>
                        <th class="text-end">Cum. %</th>
                        <th class="text-end">Pct Rank</th>
                        <th class="text-center">Stanine</th>
                        <th class="text-end">Norm. Z</th>
                    </tr>
                </thead>
                <tbody>${tbody}</tbody>
                ${tfoot}
            </table>
        </div>`;
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function renderBarChart(rows) {
    const minScore = rows[0].score;
    const maxScore = rows[rows.length - 1].score;
    const freqMap  = {};
    rows.forEach(r => { freqMap[r.score] = r.freq; });
    const maxFreq  = Math.max(...rows.map(r => r.freq));

    let bars = '';
    for (let s = minScore; s <= maxScore; s++) {
        const freq  = freqMap[s] || 0;
        const width = maxFreq > 0 ? (freq / maxFreq * 100) : 0;
        bars += `
            <div class="d-flex align-items-center mb-1" style="gap:.5rem">
                <div class="text-end font-monospace small text-muted" style="width:3.5rem">${s.toFixed(2)}</div>
                <div style="flex:1;min-width:0">
                    <div class="bg-primary rounded-end"
                         style="height:1.25rem;width:${width}%;min-width:${freq > 0 ? '3px' : '0'}"></div>
                </div>
                <div class="small text-muted" style="width:2rem;text-align:right">${freq > 0 ? freq : ''}</div>
            </div>`;
    }

    return `
        <h6 class="mb-2">Bar Chart</h6>
        <div class="mb-4 ps-1">${bars}</div>`;
}

// ─── Stem-and-leaf ────────────────────────────────────────────────────────────

function renderStemLeaf(rows, totalPossibleScore) {
    const maxScore  = rows[rows.length - 1].score;
    const allScores = [];
    rows.forEach(r => { for (let i = 0; i < r.freq; i++) allScores.push(r.score); });

    /*
     * Split-stem: when the score range fits within a single tens value (≤ 10 gap),
     * each tens-stem is shown twice — L row for leaves 0–4, H row for leaves 5–9.
     * Otherwise standard stems (tens digit) with leaves (units digit).
     */
    const split   = maxScore < 20;
    const stemMap = new Map();

    allScores.forEach(s => {
        const stem = Math.floor(s / 10);
        const leaf = s % 10;
        const key  = split ? `${stem}${leaf <= 4 ? 'L' : 'H'}` : String(stem);
        if (!stemMap.has(key)) stemMap.set(key, { stem, isHigh: leaf > 4, leaves: [] });
        stemMap.get(key).leaves.push(leaf);
    });

    const sorted = Array.from(stemMap.entries()).sort(([, a], [, b]) => {
        if (a.stem !== b.stem) return a.stem - b.stem;
        return a.isHigh ? 1 : -1;
    });

    const lines = sorted.map(([, row]) => {
        const leaves = row.leaves.sort((a, b) => a - b).join('');
        return String(row.stem).padStart(3) + ' . ' + leaves;
    }).join('\n');

    const width = split ? 10 : Math.max(10, (totalPossibleScore || 10) + 1);

    return `
        <h6 class="mb-2">Stem-and-Leaf Display</h6>
        <pre class="border rounded p-3 bg-light small mb-0" style="white-space:pre">Stem Leaves (width=${width})
---- -----------------
${lines}</pre>`;
}

// ─── Public render ────────────────────────────────────────────────────────────

export function renderScoreDistribution() {
    const stored = JSON.parse(sessionStorage.getItem('scoreDistribution') || 'null');
    if (!stored || !stored.rows || !stored.rows.length) {
        return '<p class="text-danger">No score distribution data found.</p>';
    }
    const { rows, totalPossibleScore } = stored;
    const n = rows.reduce((sum, r) => sum + r.freq, 0);

    return `
        <h5 class="mb-3">Score Distribution</h5>
        ${renderFrequencyTable(rows, n)}
        ${renderBarChart(rows)}
        ${renderStemLeaf(rows, totalPossibleScore)}`;
}

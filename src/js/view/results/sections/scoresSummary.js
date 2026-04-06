/**
 * scoresSummary.js
 * Renders the Examinee Score Summary tab content from sessionStorage data.
 */

const fmt = (v, dec = 3) => (v !== null && v !== undefined && !isNaN(v)) ? Number(v).toFixed(dec) : '—';

export function renderScoresSummary() {
    const totalPossibleScore = Number(sessionStorage.getItem('totalPossibleScore'));
    const m = JSON.parse(sessionStorage.getItem('examineeResults'));
    if (!m) return '<p class="text-danger">No examinee data found.</p>';

    const pct = v => `${(v / totalPossibleScore * 100).toFixed(1)}%`;
    const fmtScore = v => `${fmt(v)} = ${pct(v)}`;

    const rows = [
        ['Number of Examinees', m.numExaminees],
        ['Total Possible Score', totalPossibleScore],
        ['Minimum Score',  fmtScore(m.minScore)],
        ['Maximum Score',  fmtScore(m.maxScore)],
        ['Median Score',   fmtScore(m.median)],
        ['Mean Score',     fmtScore(m.mean)],
        ['Std Deviation (population)', fmt(m.stdDevPop)],
        ['Std Deviation (sample)',     fmt(m.stdDevSamp)],
        ['Variance (population)',      fmt(m.varPop)],
        ['Variance (sample)',          fmt(m.varSamp)],
        ['Skewness',  fmt(m.skewness)],
        ['Kurtosis',  fmt(m.kurtosis)],
    ].map(([label, value]) => `
        <tr><td class="fw-semibold text-nowrap">${label}</td><td>${value}</td></tr>
    `).join('');

    return `
        <h5 class="mb-3">Examinee Score Summary</h5>
        <div class="table-responsive">
            <table class="table table-sm table-bordered w-auto">
                <tbody>${rows}</tbody>
            </table>
        </div>
        <hr>
        <div class="text-muted fst-italic small">
            Score distribution chart — <em>to be implemented</em>
        </div>`;
}

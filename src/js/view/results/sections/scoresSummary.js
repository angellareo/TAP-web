/**
 * scoresSummary.js
 * Renders the Examinee Score Summary tab content from sessionStorage data.
 */

export function renderScoresSummary() {
    const totalPossibleScore = Number(sessionStorage.getItem('totalPossibleScore'));
    const m = JSON.parse(sessionStorage.getItem('examineeResults'));
    if (!m) return '<p class="text-danger">No examinee data found.</p>';

    const pct = v => `${(v / totalPossibleScore * 100).toFixed(1)}%`;

    const rows = [
        ['Number of Examinees', m.numExaminees],
        ['Total Possible Score', totalPossibleScore],
        ['Minimum Score',  `${m.minScore.toFixed(3)} = ${pct(m.minScore)}`],
        ['Maximum Score',  `${m.maxScore.toFixed(3)} = ${pct(m.maxScore)}`],
        ['Median Score',   `${m.median.toFixed(3)} = ${pct(m.median)}`],
        ['Mean Score',     `${m.mean.toFixed(3)} = ${pct(m.mean)}`],
        ['Std Deviation (population)', m.stdDevPop.toFixed(3)],
        ['Std Deviation (sample)',     m.stdDevSamp.toFixed(3)],
        ['Variance (population)',      m.varPop.toFixed(3)],
        ['Variance (sample)',          m.varSamp.toFixed(3)],
        ['Skewness',  m.skewness.toFixed(3)],
        ['Kurtosis',  m.kurtosis.toFixed(3)],
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

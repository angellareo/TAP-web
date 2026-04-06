/**
 * examineeList.js
 * Renders the Examinee List tab: per-student score, grade, and ~68% CI.
 */

const fmt = (v, dec = 1) =>
    (v !== null && v !== undefined && !isNaN(v)) ? Number(v).toFixed(dec) : '—';

const GRADE_COLOR = { A: 'success', B: 'primary', C: 'warning', D: 'danger', F: 'secondary' };

function gradeBadge(g) {
    return `<span class="badge bg-${GRADE_COLOR[g] || 'secondary'}">${g}</span>`;
}

export function renderExamineeList() {
    const rows = JSON.parse(sessionStorage.getItem('examineeList') || 'null');
    const rel  = JSON.parse(sessionStorage.getItem('reliabilityResults') || '{}');

    if (!rows || !rows.length) {
        return '<p class="text-danger">No examinee list data found.</p>';
    }

    const semNote = rel.kr20 != null
        ? `SEM = ${fmt(rel.sem, 3)}, based on KR20 = ${fmt(rel.kr20, 3)}`
        : rel.kr21 != null
            ? `SEM = ${fmt(rel.sem, 3)}, based on KR21 = ${fmt(rel.kr21, 3)} (KR20 not available)`
            : `SEM = ${fmt(rel.sem, 3)} (reliability unavailable; CI is approximate)`;

    const tableRows = rows.map((r, i) => `
        <tr>
            <td class="text-center text-muted small">${i + 1}</td>
            <td class="text-center fw-semibold">${r.score}</td>
            <td class="text-center">${fmt(r.percent)}%</td>
            <td class="text-center">${gradeBadge(r.grade)}</td>
            <td class="text-center font-monospace">${fmt(r.ciLow, 1)} – ${fmt(r.ciHigh, 1)}</td>
            <td class="text-center font-monospace">${fmt(r.ciLowPct)}% – ${fmt(r.ciHighPct)}%</td>
            <td class="text-center">${r.ciLowGrade} – ${r.ciHighGrade}</td>
        </tr>`).join('');

    return `
        <h5 class="mb-3">Examinee List</h5>
        <p class="small text-muted mb-3">
            ~68% confidence interval: ${semNote}.<br>
            Grade scale: A ≥ 90%, B ≥ 80%, C ≥ 70%, D ≥ 60%, F &lt; 60%.
        </p>
        <div class="table-responsive mb-4">
            <table class="table table-sm table-bordered table-hover">
                <thead class="table-light">
                    <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">Score</th>
                        <th class="text-center">%</th>
                        <th class="text-center">Grade</th>
                        <th class="text-center">~68% CI (raw)</th>
                        <th class="text-center">~68% CI (%)</th>
                        <th class="text-center">~68% CI (grade)</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>`;
}

/**
 * gradeReports.js
 * Renders the Individual Grade Reports tab:
 * one row per student showing their response vs the correct answer for every item.
 */

const GRADE_COLOR = { A: 'success', B: 'primary', C: 'warning', D: 'danger', F: 'secondary' };

export function renderGradeReports() {
    const rows = JSON.parse(sessionStorage.getItem('examineeList') || 'null');
    const key  = sessionStorage.getItem('key') || '';

    if (!rows || !rows.length) {
        return '<p class="text-danger">No examinee data found.</p>';
    }

    const headerItems = Array.from(key).map((_, i) =>
        `<th class="text-center px-2 small" style="min-width:2rem">${i + 1}</th>`
    ).join('');

    const keyRow = `
        <tr class="table-secondary">
            <td class="fw-semibold text-muted small text-nowrap">Key</td>
            ${Array.from(key).map(k =>
                `<td class="text-center font-monospace fw-bold px-2 small">${k}</td>`
            ).join('')}
            <td colspan="3"></td>
        </tr>`;

    const studentRows = rows.map((student, i) => {
        const cells = Array.from(key).map((k, j) => {
            const resp    = (student.responses || '')[j] || '?';
            const correct = resp === k;
            return `<td class="text-center font-monospace px-2 small ${correct ? '' : 'table-danger'}"
                        title="${correct ? 'Correct' : `Incorrect — key: ${k}`}">${resp}</td>`;
        }).join('');

        return `
            <tr>
                <td class="text-muted small text-nowrap">Student ${i + 1}</td>
                ${cells}
                <td class="text-center fw-semibold">${student.score}</td>
                <td class="text-center">${Number(student.percent).toFixed(1)}%</td>
                <td class="text-center">
                    <span class="badge bg-${GRADE_COLOR[student.grade] || 'secondary'}">${student.grade}</span>
                </td>
            </tr>`;
    }).join('');

    return `
        <h5 class="mb-3">Individual Grade Reports</h5>
        <p class="small text-muted mb-3">
            Red cells mark incorrect responses. The shaded row shows the answer key.
        </p>
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-hover">
                <thead class="table-light">
                    <tr>
                        <th class="text-nowrap">Student</th>
                        ${headerItems}
                        <th class="text-center">Score</th>
                        <th class="text-center">%</th>
                        <th class="text-center">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${keyRow}
                    ${studentRows}
                </tbody>
            </table>
        </div>`;
}

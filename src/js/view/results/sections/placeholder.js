/**
 * placeholder.js
 * Returns a standard "to be implemented" panel for result sections
 * that have not yet been built.
 */

export function renderPlaceholder(sectionName) {
    return `
        <div class="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
            <i class="fas fa-flask fa-3x mb-3 opacity-25"></i>
            <h5>${sectionName}</h5>
            <p class="mb-0"><em>to be implemented...</em></p>
        </div>`;
}

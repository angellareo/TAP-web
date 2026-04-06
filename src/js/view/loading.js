/**
 * loading.js
 * Shows / hides a full-page loading overlay while analysis runs.
 *
 * withLoading(fn) yields to the browser via setTimeout so the spinner
 * renders before the synchronous computation blocks the main thread.
 */

function showLoading() {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-border text-primary" role="status"
                     style="width:3rem;height:3rem;">
                    <span class="visually-hidden">Analysing…</span>
                </div>
                <p class="mt-3 mb-0 fw-semibold text-secondary">Analysing…</p>
            </div>`;
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

/**
 * Shows the loading overlay, then runs fn() on the next event-loop tick
 * (giving the browser one chance to paint), then hides the overlay.
 */
function withLoading(fn) {
    showLoading();
    setTimeout(() => {
        try {
            fn();
        } finally {
            hideLoading();
        }
    }, 0);
}

export { showLoading, hideLoading, withLoading };

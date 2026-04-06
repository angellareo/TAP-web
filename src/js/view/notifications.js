/**
 * notifications.js
 * Lightweight floating notification system.
 * Renders dismissible alerts anchored to the top-right corner.
 * No Bootstrap JS dependency — uses only Bootstrap CSS utility classes.
 */

const CONTAINER_ID = 'notificationContainer';

function getOrCreateContainer() {
    let el = document.getElementById(CONTAINER_ID);
    if (!el) {
        el = document.createElement('div');
        el.id = CONTAINER_ID;
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('aria-atomic', 'false');
        Object.assign(el.style, {
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: '9999',
            minWidth: '280px',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        });
        document.body.appendChild(el);
    }
    return el;
}

const TYPE_ICONS = {
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    danger:  'fa-times-circle',
    info:    'fa-info-circle',
};

/**
 * Show a floating notification.
 * @param {string} message   Text to display.
 * @param {'success'|'warning'|'danger'|'info'} type  Bootstrap colour context.
 * @param {number} duration  Auto-dismiss after ms (0 = persistent until closed).
 */
export function showNotification(message, type = 'warning', duration = 6000) {
    const container = getOrCreateContainer();
    const icon = TYPE_ICONS[type] ?? TYPE_ICONS.info;

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible d-flex align-items-start shadow mb-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <i class="fas ${icon} me-2 mt-1 flex-shrink-0"></i>
        <span>${message}</span>
        <button type="button" class="btn-close ms-auto flex-shrink-0" aria-label="Dismiss"></button>`;

    const close = toast.querySelector('.btn-close');
    const dismiss = () => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 200);
    };
    close.addEventListener('click', dismiss);

    // Animate in
    toast.style.cssText += 'opacity:0;transition:opacity 0.2s;';
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });

    if (duration > 0) {
        setTimeout(dismiss, duration);
    }
}

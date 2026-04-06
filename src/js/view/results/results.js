/**
 * results.js
 * Orchestrates the results view.
 * Builds Bootstrap nav-tabs and delegates each section to a dedicated module.
 */

import { renderScoresSummary } from './sections/scoresSummary.js';
import { renderItemAnalysis }  from './sections/itemAnalysis.js';
import { renderPlaceholder }   from './sections/placeholder.js';

const TABS = [
    { id: 'score-summary',    label: 'Score Summary',      render: () => renderScoresSummary() },
    { id: 'score-dist',       label: 'Score Distribution', render: () => renderPlaceholder('Score Distribution (frequency table, bar graph, stem-and-leaf)') },
    { id: 'examinee-list',    label: 'Examinee List',      render: () => renderPlaceholder('Per-student table (score, percent, grade, confidence intervals)') },
    { id: 'item-analysis',    label: 'Item Analysis',      render: () => renderItemAnalysis() },
    { id: 'extended',         label: 'Extended Analysis',  render: () => renderPlaceholder('KR20, KR21, SEM, split-half reliability, Spearman-Brown Prophecy, additional item-deleted stats') },
    { id: 'options-analysis', label: 'Options Analysis',   render: () => renderPlaceholder('Distractor analysis (option frequencies for high/low groups)') },
];

let activeTabId = TABS[0].id;

function buildTabNav() {
    const items = TABS.map(tab => `
        <li class="nav-item" role="presentation">
            <button class="nav-link ${tab.id === activeTabId ? 'active' : ''}"
                id="tab-btn-${tab.id}"
                data-tab-id="${tab.id}"
                type="button" role="tab">
                ${tab.label}
            </button>
        </li>`).join('');
    return `<ul class="nav nav-tabs flex-wrap" role="tablist">${items}</ul>`;
}

function renderActiveTab() {
    const tab = TABS.find(t => t.id === activeTabId) || TABS[0];
    document.getElementById('resultsContent').innerHTML = tab.render();
}

function attachTabListeners() {
    TABS.forEach(tab => {
        const btn = document.getElementById(`tab-btn-${tab.id}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
            activeTabId = tab.id;
            document.querySelectorAll('.nav-link[data-tab-id]').forEach(b => {
                b.classList.toggle('active', b.dataset.tabId === activeTabId);
            });
            renderActiveTab();
        });
    });
}

function showResults(title, comments, totalPossibleScore) {
    activeTabId = TABS[0].id;

    // Build header
    document.getElementById('resultsHeader').innerHTML = `
        <h2 class="mb-0">${title || 'Results'}</h2>
        ${comments ? `<p class="text-muted mb-0 small">${comments}</p>` : ''}`;

    // Build tab nav
    document.getElementById('resultsMenu').innerHTML = buildTabNav();

    // Render first tab content
    renderActiveTab();

    // Attach tab click listeners
    attachTabListeners();

    // Show the container
    document.getElementById('editDataContainer').classList.add('hidden');
    document.querySelector('.main-menu').classList.add('hidden');
    const rc = document.getElementById('resultsContainer');
    rc.classList.remove('hidden');
    rc.classList.add('fade-in');
}

export { showResults };

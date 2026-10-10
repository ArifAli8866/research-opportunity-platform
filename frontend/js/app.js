// ==============================================================
// Research Opportunity Portal - Frontend Application Logic
// ==============================================================
// Uses vanilla JavaScript with modern fetch API and Bootstrap 5.
// No build steps, no hard-coded data, and strictly escapes user inputs
// to prevent Cross-Site Scripting (XSS).
// ==============================================================

const API_BASE = '/api/opportunities';

// DOM Element References
const opportunitiesList = document.getElementById('opportunitiesList');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const alertContainer = document.getElementById('alertContainer');
const refreshBtn = document.getElementById('refreshBtn');

/**
 * Escapes special HTML characters to prevent XSS attacks
 * @param {string|number} str
 * @returns {string} Sanitized string
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Displays Bootstrap dismissible alerts
 * @param {string} message - Primary alert message
 * @param {'success'|'danger'|'warning'|'info'} type - Bootstrap alert type
 * @param {string[]} [details=[]] - Optional array of validation error messages
 */
function showAlert(message, type = 'success', details = []) {
  if (!alertContainer) return;

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
  alertDiv.setAttribute('role', 'alert');

  let detailsHtml = '';
  if (Array.isArray(details) && details.length > 0) {
    detailsHtml = `
      <ul class="mb-0 mt-2 ps-3">
        ${details.map((d) => `<li>${escapeHTML(d)}</li>`).join('')}
      </ul>
    `;
  }

  alertDiv.innerHTML = `
    <div class="d-flex align-items-start">
      <div class="me-2">
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} fs-5"></i>
      </div>
      <div>
        <strong>${escapeHTML(message)}</strong>
        ${detailsHtml}
      </div>
      <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  alertContainer.appendChild(alertDiv);

  // Auto-dismiss alert after 5 seconds
  setTimeout(() => {
    if (alertDiv && alertDiv.parentNode) {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 250);
    }
  }, 5000);
}

/**
 * Formats a date string (YYYY-MM-DD) into a user-friendly local date string
 * @param {string} dateStr
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  // Take the YYYY-MM-DD portion
  const cleanDate = String(dateStr).split('T')[0];
  const parts = cleanDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  return cleanDate;
}

/**
 * Renders an opportunity card HTML
 * @param {object} item - Opportunity data object
 * @returns {string} Card HTML string
 */
function createOpportunityCard(item) {
  const isOpen = item.status === 'Open';
  const badgeClass = isOpen ? 'badge-status-open' : 'badge-status-closed';
  const badgeIcon = isOpen ? 'bi-door-open-fill' : 'bi-door-closed-fill';

  return `
    <div class="col" data-id="${item.id}">
      <div class="card opportunity-card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
            <span class="badge ${badgeClass} badge-status d-inline-flex align-items-center">
              <i class="bi ${badgeIcon} me-1"></i> ${escapeHTML(item.status)}
            </span>
            <span class="badge bg-light text-dark border">
              <i class="bi bi-people-fill text-primary me-1"></i> ${escapeHTML(item.positions)} ${item.positions === 1 ? 'Position' : 'Positions'}
            </span>
          </div>

          <h5 class="opportunity-title mb-2 text-truncate" title="${escapeHTML(item.title)}">
            ${escapeHTML(item.title)}
          </h5>

          <p class="text-muted small mb-3 text-truncate">
            <i class="bi bi-tag-fill me-1 text-secondary"></i>
            <span class="fw-medium">${escapeHTML(item.research_area)}</span>
          </p>

          <div class="opportunity-meta mb-3">
            <div class="meta-item text-truncate" title="${escapeHTML(item.faculty_name)}">
              <i class="bi bi-person-fill"></i>
              <span>${escapeHTML(item.faculty_name)}</span>
            </div>
            <div class="meta-item text-truncate" title="${escapeHTML(item.department)}">
              <i class="bi bi-building"></i>
              <span>${escapeHTML(item.department)}</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-calendar-event"></i>
              <span>Deadline: <strong class="text-dark">${escapeHTML(formatDate(item.deadline))}</strong></span>
            </div>
          </div>

          <div class="mt-auto pt-3 border-top d-flex flex-wrap gap-2">
            <button class="btn btn-outline-primary btn-sm flex-grow-1 btn-view-details" data-id="${item.id}">
              <i class="bi bi-eye me-1"></i> View Details
            </button>
            <button class="btn btn-outline-secondary btn-sm btn-edit" data-id="${item.id}" title="Edit opportunity">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-outline-warning btn-sm btn-close-opp" data-id="${item.id}" title="Close applications" ${!isOpen ? 'disabled' : ''}>
              <i class="bi bi-x-circle"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${item.id}" data-title="${escapeHTML(item.title)}" title="Delete opportunity">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Fetches all opportunities from the backend API and updates the UI
 */
async function fetchOpportunities() {
  // Show loading spinner, hide cards and empty state
  loadingState.classList.remove('d-none');
  opportunitiesList.classList.add('d-none');
  emptyState.classList.add('d-none');

  try {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error(`Failed to load opportunities (${response.status})`);
    }

    const data = await response.json();

    loadingState.classList.add('d-none');

    if (!Array.isArray(data) || data.length === 0) {
      emptyState.classList.remove('d-none');
      opportunitiesList.innerHTML = '';
      return;
    }

    // Render cards into opportunities container
    opportunitiesList.innerHTML = data.map(createOpportunityCard).join('');
    opportunitiesList.classList.remove('d-none');
  } catch (error) {
    loadingState.classList.add('d-none');
    showAlert(error.message || 'Unable to connect to the server.', 'danger');
  }
}

// Initialise event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchOpportunities();

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchOpportunities();
    });
  }
});

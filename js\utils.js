/* ============================================================
   UTILS.JS — formatting, date helpers, toast/modal/confirm UI
   ============================================================ */

const CURRENCY_SYMBOLS = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', BDT: '৳', PKR: '₨', NPR: 'रू', AED: 'د.إ', SAR: '﷼', JPY: '¥', AUD: 'A$', CAD: 'C$',
};

function getCurrencySymbol() {
  const cur = (typeof APP_STATE !== 'undefined' && APP_STATE.settings && APP_STATE.settings.currency) || 'INR';
  return CURRENCY_SYMBOLS[cur] || cur + ' ';
}

function fmtMoney(n) {
  n = Number(n) || 0;
  const sym = getCurrencySymbol();
  const neg = n < 0;
  n = Math.abs(n);
  const parts = n.toFixed(2).split('.');
  let intPart = parts[0];
  // Indian-style grouping for INR, standard for others
  const cur = (typeof APP_STATE !== 'undefined' && APP_STATE.settings && APP_STATE.settings.currency) || 'INR';
  if (cur === 'INR' || cur === 'BDT' || cur === 'PKR' || cur === 'NPR') {
    intPart = indianGroup(intPart);
  } else {
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const decimals = parts[1] === '00' ? '' : '.' + parts[1];
  return (neg ? '-' : '') + sym + intPart + decimals;
}

function indianGroup(numStr) {
  const s = numStr.split('').reverse().join('');
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i === 3) out += ',';
    else if (i > 3 && (i - 3) % 2 === 0) out += ',';
    out += s[i];
  }
  return out.split('').reverse().join('');
}

function fmtDate(d, opts) {
  const date = (d instanceof Date) ? d : new Date(d);
  if (isNaN(date)) return '';
  const lang = currentLang === 'bn' ? 'bn-BD' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  return date.toLocaleDateString(lang, opts || { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  const date = (d instanceof Date) ? d : new Date(d);
  const lang = currentLang === 'bn' ? 'bn-BD' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  return date.toLocaleString(lang, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function isSameDay(d1, d2) {
  const a = new Date(d1), b = new Date(d2);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d) {
  const x = new Date(d); x.setHours(0, 0, 0, 0); return x;
}
function endOfDay(d) {
  const x = new Date(d); x.setHours(23, 59, 59, 999); return x;
}
function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n); return d;
}
function startOfWeek(d) {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday start
  x.setDate(x.getDate() + diff);
  return x;
}
function startOfMonth(d) {
  const x = startOfDay(d); x.setDate(1); return x;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/* ---------------- Toast ---------------- */
function showToast(message, type = '', actionLabel, actionFn) {
  let stack = document.getElementById('toastStack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'toastStack';
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${escapeHtml(message)}</span>`;
  if (actionLabel) {
    const btn = document.createElement('button');
    btn.className = 'toast-action';
    btn.textContent = actionLabel;
    btn.onclick = () => { actionFn && actionFn(); dismiss(); };
    el.appendChild(btn);
  }
  stack.appendChild(el);
  const timeout = setTimeout(dismiss, actionLabel ? 5000 : 2600);
  function dismiss() {
    clearTimeout(timeout);
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 150);
  }
}

/* ---------------- Modal ---------------- */
function openModal({ title, bodyHtml, footerHtml, onMount, size, id }) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = id || 'activeModal';
  overlay.innerHTML = `
    <div class="modal-sheet" role="dialog" aria-modal="true" aria-label="${escapeHtml(title || '')}">
      <div class="modal-drag-handle"></div>
      <div class="modal-header">
        <h2>${escapeHtml(title || '')}</h2>
        <button class="icon-btn" data-close-modal aria-label="${t('close')}"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body">${bodyHtml || ''}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('[data-close-modal]')) closeModal();
  });
  requestAnimationFrame(() => overlay.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (onMount) onMount(overlay);
  return overlay;
}

function closeModal() {
  const existing = document.getElementById('activeModal') || document.querySelector('.modal-overlay');
  if (existing) {
    existing.classList.remove('open');
    setTimeout(() => existing.remove(), 200);
  }
  document.body.style.overflow = '';
}

function confirmDialog({ title, message, confirmLabel, danger = false, icon = 'fa-triangle-exclamation' }) {
  return new Promise((resolve) => {
    const overlay = openModal({
      title: title || t('confirm'),
      bodyHtml: `
        <div class="text-center">
          <div class="confirm-icon-wrap" style="background:${danger ? 'var(--red-100)' : 'var(--blue-50)'};color:${danger ? 'var(--red-600)' : 'var(--blue-700)'}">
            <i class="fa-solid ${icon}"></i>
          </div>
          <p style="color:var(--ink-700);font-size:var(--fs-base);">${escapeHtml(message)}</p>
        </div>
      `,
      footerHtml: `
        <button class="btn btn-outline" data-cancel>${t('cancel')}</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-confirm>${confirmLabel || t('confirm')}</button>
      `,
    });
    overlay.querySelector('[data-cancel]').onclick = () => { closeModal(); resolve(false); };
    overlay.querySelector('[data-confirm]').onclick = () => { closeModal(); resolve(true); };
  });
}

/* ---------------- Bottom sheet action menu ---------------- */
function actionSheet(items) {
  const overlay = openModal({
    title: '',
    bodyHtml: `<div class="flex-col gap-1">${items.map((it, i) => `
      <button class="settings-row clickable" style="width:100%;border:none;background:none;text-align:left;border-radius:var(--r-md);" data-idx="${i}">
        <div class="s-icon" style="background:${it.bg || 'var(--blue-50)'};color:${it.color || 'var(--blue-700)'}"><i class="fa-solid ${it.icon}"></i></div>
        <div class="s-main"><div class="s-title">${escapeHtml(it.label)}</div></div>
      </button>
    `).join('')}</div>`,
  });
  overlay.querySelectorAll('[data-idx]').forEach(btn => {
    btn.onclick = () => { closeModal(); items[+btn.dataset.idx].onClick(); };
  });
}

function debounce(fn, wait = 250) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); };
}

function download(filename, content, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v === undefined || v === null ? '' : v).replace(/"/g, '""')}"`;
  const lines = [headers.map(esc).join(',')];
  rows.forEach(r => lines.push(headers.map(h => esc(r[h])).join(',')));
  return lines.join('\n');
}

function vibrate(ms = 12) {
  if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} }
}

function waLink(phone, text) {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  return `https://wa.me/${digits.replace(/^\+/, '')}?text=${encodeURIComponent(text)}`;
}

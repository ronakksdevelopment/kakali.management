/* ============================================================
   REMINDERS.JS
   ============================================================ */

function renderReminders() {
  setTimeout(() => { document.getElementById('addReminderBtn').onclick = () => openReminderModal(); }, 0);
  const list = [...APP_STATE.reminders].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return `
    <div class="page-header">
      <h1>${t('reminders')}</h1>
      <button class="btn btn-primary btn-sm" id="addReminderBtn"><i class="fa-solid fa-plus"></i> ${t('add')}</button>
    </div>
    ${list.length === 0 ? `
      <div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-bell"></i></div><h3>${t('noRemindersYet')}</h3></div>
    ` : `<div class="card">${list.map(r => reminderRowHtml(r)).join('')}</div>`}
  `;
}

function reminderRowHtml(r) {
  const overdue = !r.done && r.dueDate && new Date(r.dueDate) < startOfDay(new Date());
  return `
    <div class="list-row">
      <button class="icon-btn" style="background:${r.done ? 'var(--green-100)' : 'var(--ink-100)'};color:${r.done ? 'var(--green-700)' : 'var(--ink-500)'};" onclick="toggleReminder('${r.id}')">
        <i class="fa-solid ${r.done ? 'fa-check' : 'fa-circle'}" style="font-size:${r.done ? '14px' : '8px'}"></i>
      </button>
      <div class="row-main" style="${r.done ? 'opacity:0.5;text-decoration:line-through;' : ''}">
        <div class="row-title">${escapeHtml(r.title)}</div>
        <div class="row-sub" style="${overdue ? 'color:var(--red-600);font-weight:700;' : ''}">${r.dueDate ? fmtDate(r.dueDate) : ''}${r.note ? ' · ' + escapeHtml(r.note) : ''}</div>
      </div>
      <button class="icon-btn" onclick="deleteReminder('${r.id}')" style="color:var(--red-600);"><i class="fa-solid fa-trash text-sm"></i></button>
    </div>
  `;
}

function openReminderModal() {
  const overlay = openModal({
    title: t('addReminder'),
    bodyHtml: `
      <form id="remForm">
        <div class="field">
          <label>${t('reminderTitle')} *</label>
          <input class="input" name="title" required placeholder="${t('callSupplier')}">
        </div>
        <div class="chip-select mb-3">
          <button type="button" class="chip" data-preset="${t('callSupplier')}">${t('callSupplier')}</button>
          <button type="button" class="chip" data-preset="${t('restockItem')}">${t('restockItem')}</button>
          <button type="button" class="chip" data-preset="${t('collectDue')}">${t('collectDue')}</button>
          <button type="button" class="chip" data-preset="${t('paySupplier')}">${t('paySupplier')}</button>
        </div>
        <div class="field">
          <label>${t('dueDate')}</label>
          <input class="input" type="date" name="dueDate" value="${todayISO()}">
        </div>
        <div class="field">
          <label>${t('notes')}</label>
          <textarea class="input" name="note"></textarea>
        </div>
      </form>
    `,
    footerHtml: `<button class="btn btn-primary btn-block" id="saveRemBtn">${t('save')}</button>`,
  });
  overlay.querySelectorAll('[data-preset]').forEach(b => b.onclick = () => { overlay.querySelector('[name="title"]').value = b.dataset.preset; });
  overlay.querySelector('#saveRemBtn').onclick = async () => {
    const form = overlay.querySelector('#remForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    const obj = { id: uid('rem'), title: fd.get('title').trim(), dueDate: fd.get('dueDate'), note: fd.get('note').trim(), done: false, createdAt: Date.now() };
    await DB.put('reminders', obj);
    APP_STATE.reminders.push(obj);
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    renderView();
  };
}

async function toggleReminder(id) {
  const r = APP_STATE.reminders.find(x => x.id === id);
  if (!r) return;
  r.done = !r.done;
  await DB.put('reminders', r);
  renderView();
}

async function deleteReminder(id) {
  await DB.delete('reminders', id);
  APP_STATE.reminders = APP_STATE.reminders.filter(r => r.id !== id);
  showToast(t('itemDeleted'));
  renderView();
}

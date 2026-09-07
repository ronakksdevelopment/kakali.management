/* ============================================================
   CUSTOMERS.JS
   ============================================================ */

let customerSearch = '';

function renderCustomersList() {
  setTimeout(() => mountCustomersHandlers(), 0);
  let list = [...APP_STATE.customers];
  if (customerSearch) {
    const q = customerSearch.toLowerCase();
    list = list.filter(c => (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q));
  }
  list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return `
    <div class="page-header">
      <h1>${t('customers')}</h1>
      <button class="btn btn-primary btn-sm" id="addCustBtn"><i class="fa-solid fa-plus"></i> ${t('add')}</button>
    </div>
    <div class="search-box mb-4">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="search" id="custSearch" placeholder="${t('search')}..." value="${escapeHtml(customerSearch)}">
    </div>
    ${APP_STATE.customers.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-users"></i></div>
        <h3>${t('noCustomersYet')}</h3>
        <p>${t('addCustomersHint')}</p>
        <button class="btn btn-primary" id="addCustBtn2"><i class="fa-solid fa-plus"></i> ${t('addCustomer')}</button>
      </div>
    ` : list.length === 0 ? `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div><h3>${t('noResultsFound')}</h3></div>` : `
      <div class="card">
        ${list.map(c => customerRowHtml(c)).join('')}
      </div>
    `}
  `;
}

function customerRowHtml(c) {
  const bal = customerBalance(c.id);
  return `
    <div class="list-row clickable" onclick="navigate('customers/view',{id:'${c.id}'})">
      <div class="row-avatar">${initials(c.name)}</div>
      <div class="row-main">
        <div class="row-title">${escapeHtml(c.name)}</div>
        <div class="row-sub">${escapeHtml(c.phone || '')}</div>
      </div>
      <div class="row-end">
        ${bal > 0 ? `<div class="row-amount amt-negative">${fmtMoney(bal)}</div><div class="text-xs text-muted">${t('due')}</div>`
          : bal < 0 ? `<div class="row-amount amt-positive">${fmtMoney(Math.abs(bal))}</div><div class="text-xs text-muted">advance</div>`
          : `<span class="badge badge-green">${t('allSettled')}</span>`}
      </div>
    </div>
  `;
}

function mountCustomersHandlers() {
  const b1 = document.getElementById('addCustBtn'), b2 = document.getElementById('addCustBtn2');
  if (b1) b1.onclick = () => openCustomerModal();
  if (b2) b2.onclick = () => openCustomerModal();
  const s = document.getElementById('custSearch');
  if (s) s.oninput = debounce(e => { customerSearch = e.target.value; rerenderCustomers(); }, 200);
}
function rerenderCustomers() {
  document.getElementById('view').innerHTML = renderCustomersList();
  mountCustomersHandlers();
  const s = document.getElementById('custSearch');
  if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
}

function openCustomerModal(id, onSaved) {
  const editing = id ? customerById(id) : null;
  const overlay = openModal({
    title: editing ? t('editCustomer') : t('addCustomer'),
    bodyHtml: `
      <form id="custForm">
        <div class="field"><label>${t('customerName')} *</label><input class="input" name="name" required value="${editing ? escapeHtml(editing.name) : ''}"></div>
        <div class="field"><label>${t('phone')}</label><input class="input" type="tel" name="phone" value="${editing ? escapeHtml(editing.phone || '') : ''}"></div>
        <div class="field"><label>${t('address')}</label><input class="input" name="address" value="${editing ? escapeHtml(editing.address || '') : ''}"></div>
        <div class="field"><label>${t('notes')}</label><textarea class="input" name="notes">${editing ? escapeHtml(editing.notes || '') : ''}</textarea></div>
      </form>
    `,
    footerHtml: `
      ${editing ? `<button class="btn btn-outline btn-icon" id="delCustBtn" style="color:var(--red-600);"><i class="fa-solid fa-trash"></i></button>` : ''}
      <button class="btn btn-primary btn-block" id="saveCustBtn">${editing ? t('update') : t('save')}</button>
    `,
  });
  overlay.querySelector('#saveCustBtn').onclick = async () => {
    const form = overlay.querySelector('#custForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    const obj = {
      id: editing ? editing.id : uid('cust'),
      name: fd.get('name').trim(),
      phone: fd.get('phone').trim(),
      address: fd.get('address').trim(),
      notes: fd.get('notes').trim(),
      createdAt: editing ? editing.createdAt : Date.now(),
    };
    await DB.put('customers', obj);
    const idx = APP_STATE.customers.findIndex(c => c.id === obj.id);
    if (idx >= 0) APP_STATE.customers[idx] = obj; else APP_STATE.customers.push(obj);
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    if (onSaved) onSaved(obj);
    if (baseKey(APP_STATE.route) === 'customers') rerenderCustomers();
    if (APP_STATE.route === 'customers/view') renderView();
  };
  if (editing) {
    overlay.querySelector('#delCustBtn').onclick = async () => {
      const ok = await confirmDialog({ message: t('confirmDelete'), danger: true, confirmLabel: t('delete') });
      if (!ok) return;
      await DB.delete('customers', editing.id);
      APP_STATE.customers = APP_STATE.customers.filter(c => c.id !== editing.id);
      closeModal();
      showToast(t('itemDeleted'));
      navigate('customers');
    };
  }
}

function renderCustomerDetail(id) {
  const c = customerById(id);
  if (!c) { navigate('customers'); return ''; }
  const bal = customerBalance(id);
  const sales = APP_STATE.sales.filter(s => s.customerId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const ledgerEntries = APP_STATE.ledger.filter(l => l.personType === 'customer' && l.personId === id).sort((a, b) => b.date - a.date);
  const combined = [
    ...sales.map(s => ({ kind: 'sale', date: new Date(s.date).getTime(), data: s })),
    ...ledgerEntries.map(l => ({ kind: 'ledger', date: l.date, data: l })),
  ].sort((a, b) => b.date - a.date);

  setTimeout(() => {
    document.getElementById('custEditBtn').onclick = () => openCustomerModal(id);
    document.getElementById('custReceiveBtn').onclick = () => openLedgerModal('receive', 'customer', id);
    document.getElementById('custWaBtn').onclick = () => sendDueReminder(c, bal);
    const call = document.getElementById('custCallBtn');
    if (call) call.onclick = () => window.location.href = `tel:${c.phone}`;
  }, 0);

  return `
    <div class="page-header">
      <div class="flex items-center gap-3">
        <button class="icon-btn" onclick="navigate('customers')"><i class="fa-solid fa-arrow-left"></i></button>
        <h1>${escapeHtml(c.name)}</h1>
      </div>
      <button class="icon-btn" id="custEditBtn"><i class="fa-solid fa-pen"></i></button>
    </div>

    <div class="card mb-4 text-center">
      <div class="text-muted text-sm font-semi mb-1">${bal > 0 ? t('youWillReceive') : bal < 0 ? t('youWillGive') : t('allSettled')}</div>
      <div style="font-size:var(--fs-3xl);font-weight:800;color:${bal > 0 ? 'var(--red-600)' : bal < 0 ? 'var(--green-600)' : 'var(--ink-800)'};">${fmtMoney(Math.abs(bal))}</div>
      <div class="flex gap-2 mt-4">
        ${c.phone ? `<button class="btn btn-outline btn-sm w-full" id="custCallBtn"><i class="fa-solid fa-phone"></i> ${t('phone')}</button>` : ''}
        <button class="btn btn-success btn-sm w-full" id="custReceiveBtn"><i class="fa-solid fa-hand-holding-dollar"></i> ${t('receive')}</button>
        ${c.phone && bal > 0 ? `<button class="btn btn-accent btn-sm w-full" id="custWaBtn"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>` : ''}
      </div>
    </div>

    ${c.phone || c.address ? `
    <div class="card-flat mb-4">
      ${c.phone ? `<div class="text-sm mb-1"><i class="fa-solid fa-phone text-muted"></i> ${escapeHtml(c.phone)}</div>` : ''}
      ${c.address ? `<div class="text-sm"><i class="fa-solid fa-location-dot text-muted"></i> ${escapeHtml(c.address)}</div>` : ''}
    </div>` : ''}

    <div class="section-title">Transaction History</div>
    ${combined.length === 0 ? `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-receipt"></i></div><p>${t('noLedgerYet')}</p></div>` : `
    <div class="card">
      ${combined.map(item => item.kind === 'sale' ? saleRowHtml(item.data) : ledgerRowHtml(item.data)).join('')}
    </div>`}
  `;
}

function ledgerRowHtml(l) {
  const isReceive = l.type === 'receive';
  return `
    <div class="list-row">
      <div class="row-avatar" style="background:${isReceive ? 'var(--green-100)' : 'var(--orange-100)'};color:${isReceive ? 'var(--green-700)' : 'var(--orange-700)'};">
        <i class="fa-solid ${isReceive ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
      </div>
      <div class="row-main">
        <div class="row-title">${isReceive ? t('receive') : t('give')}</div>
        <div class="row-sub">${fmtDate(l.date)}${l.note ? ' · ' + escapeHtml(l.note) : ''}</div>
      </div>
      <div class="row-end"><div class="row-amount ${isReceive ? 'amt-positive' : 'amt-negative'}">${fmtMoney(l.amount)}</div></div>
    </div>
  `;
}

function sendDueReminder(person, bal) {
  const tmpl = APP_STATE.settings.whatsappTemplates.dueReminder;
  const text = tmpl.replace('{name}', person.name).replace('{business}', APP_STATE.settings.businessName || t('appName')).replace('{amount}', fmtMoney(Math.abs(bal)));
  window.open(waLink(person.phone, text), '_blank');
}

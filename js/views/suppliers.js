/* ============================================================
   SUPPLIERS.JS
   ============================================================ */

function renderSuppliersList() {
  setTimeout(() => {
    const b1 = document.getElementById('addSupBtn'), b2 = document.getElementById('addSupBtn2');
    if (b1) b1.onclick = () => openSupplierModal();
    if (b2) b2.onclick = () => openSupplierModal();
  }, 0);
  const list = [...APP_STATE.suppliers].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return `
    <div class="page-header">
      <h1>${t('suppliers')}</h1>
      <button class="btn btn-primary btn-sm" id="addSupBtn"><i class="fa-solid fa-plus"></i> ${t('add')}</button>
    </div>
    ${list.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-truck"></i></div>
        <h3>${t('noSuppliersYet')}</h3>
        <button class="btn btn-primary" id="addSupBtn2"><i class="fa-solid fa-plus"></i> ${t('addSupplier')}</button>
      </div>
    ` : `
      <div class="card">
        ${list.map(s => supplierRowHtml(s)).join('')}
      </div>
    `}
  `;
}

function supplierRowHtml(s) {
  const bal = supplierBalance(s.id);
  return `
    <div class="list-row clickable" onclick="navigate('suppliers/view',{id:'${s.id}'})">
      <div class="row-avatar" style="background:var(--gold-100);color:var(--gold-700);">${initials(s.name)}</div>
      <div class="row-main">
        <div class="row-title">${escapeHtml(s.name)}</div>
        <div class="row-sub">${escapeHtml(s.phone || '')}</div>
      </div>
      <div class="row-end">
        ${bal > 0 ? `<div class="row-amount amt-negative">${fmtMoney(bal)}</div><div class="text-xs text-muted">${t('due')}</div>` : `<span class="badge badge-green">${t('allSettled')}</span>`}
      </div>
    </div>
  `;
}

function openSupplierModal(id, onSaved) {
  const editing = id ? supplierById(id) : null;
  const overlay = openModal({
    title: editing ? t('editSupplier') : t('addSupplier'),
    bodyHtml: `
      <form id="supForm">
        <div class="field"><label>${t('supplierName')} *</label><input class="input" name="name" required value="${editing ? escapeHtml(editing.name) : ''}"></div>
        <div class="field"><label>${t('phone')}</label><input class="input" type="tel" name="phone" value="${editing ? escapeHtml(editing.phone || '') : ''}"></div>
        <div class="field"><label>${t('address')}</label><input class="input" name="address" value="${editing ? escapeHtml(editing.address || '') : ''}"></div>
        <div class="field"><label>${t('notes')}</label><textarea class="input" name="notes">${editing ? escapeHtml(editing.notes || '') : ''}</textarea></div>
      </form>
    `,
    footerHtml: `
      ${editing ? `<button class="btn btn-outline btn-icon" id="delSupBtn" style="color:var(--red-600);"><i class="fa-solid fa-trash"></i></button>` : ''}
      <button class="btn btn-primary btn-block" id="saveSupBtn">${editing ? t('update') : t('save')}</button>
    `,
  });
  overlay.querySelector('#saveSupBtn').onclick = async () => {
    const form = overlay.querySelector('#supForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    const obj = {
      id: editing ? editing.id : uid('sup'),
      name: fd.get('name').trim(),
      phone: fd.get('phone').trim(),
      address: fd.get('address').trim(),
      notes: fd.get('notes').trim(),
      createdAt: editing ? editing.createdAt : Date.now(),
    };
    await DB.put('suppliers', obj);
    const idx = APP_STATE.suppliers.findIndex(s => s.id === obj.id);
    if (idx >= 0) APP_STATE.suppliers[idx] = obj; else APP_STATE.suppliers.push(obj);
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    if (onSaved) onSaved(obj);
    if (baseKey(APP_STATE.route) === 'suppliers') renderView();
    if (APP_STATE.route === 'suppliers/view') renderView();
  };
  if (editing) {
    overlay.querySelector('#delSupBtn').onclick = async () => {
      const ok = await confirmDialog({ message: t('confirmDelete'), danger: true, confirmLabel: t('delete') });
      if (!ok) return;
      await DB.delete('suppliers', editing.id);
      APP_STATE.suppliers = APP_STATE.suppliers.filter(s => s.id !== editing.id);
      closeModal();
      showToast(t('itemDeleted'));
      navigate('suppliers');
    };
  }
}

function renderSupplierDetail(id) {
  const s = supplierById(id);
  if (!s) { navigate('suppliers'); return ''; }
  const bal = supplierBalance(id);
  const purchases = APP_STATE.purchases.filter(p => p.supplierId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const ledgerEntries = APP_STATE.ledger.filter(l => l.personType === 'supplier' && l.personId === id).sort((a, b) => b.date - a.date);

  setTimeout(() => {
    document.getElementById('supEditBtn').onclick = () => openSupplierModal(id);
    document.getElementById('supGiveBtn').onclick = () => openLedgerModal('give', 'supplier', id);
    const call = document.getElementById('supCallBtn');
    if (call) call.onclick = () => window.location.href = `tel:${s.phone}`;
  }, 0);

  return `
    <div class="page-header">
      <div class="flex items-center gap-3">
        <button class="icon-btn" onclick="navigate('suppliers')"><i class="fa-solid fa-arrow-left"></i></button>
        <h1>${escapeHtml(s.name)}</h1>
      </div>
      <button class="icon-btn" id="supEditBtn"><i class="fa-solid fa-pen"></i></button>
    </div>

    <div class="card mb-4 text-center">
      <div class="text-muted text-sm font-semi mb-1">${bal > 0 ? t('youWillGive') : t('allSettled')}</div>
      <div style="font-size:var(--fs-3xl);font-weight:800;color:${bal > 0 ? 'var(--red-600)' : 'var(--ink-800)'};">${fmtMoney(Math.abs(bal))}</div>
      <div class="flex gap-2 mt-4">
        ${s.phone ? `<button class="btn btn-outline btn-sm w-full" id="supCallBtn"><i class="fa-solid fa-phone"></i> ${t('phone')}</button>` : ''}
        <button class="btn btn-success btn-sm w-full" id="supGiveBtn"><i class="fa-solid fa-money-bill-transfer"></i> ${t('give')}</button>
      </div>
    </div>

    <div class="section-title">${t('purchases')}</div>
    ${purchases.length === 0 && ledgerEntries.length === 0 ? `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-truck"></i></div><p>${t('noPurchasesYet')}</p></div>` : `
    <div class="card">
      ${[...purchases.map(p => ({ kind: 'p', date: new Date(p.date).getTime(), data: p })), ...ledgerEntries.map(l => ({ kind: 'l', date: l.date, data: l }))]
        .sort((a, b) => b.date - a.date)
        .map(item => item.kind === 'p' ? purchaseRowHtml(item.data) : ledgerRowHtml(item.data)).join('')}
    </div>`}
  `;
}

function purchaseRowHtml(p) {
  const sup = supplierById(p.supplierId);
  return `
    <div class="list-row">
      <div class="row-avatar" style="background:var(--blue-100);color:var(--blue-700);"><i class="fa-solid fa-truck"></i></div>
      <div class="row-main">
        <div class="row-title">${sup ? escapeHtml(sup.name) : '—'}</div>
        <div class="row-sub">${fmtDate(p.date)} · ${(p.items || []).length} items</div>
      </div>
      <div class="row-end">
        <div class="row-amount">${fmtMoney(p.total)}</div>
        ${p.due > 0 ? `<span class="badge badge-red">${t('due')} ${fmtMoney(p.due)}</span>` : `<span class="badge badge-green">${t('paid')}</span>`}
      </div>
    </div>
  `;
}

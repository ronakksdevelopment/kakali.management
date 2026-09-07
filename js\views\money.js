/* ============================================================
   MONEY.JS — Khata (ledger), Expenses, Income
   ============================================================ */

/* ---------------- KHATA ---------------- */
function renderKhata() {
  setTimeout(() => {
    document.getElementById('khataReceiveBtn').onclick = () => openLedgerModal('receive');
    document.getElementById('khataGiveBtn').onclick = () => openLedgerModal('give');
  }, 0);

  const custDue = totalCustomerDue();
  const suppDue = totalSupplierDue();
  const entries = [...APP_STATE.ledger].sort((a, b) => b.date - a.date).slice(0, 30);

  return `
    <div class="page-header"><h1>${t('khata')}</h1></div>

    <div class="stats-grid mb-4" style="grid-template-columns:1fr 1fr;">
      <div class="stat-card tone-red">
        <div class="stat-icon"><i class="fa-solid fa-arrow-down"></i></div>
        <div class="stat-label">${t('customerDue')}</div>
        <div class="stat-value">${fmtMoney(custDue)}</div>
      </div>
      <div class="stat-card tone-orange">
        <div class="stat-icon"><i class="fa-solid fa-arrow-up"></i></div>
        <div class="stat-label">${t('supplierDue')}</div>
        <div class="stat-value">${fmtMoney(suppDue)}</div>
      </div>
    </div>

    <div class="flex gap-3 mb-5">
      <button class="btn btn-success btn-block" id="khataReceiveBtn"><i class="fa-solid fa-hand-holding-dollar"></i> ${t('receive')}</button>
      <button class="btn btn-danger btn-block" id="khataGiveBtn"><i class="fa-solid fa-money-bill-transfer"></i> ${t('give')}</button>
    </div>

    <div class="flex items-center justify-between mb-3">
      <div class="section-title" style="margin-bottom:0;">${t('customers')}</div>
      <a class="text-sm font-semi" style="color:var(--blue-700)" data-nav="customers">${t('customers')} →</a>
    </div>
    <div class="card mb-5">
      ${APP_STATE.customers.length === 0 ? `<div class="empty-state"><p>${t('noCustomersYet')}</p></div>` :
        [...APP_STATE.customers].filter(c => customerBalance(c.id) !== 0).slice(0, 5).map(c => customerRowHtml(c)).join('') || `<div class="empty-state"><p>${t('allSettled')}</p></div>`}
    </div>

    <div class="flex items-center justify-between mb-3">
      <div class="section-title" style="margin-bottom:0;">${t('suppliers')}</div>
      <a class="text-sm font-semi" style="color:var(--blue-700)" data-nav="suppliers">${t('suppliers')} →</a>
    </div>
    <div class="card mb-5">
      ${APP_STATE.suppliers.length === 0 ? `<div class="empty-state"><p>${t('noSuppliersYet')}</p></div>` :
        [...APP_STATE.suppliers].filter(s => supplierBalance(s.id) !== 0).slice(0, 5).map(s => supplierRowHtml(s)).join('') || `<div class="empty-state"><p>${t('allSettled')}</p></div>`}
    </div>

    <div class="section-title">Recent Entries</div>
    <div class="card">
      ${entries.length === 0 ? `<div class="empty-state"><p>${t('noLedgerYet')}</p></div>` : entries.map(l => ledgerEntryWithPersonHtml(l)).join('')}
    </div>
  `;
}

function ledgerEntryWithPersonHtml(l) {
  const person = l.personType === 'customer' ? customerById(l.personId) : supplierById(l.personId);
  const isReceive = l.type === 'receive';
  return `
    <div class="list-row">
      <div class="row-avatar" style="background:${isReceive ? 'var(--green-100)' : 'var(--orange-100)'};color:${isReceive ? 'var(--green-700)' : 'var(--orange-700)'};">
        <i class="fa-solid ${isReceive ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
      </div>
      <div class="row-main">
        <div class="row-title">${person ? escapeHtml(person.name) : '—'}</div>
        <div class="row-sub">${isReceive ? t('receive') : t('give')} · ${fmtDate(l.date)}</div>
      </div>
      <div class="row-end"><div class="row-amount ${isReceive ? 'amt-positive' : 'amt-negative'}">${fmtMoney(l.amount)}</div></div>
    </div>
  `;
}

function openLedgerModal(type, presetPersonType, presetPersonId) {
  let personType = presetPersonType || 'customer';
  let personId = presetPersonId || '';

  function personOptions() {
    const list = personType === 'customer' ? APP_STATE.customers : APP_STATE.suppliers;
    return list.map(p => `<option value="${p.id}" ${p.id === personId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('');
  }

  const overlay = openModal({
    title: type === 'receive' ? t('receive') : t('give'),
    bodyHtml: `
      <form id="ledgerForm">
        ${!presetPersonType ? `
        <div class="field">
          <label>${t('relatedPerson')}</label>
          <div class="chip-select mb-2">
            <button type="button" class="chip ${personType === 'customer' ? 'active' : ''}" data-ptype="customer">${t('customer')}</button>
            <button type="button" class="chip ${personType === 'supplier' ? 'active' : ''}" data-ptype="supplier">${t('supplier')}</button>
          </div>
        </div>` : ''}
        <div class="field">
          <select class="input" name="personId" id="ledgerPersonSelect" ${presetPersonId ? 'disabled' : ''}>
            <option value="">—</option>
            ${personOptions()}
          </select>
        </div>
        <div class="field">
          <label>${t('amount')} *</label>
          <div class="input-group"><span class="prefix">${getCurrencySymbol()}</span><input class="input" type="number" min="0.01" step="0.01" name="amount" required></div>
        </div>
        <div class="field">
          <label>${t('notes')}</label>
          <input class="input" name="note" placeholder="${t('description')}">
        </div>
      </form>
    `,
    footerHtml: `<button class="btn ${type === 'receive' ? 'btn-success' : 'btn-danger'} btn-block" id="saveLedgerBtn">${t('save')}</button>`,
  });

  if (!presetPersonType) {
    overlay.querySelectorAll('[data-ptype]').forEach(b => b.onclick = () => {
      personType = b.dataset.ptype;
      overlay.querySelectorAll('[data-ptype]').forEach(x => x.classList.toggle('active', x === b));
      overlay.querySelector('#ledgerPersonSelect').innerHTML = `<option value="">—</option>${personOptions()}`;
    });
  }

  overlay.querySelector('#saveLedgerBtn').onclick = async () => {
    const form = overlay.querySelector('#ledgerForm');
    const fd = new FormData(form);
    const amount = parseFloat(fd.get('amount'));
    const pid = presetPersonId || fd.get('personId');
    if (!amount || amount <= 0) { showToast(t('somethingWrong'), 'error'); return; }
    if (!pid) { showToast(t('somethingWrong'), 'error'); return; }
    const entry = {
      id: uid('ldg'), date: Date.now(), type, personType, personId: pid,
      amount, note: (fd.get('note') || '').trim(), createdAt: Date.now(),
    };
    await DB.put('ledger', entry);
    APP_STATE.ledger.push(entry);
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    renderView();
  };
}

/* ---------------- EXPENSES ---------------- */
const EXPENSE_CATEGORIES = ['rent', 'electricity', 'transport', 'salary', 'packaging', 'purchase', 'maintenance', 'food', 'other'];

function renderExpensesList() {
  setTimeout(() => { document.getElementById('addExpenseBtn').onclick = () => openExpenseModal(); }, 0);
  const list = [...APP_STATE.expenses].sort((a, b) => b.date - a.date);
  const total = sumExpenses(list);
  return `
    <div class="page-header">
      <h1>${t('expenses')}</h1>
      <button class="btn btn-primary btn-sm" id="addExpenseBtn"><i class="fa-solid fa-plus"></i> ${t('add')}</button>
    </div>
    <div class="stat-card tone-red mb-4">
      <div class="stat-icon"><i class="fa-solid fa-money-bill-wave"></i></div>
      <div class="stat-label">${t('total')}</div>
      <div class="stat-value">${fmtMoney(total)}</div>
    </div>
    ${list.length === 0 ? `
      <div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-money-bill-wave"></i></div><h3>${t('noExpensesYet')}</h3></div>
    ` : `<div class="card">${list.map(e => expenseRowHtml(e)).join('')}</div>`}
  `;
}

function expenseRowHtml(e) {
  return `
    <div class="list-row clickable" onclick="openExpenseModal('${e.id}')">
      <div class="row-avatar" style="background:var(--red-100);color:var(--red-700);"><i class="fa-solid fa-money-bill-wave"></i></div>
      <div class="row-main">
        <div class="row-title">${t(e.category) || e.category}</div>
        <div class="row-sub">${escapeHtml(e.description || '')} · ${fmtDate(e.date)}</div>
      </div>
      <div class="row-end"><div class="row-amount amt-negative">${fmtMoney(e.amount)}</div></div>
    </div>
  `;
}

function openExpenseModal(id) {
  const editing = id ? APP_STATE.expenses.find(e => e.id === id) : null;
  const overlay = openModal({
    title: editing ? t('edit') : t('recordExpense'),
    bodyHtml: `
      <form id="expForm">
        <div class="field">
          <label>${t('expenseCategory')}</label>
          <div class="chip-select" id="expCatChips">
            ${EXPENSE_CATEGORIES.map(c => `<button type="button" class="chip ${editing && editing.category === c ? 'active' : (!editing && c === 'other' ? '' : '')}" data-cat="${c}">${t(c)}</button>`).join('')}
          </div>
          <input type="hidden" name="category" value="${editing ? editing.category : 'other'}">
        </div>
        <div class="field">
          <label>${t('amount')} *</label>
          <div class="input-group"><span class="prefix">${getCurrencySymbol()}</span><input class="input" type="number" min="0.01" step="0.01" name="amount" required value="${editing ? editing.amount : ''}"></div>
        </div>
        <div class="field">
          <label>${t('description')}</label>
          <input class="input" name="description" value="${editing ? escapeHtml(editing.description || '') : ''}">
        </div>
        <div class="field">
          <label>${t('paymentMethods')}</label>
          <select class="input" name="paymentMethod">
            ${['cash', 'upi', 'card', 'bank', 'other'].map(m => `<option value="${m}" ${editing && editing.paymentMethod === m ? 'selected' : ''}>${t(m)}</option>`).join('')}
          </select>
        </div>
      </form>
    `,
    footerHtml: `
      ${editing ? `<button class="btn btn-outline btn-icon" id="delExpBtn" style="color:var(--red-600);"><i class="fa-solid fa-trash"></i></button>` : ''}
      <button class="btn btn-primary btn-block" id="saveExpBtn">${t('save')}</button>
    `,
  });
  const catInput = overlay.querySelector('[name="category"]');
  overlay.querySelectorAll('#expCatChips [data-cat]').forEach(b => {
    if (b.dataset.cat === catInput.value) b.classList.add('active');
    b.onclick = () => {
      overlay.querySelectorAll('#expCatChips [data-cat]').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      catInput.value = b.dataset.cat;
    };
  });
  overlay.querySelector('#saveExpBtn').onclick = async () => {
    const form = overlay.querySelector('#expForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    const obj = {
      id: editing ? editing.id : uid('exp'),
      date: editing ? editing.date : Date.now(),
      category: fd.get('category'),
      amount: parseFloat(fd.get('amount')),
      description: fd.get('description').trim(),
      paymentMethod: fd.get('paymentMethod'),
      createdAt: editing ? editing.createdAt : Date.now(),
    };
    await DB.put('expenses', obj);
    const idx = APP_STATE.expenses.findIndex(e => e.id === obj.id);
    if (idx >= 0) APP_STATE.expenses[idx] = obj; else APP_STATE.expenses.push(obj);
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    renderView();
  };
  if (editing) {
    overlay.querySelector('#delExpBtn').onclick = async () => {
      const ok = await confirmDialog({ message: t('confirmDelete'), danger: true, confirmLabel: t('delete') });
      if (!ok) return;
      await DB.delete('expenses', editing.id);
      APP_STATE.expenses = APP_STATE.expenses.filter(e => e.id !== editing.id);
      closeModal();
      showToast(t('itemDeleted'));
      renderView();
    };
  }
}

/* ---------------- INCOME ---------------- */
function renderIncomeList() {
  setTimeout(() => { document.getElementById('addIncomeBtn').onclick = () => openIncomeModal(); }, 0);
  const list = [...APP_STATE.incomes].sort((a, b) => b.date - a.date);
  const total = sumIncomes(list);
  return `
    <div class="page-header">
      <h1>${t('income')}</h1>
      <button class="btn btn-primary btn-sm" id="addIncomeBtn"><i class="fa-solid fa-plus"></i> ${t('add')}</button>
    </div>
    <div class="stat-card tone-green mb-4">
      <div class="stat-icon"><i class="fa-solid fa-arrow-trend-up"></i></div>
      <div class="stat-label">${t('total')}</div>
      <div class="stat-value">${fmtMoney(total)}</div>
    </div>
    ${list.length === 0 ? `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-arrow-trend-up"></i></div><h3>${t('noIncomeYet')}</h3></div>`
      : `<div class="card">${list.map(i => incomeRowHtml(i)).join('')}</div>`}
  `;
}

function incomeRowHtml(i) {
  return `
    <div class="list-row clickable" onclick="openIncomeModal('${i.id}')">
      <div class="row-avatar" style="background:var(--green-100);color:var(--green-700);"><i class="fa-solid fa-arrow-trend-up"></i></div>
      <div class="row-main">
        <div class="row-title">${escapeHtml(i.description || t('income'))}</div>
        <div class="row-sub">${fmtDate(i.date)}</div>
      </div>
      <div class="row-end"><div class="row-amount amt-positive">${fmtMoney(i.amount)}</div></div>
    </div>
  `;
}

function openIncomeModal(id) {
  const editing = id ? APP_STATE.incomes.find(i => i.id === id) : null;
  const overlay = openModal({
    title: editing ? t('edit') : t('recordIncome'),
    bodyHtml: `
      <form id="incForm">
        <div class="field">
          <label>${t('amount')} *</label>
          <div class="input-group"><span class="prefix">${getCurrencySymbol()}</span><input class="input" type="number" min="0.01" step="0.01" name="amount" required value="${editing ? editing.amount : ''}"></div>
        </div>
        <div class="field">
          <label>${t('description')}</label>
          <input class="input" name="description" placeholder="e.g. Delivery charge" value="${editing ? escapeHtml(editing.description || '') : ''}">
        </div>
      </form>
    `,
    footerHtml: `
      ${editing ? `<button class="btn btn-outline btn-icon" id="delIncBtn" style="color:var(--red-600);"><i class="fa-solid fa-trash"></i></button>` : ''}
      <button class="btn btn-primary btn-block" id="saveIncBtn">${t('save')}</button>
    `,
  });
  overlay.querySelector('#saveIncBtn').onclick = async () => {
    const form = overlay.querySelector('#incForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    const obj = {
      id: editing ? editing.id : uid('inc'),
      date: editing ? editing.date : Date.now(),
      amount: parseFloat(fd.get('amount')),
      description: fd.get('description').trim(),
      createdAt: editing ? editing.createdAt : Date.now(),
    };
    await DB.put('incomes', obj);
    const idx = APP_STATE.incomes.findIndex(i => i.id === obj.id);
    if (idx >= 0) APP_STATE.incomes[idx] = obj; else APP_STATE.incomes.push(obj);
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    renderView();
  };
  if (editing) {
    overlay.querySelector('#delIncBtn').onclick = async () => {
      const ok = await confirmDialog({ message: t('confirmDelete'), danger: true, confirmLabel: t('delete') });
      if (!ok) return;
      await DB.delete('incomes', editing.id);
      APP_STATE.incomes = APP_STATE.incomes.filter(i => i.id !== editing.id);
      closeModal();
      showToast(t('itemDeleted'));
      renderView();
    };
  }
}

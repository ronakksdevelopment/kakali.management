/* ============================================================
   PURCHASES.JS
   ============================================================ */

let purchaseCart = null;
function freshPurchaseCart() { return { supplierId: '', items: [], paidNow: 0 }; }

function renderPurchasesList() {
  setTimeout(() => { document.getElementById('newPurchaseBtn').onclick = () => navigate('purchases/new'); }, 0);
  const list = [...APP_STATE.purchases].sort((a, b) => new Date(b.date) - new Date(a.date));
  return `
    <div class="page-header">
      <h1>${t('purchases')}</h1>
      <button class="btn btn-primary btn-sm" id="newPurchaseBtn"><i class="fa-solid fa-plus"></i> ${t('recordPurchase')}</button>
    </div>
    ${list.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-truck"></i></div>
        <h3>${t('noPurchasesYet')}</h3>
        <button class="btn btn-primary" onclick="navigate('purchases/new')"><i class="fa-solid fa-plus"></i> ${t('recordPurchase')}</button>
      </div>
    ` : `<div class="card">${list.map(p => purchaseRowHtml(p)).join('')}</div>`}
  `;
}

function renderPurchaseForm() {
  if (!purchaseCart) purchaseCart = freshPurchaseCart();
  setTimeout(() => mountPurchaseFormHandlers(), 0);
  const total = purchaseCart.items.reduce((s, it) => s + it.qty * it.cost, 0);
  const sup = purchaseCart.supplierId ? supplierById(purchaseCart.supplierId) : null;

  return `
    <div class="page-header">
      <div class="flex items-center gap-3">
        <button class="icon-btn" onclick="cancelPurchase()"><i class="fa-solid fa-arrow-left"></i></button>
        <h1>${t('recordPurchase')}</h1>
      </div>
    </div>

    <div class="card mb-4">
      <label style="font-weight:700;font-size:var(--fs-sm);color:var(--ink-700);display:block;margin-bottom:10px;">${t('supplier')}</label>
      <button class="btn btn-outline btn-block" id="pickSupplierBtn" style="justify-content:flex-start;">
        <i class="fa-solid fa-truck"></i> ${sup ? escapeHtml(sup.name) : t('selectCustomer').replace(t('customer'), t('supplier'))}
      </button>
    </div>

    <div class="card mb-4">
      <div class="flex items-center justify-between mb-3">
        <div class="section-title" style="margin-bottom:0;">${t('addItem')}</div>
        <button class="btn btn-accent btn-sm" id="addPurchaseItemBtn"><i class="fa-solid fa-plus"></i> ${t('product')}</button>
      </div>
      ${purchaseCart.items.length === 0 ? `<div class="empty-state" style="padding:var(--sp-6) 0;"><div class="empty-icon"><i class="fa-solid fa-boxes-stacked"></i></div><p>${t('selectProduct')}</p></div>`
        : purchaseCart.items.map((it, idx) => purchaseItemHtml(it, idx)).join('')}
    </div>

    <div class="card mb-4">
      <div class="flex justify-between mb-3"><span class="font-bold" style="font-size:var(--fs-md);">${t('total')}</span><span class="font-bold" style="font-size:var(--fs-lg);color:var(--blue-800);">${fmtMoney(total)}</span></div>
      <div class="field" style="margin-bottom:0;">
        <label>${t('paid')}</label>
        <div class="input-group"><span class="prefix">${getCurrencySymbol()}</span><input type="number" min="0" step="0.01" id="purchasePaidInput" class="input" value="${purchaseCart.paidNow}"></div>
      </div>
    </div>

    <button class="btn btn-primary btn-block btn-lg mb-3" id="savePurchaseBtn" ${purchaseCart.items.length === 0 ? 'disabled' : ''}>
      <i class="fa-solid fa-check"></i> ${t('save')}
    </button>
  `;
}

function purchaseItemHtml(it, idx) {
  return `
    <div class="list-row">
      <div class="row-main">
        <div class="row-title">${escapeHtml(it.name)}</div>
        <div class="row-sub">${fmtMoney(it.cost)} × ${it.qty}</div>
      </div>
      <div class="flex items-center gap-2">
        <div class="stepper">
          <button type="button" data-pdec="${idx}">−</button>
          <input type="text" readonly value="${it.qty}">
          <button type="button" data-pinc="${idx}">+</button>
        </div>
        <button class="icon-btn" data-prm="${idx}" style="width:32px;height:32px;color:var(--red-600);"><i class="fa-solid fa-trash text-xs"></i></button>
      </div>
    </div>
  `;
}

function mountPurchaseFormHandlers() {
  document.getElementById('pickSupplierBtn').onclick = () => pickSupplierSheet();
  document.getElementById('addPurchaseItemBtn').onclick = () => pickProductForPurchaseSheet();
  document.querySelectorAll('[data-pinc]').forEach(b => b.onclick = () => { purchaseCart.items[+b.dataset.pinc].qty += 1; renderView(); });
  document.querySelectorAll('[data-pdec]').forEach(b => b.onclick = () => {
    const i = +b.dataset.pdec; purchaseCart.items[i].qty -= 1;
    if (purchaseCart.items[i].qty <= 0) purchaseCart.items.splice(i, 1);
    renderView();
  });
  document.querySelectorAll('[data-prm]').forEach(b => b.onclick = () => { purchaseCart.items.splice(+b.dataset.prm, 1); renderView(); });
  document.getElementById('purchasePaidInput').oninput = (e) => { purchaseCart.paidNow = parseFloat(e.target.value) || 0; };
  document.getElementById('savePurchaseBtn').onclick = () => finalizePurchase();
}

function pickSupplierSheet() {
  const items = [
    ...APP_STATE.suppliers.map(s => ({ icon: 'fa-truck', label: s.name, onClick: () => { purchaseCart.supplierId = s.id; renderView(); } })),
    { icon: 'fa-plus', label: t('addSupplier'), bg: 'var(--gold-100)', color: 'var(--gold-700)', onClick: () => openSupplierModal(null, (s) => { purchaseCart.supplierId = s.id; renderView(); }) },
  ];
  actionSheet(items);
}

function pickProductForPurchaseSheet() {
  if (APP_STATE.products.length === 0) { openProductModal(null); return; }
  const overlay = openModal({
    title: t('selectProduct'),
    bodyHtml: `<div class="search-box mb-3"><i class="fa-solid fa-magnifying-glass"></i><input type="search" id="pickPurchProdSearch" placeholder="${t('search')}..."></div><div id="pickPurchProdList">${pickProductListHtml('')}</div>`,
  });
  const bind = () => overlay.querySelectorAll('[data-pick]').forEach(row => row.onclick = () => {
    const p = productById(row.dataset.pick);
    closeModal();
    const existing = purchaseCart.items.find(it => it.productId === p.id);
    if (existing) existing.qty += 1;
    else purchaseCart.items.push({ productId: p.id, name: p.name, cost: p.purchasePrice || 0, qty: 1 });
    renderView();
  });
  overlay.querySelector('#pickPurchProdSearch').oninput = debounce((e) => {
    overlay.querySelector('#pickPurchProdList').innerHTML = pickProductListHtml(e.target.value);
    bind();
  }, 150);
  bind();
}

function cancelPurchase() { purchaseCart = null; navigate('purchases'); }

async function finalizePurchase() {
  if (!purchaseCart.items.length) return;
  const total = purchaseCart.items.reduce((s, it) => s + it.qty * it.cost, 0);
  const paid = Math.min(total, purchaseCart.paidNow || 0);
  const due = Math.max(0, total - paid);
  const purchase = {
    id: uid('pur'), date: Date.now(), supplierId: purchaseCart.supplierId || null,
    items: purchaseCart.items.map(it => ({ productId: it.productId, name: it.name, cost: it.cost, qty: it.qty })),
    total, paid, due, createdAt: Date.now(),
  };
  await DB.put('purchases', purchase);
  APP_STATE.purchases.push(purchase);
  for (const it of purchase.items) {
    await adjustStock(it.productId, it.qty, 'purchase', purchase.id);
    const p = productById(it.productId);
    if (p && it.cost) { p.purchasePrice = it.cost; await DB.put('products', p); }
  }
  purchaseCart = null;
  showToast(t('savedSuccessfully'), 'success');
  navigate('purchases');
}

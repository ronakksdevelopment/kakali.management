/* ============================================================
   SALES.JS — sale list, new sale (cart), bill detail
   ============================================================ */

let saleFilter = 'all'; // all | due | paid

function renderSalesList() {
  setTimeout(() => {
    document.getElementById('newSaleBtn').onclick = () => navigate('sales/new');
    document.querySelectorAll('#saleTabs [data-f]').forEach(b => b.onclick = () => { saleFilter = b.dataset.f; renderView(); });
  }, 0);

  let list = [...APP_STATE.sales].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (saleFilter === 'due') list = list.filter(s => s.due > 0);
  if (saleFilter === 'paid') list = list.filter(s => s.due <= 0);

  return `
    <div class="page-header">
      <h1>${t('sales')}</h1>
      <button class="btn btn-primary btn-sm" id="newSaleBtn"><i class="fa-solid fa-plus"></i> ${t('newSale')}</button>
    </div>
    <div class="tabs mb-4" id="saleTabs">
      <button class="tab-btn ${saleFilter === 'all' ? 'active' : ''}" data-f="all">All</button>
      <button class="tab-btn ${saleFilter === 'due' ? 'active' : ''}" data-f="due">${t('due')}</button>
      <button class="tab-btn ${saleFilter === 'paid' ? 'active' : ''}" data-f="paid">${t('paid')}</button>
    </div>
    ${APP_STATE.sales.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
        <h3>${t('noSalesYet')}</h3>
        <p>${t('recordFirstSale')}</p>
        <button class="btn btn-primary" onclick="navigate('sales/new')"><i class="fa-solid fa-plus"></i> ${t('newSale')}</button>
      </div>
    ` : list.length === 0 ? `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div><h3>${t('noResultsFound')}</h3></div>` : `
      <div class="card">${list.map(s => saleRowHtml(s)).join('')}</div>
    `}
  `;
}

/* ---------------- New Sale (cart) ---------------- */
let cart = null;

function freshCart() {
  return { customerId: '', items: [], discount: 0, paymentMethod: 'cash', paidNow: null, notes: '' };
}

function renderSaleForm() {
  if (!cart) cart = freshCart();
  setTimeout(() => mountSaleFormHandlers(), 0);
  const subtotal = cart.items.reduce((s, it) => s + it.qty * it.price, 0);
  const taxTotal = cart.items.reduce((s, it) => s + (it.qty * it.price * (it.taxRate || 0) / 100), 0);
  const total = Math.max(0, subtotal - (cart.discount || 0) + taxTotal);
  const cust = cart.customerId ? customerById(cart.customerId) : null;

  return `
    <div class="page-header">
      <div class="flex items-center gap-3">
        <button class="icon-btn" onclick="cancelSale()"><i class="fa-solid fa-arrow-left"></i></button>
        <h1>${t('newSale')}</h1>
      </div>
    </div>

    <div class="card mb-4">
      <div class="flex items-center justify-between mb-3">
        <label style="font-weight:700;font-size:var(--fs-sm);color:var(--ink-700);">${t('selectCustomer')}</label>
      </div>
      <button class="btn btn-outline btn-block" id="pickCustomerBtn" style="justify-content:flex-start;">
        <i class="fa-solid fa-user"></i> ${cust ? escapeHtml(cust.name) : t('walkInCustomer')}
      </button>
    </div>

    <div class="card mb-4">
      <div class="flex items-center justify-between mb-3">
        <div class="section-title" style="margin-bottom:0;">${t('addItem')}</div>
        <button class="btn btn-accent btn-sm" id="addItemBtn"><i class="fa-solid fa-plus"></i> ${t('product')}</button>
      </div>
      ${cart.items.length === 0 ? `
        <div class="empty-state" style="padding:var(--sp-6) 0;">
          <div class="empty-icon"><i class="fa-solid fa-cart-plus"></i></div>
          <p>${t('selectProduct')}</p>
        </div>
      ` : cart.items.map((it, idx) => cartItemHtml(it, idx)).join('')}
    </div>

    <div class="card mb-4">
      <div class="flex justify-between mb-2"><span class="text-sm text-muted">${t('subtotal')}</span><span class="font-bold">${fmtMoney(subtotal)}</span></div>
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-muted">${t('discount')}</span>
        <input type="number" min="0" step="0.01" id="discountInput" class="input" style="width:120px;text-align:right;min-height:36px;padding:6px 10px;" value="${cart.discount || ''}" placeholder="0">
      </div>
      ${taxTotal > 0 ? `<div class="flex justify-between mb-2"><span class="text-sm text-muted">${t('tax')}</span><span class="font-bold">${fmtMoney(taxTotal)}</span></div>` : ''}
      <hr class="divider" style="margin:10px 0;">
      <div class="flex justify-between"><span class="font-bold" style="font-size:var(--fs-md);">${t('grandTotal')}</span><span class="font-bold" style="font-size:var(--fs-lg);color:var(--blue-800);">${fmtMoney(total)}</span></div>
    </div>

    <div class="card mb-4">
      <div class="section-title">${t('paymentMethods')}</div>
      <div class="chip-select mb-4" id="paymentMethodChips">
        ${['cash', 'upi', 'card', 'bank', 'other'].map(m => `<button type="button" class="chip ${cart.paymentMethod === m ? 'active' : ''}" data-pm="${m}">${t(m) || m}</button>`).join('')}
      </div>
      <div class="field" style="margin-bottom:0;">
        <label>${t('paid')}</label>
        <div class="input-group"><span class="prefix">${getCurrencySymbol()}</span>
          <input type="number" min="0" step="0.01" id="paidNowInput" class="input" value="${cart.paidNow === null ? total.toFixed(2) : cart.paidNow}" placeholder="0">
        </div>
        <div class="hint" id="dueHint"></div>
      </div>
    </div>

    <button class="btn btn-primary btn-block btn-lg mb-3" id="saveSaleBtn" ${cart.items.length === 0 ? 'disabled' : ''}>
      <i class="fa-solid fa-check"></i> ${t('saveBill')}
    </button>
  `;
}

function cartItemHtml(it, idx) {
  return `
    <div class="list-row">
      <div class="row-main">
        <div class="row-title">${escapeHtml(it.name)}</div>
        <div class="row-sub">${fmtMoney(it.price)} × ${it.qty}</div>
      </div>
      <div class="flex items-center gap-2">
        <div class="stepper">
          <button type="button" data-dec="${idx}">−</button>
          <input type="text" readonly value="${it.qty}">
          <button type="button" data-inc="${idx}">+</button>
        </div>
        <button class="icon-btn" data-rm="${idx}" style="width:32px;height:32px;color:var(--red-600);"><i class="fa-solid fa-trash text-xs"></i></button>
      </div>
    </div>
  `;
}

function mountSaleFormHandlers() {
  document.getElementById('pickCustomerBtn').onclick = () => pickCustomerSheet();
  document.getElementById('addItemBtn').onclick = () => pickProductSheet();
  document.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => { cart.items[+b.dataset.inc].qty += 1; cart.paidNow = null; renderView(); });
  document.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => {
    const i = +b.dataset.dec;
    cart.items[i].qty -= 1;
    if (cart.items[i].qty <= 0) cart.items.splice(i, 1);
    cart.paidNow = null;
    renderView();
  });
  document.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { cart.items.splice(+b.dataset.rm, 1); cart.paidNow = null; renderView(); });
  document.getElementById('discountInput').oninput = debounce((e) => { cart.discount = parseFloat(e.target.value) || 0; cart.paidNow = null; renderView(); }, 400);
  document.querySelectorAll('#paymentMethodChips [data-pm]').forEach(b => b.onclick = () => { cart.paymentMethod = b.dataset.pm; renderView(); });
  const paidInput = document.getElementById('paidNowInput');
  updateDueHint();
  paidInput.oninput = () => { cart.paidNow = parseFloat(paidInput.value) || 0; updateDueHint(); };
  document.getElementById('saveSaleBtn').onclick = () => finalizeSale();
}

function updateDueHint() {
  const subtotal = cart.items.reduce((s, it) => s + it.qty * it.price, 0);
  const taxTotal = cart.items.reduce((s, it) => s + (it.qty * it.price * (it.taxRate || 0) / 100), 0);
  const total = Math.max(0, subtotal - (cart.discount || 0) + taxTotal);
  const paid = cart.paidNow === null ? total : (parseFloat(document.getElementById('paidNowInput').value) || 0);
  const due = Math.max(0, total - paid);
  const hint = document.getElementById('dueHint');
  if (hint) hint.textContent = due > 0 ? `${t('due')}: ${fmtMoney(due)}` : t('fullyPaid');
}

function pickCustomerSheet() {
  const items = [
    { icon: 'fa-user', label: t('walkInCustomer'), bg: 'var(--ink-100)', color: 'var(--ink-600)', onClick: () => { cart.customerId = ''; renderView(); } },
    ...APP_STATE.customers.map(c => ({ icon: 'fa-user', label: c.name, onClick: () => { cart.customerId = c.id; renderView(); } })),
    { icon: 'fa-user-plus', label: t('addCustomer'), bg: 'var(--gold-100)', color: 'var(--gold-700)', onClick: () => openCustomerModal(null, (c) => { cart.customerId = c.id; renderView(); }) },
  ];
  actionSheet(items);
}

function pickProductSheet() {
  if (APP_STATE.products.length === 0) {
    openProductModal(null);
    showToast(t('addFirstProduct'));
    return;
  }
  const overlay = openModal({
    title: t('selectProduct'),
    bodyHtml: `
      <div class="search-box mb-3"><i class="fa-solid fa-magnifying-glass"></i><input type="search" id="pickProdSearch" placeholder="${t('search')}..."></div>
      <div id="pickProdList">${pickProductListHtml('')}</div>
    `,
  });
  overlay.querySelector('#pickProdSearch').oninput = debounce((e) => {
    overlay.querySelector('#pickProdList').innerHTML = pickProductListHtml(e.target.value);
    bindPickProductRows(overlay);
  }, 150);
  bindPickProductRows(overlay);
}

function pickProductListHtml(q) {
  let list = [...APP_STATE.products];
  if (q) { const s = q.toLowerCase(); list = list.filter(p => (p.name || '').toLowerCase().includes(s) || (p.sku || '').toLowerCase().includes(s)); }
  list.sort((a, b) => a.name.localeCompare(b.name));
  if (!list.length) return `<div class="empty-state" style="padding:24px;"><p>${t('noResultsFound')}</p></div>`;
  return list.map(p => `
    <div class="list-row clickable" data-pick="${p.id}">
      <div class="row-avatar" style="background:var(--blue-100);color:var(--blue-700);"><i class="fa-solid fa-box"></i></div>
      <div class="row-main"><div class="row-title">${escapeHtml(p.name)}</div><div class="row-sub">${fmtMoney(p.sellPrice)} · ${t('currentStock')}: ${p.stock}</div></div>
    </div>
  `).join('');
}

function bindPickProductRows(overlay) {
  overlay.querySelectorAll('[data-pick]').forEach(row => row.onclick = () => {
    const p = productById(row.dataset.pick);
    closeModal();
    addProductToCart(p);
  });
}

function addProductToCart(p) {
  const existing = cart.items.find(it => it.productId === p.id);
  if (existing) existing.qty += 1;
  else cart.items.push({ productId: p.id, name: p.name, price: p.sellPrice, qty: 1, taxRate: p.taxRate || 0 });
  cart.paidNow = null;
  renderView();
}

function cancelSale() {
  cart = null;
  navigate('sales');
}

async function finalizeSale() {
  if (!cart.items.length) return;
  const subtotal = cart.items.reduce((s, it) => s + it.qty * it.price, 0);
  const taxTotal = cart.items.reduce((s, it) => s + (it.qty * it.price * (it.taxRate || 0) / 100), 0);
  const total = Math.max(0, subtotal - (cart.discount || 0) + taxTotal);
  const paid = cart.paidNow === null ? total : cart.paidNow;
  const due = Math.max(0, total - paid);

  // stock check warning (non-blocking)
  const invoiceNo = nextInvoiceNo();
  const sale = {
    id: uid('sale'),
    invoiceNo,
    date: Date.now(),
    customerId: cart.customerId || null,
    items: cart.items.map(it => ({ productId: it.productId, name: it.name, price: it.price, qty: it.qty, taxRate: it.taxRate || 0 })),
    subtotal, discount: cart.discount || 0, tax: taxTotal, total, paid, due,
    paymentMethod: cart.paymentMethod, notes: cart.notes || '',
    createdAt: Date.now(),
  };
  await DB.put('sales', sale);
  APP_STATE.sales.push(sale);
  await bumpInvoiceCounter();

  for (const it of sale.items) {
    await adjustStock(it.productId, -it.qty, 'sale', sale.id);
  }

  cart = null;
  showToast(t('savedSuccessfully'), 'success');
  navigate('sales/view', { id: sale.id });
}

/* ---------------- Sale detail / bill ---------------- */
function renderSaleDetail(id) {
  const s = APP_STATE.sales.find(x => x.id === id);
  if (!s) { navigate('sales'); return ''; }
  const cust = s.customerId ? customerById(s.customerId) : null;

  setTimeout(() => {
    document.getElementById('billPrintBtn').onclick = () => printBill(s);
    document.getElementById('billShareBtn').onclick = () => shareBill(s, cust);
    document.getElementById('billDlBtn').onclick = () => downloadBill(s, cust);
    const dupBtn = document.getElementById('billDupBtn');
    if (dupBtn) dupBtn.onclick = () => duplicateSale(s);
    const payBtn = document.getElementById('billPayBtn');
    if (payBtn) payBtn.onclick = () => recordSalePayment(s);
  }, 0);

  return `
    <div class="page-header">
      <div class="flex items-center gap-3">
        <button class="icon-btn" onclick="navigate('sales')"><i class="fa-solid fa-arrow-left"></i></button>
        <h1>${s.invoiceNo}</h1>
      </div>
      <span class="badge ${s.due > 0 ? 'badge-red' : 'badge-green'}">${s.due > 0 ? t('due') : t('paid')}</span>
    </div>

    <div id="printArea">${billHtml(s, cust)}</div>

    <div class="flex gap-2 mt-4 no-print">
      <button class="btn btn-outline btn-block" id="billPrintBtn"><i class="fa-solid fa-print"></i> ${t('print')}</button>
      <button class="btn btn-outline btn-block" id="billDlBtn"><i class="fa-solid fa-download"></i> ${t('download')}</button>
      ${cust && cust.phone ? `<button class="btn btn-accent btn-block" id="billShareBtn"><i class="fa-brands fa-whatsapp"></i> ${t('share')}</button>` : ''}
    </div>
    <div class="flex gap-2 mt-3 no-print">
      <button class="btn btn-outline btn-block" id="billDupBtn"><i class="fa-solid fa-copy"></i> ${t('duplicate')}</button>
      ${s.due > 0 ? `<button class="btn btn-success btn-block" id="billPayBtn"><i class="fa-solid fa-hand-holding-dollar"></i> ${t('paymentReceived')}</button>` : ''}
    </div>
  `;
}

function billHtml(s, cust) {
  const biz = APP_STATE.settings;
  return `
    <div class="bill-doc">
      <div class="bill-head">
        <div class="biz-name">${escapeHtml(biz.businessName || t('appName'))}</div>
        <div class="biz-meta">${escapeHtml(biz.address || '')}${biz.phone ? ' · ' + escapeHtml(biz.phone) : ''}</div>
        ${biz.isGst && biz.gstNo ? `<div class="biz-meta">GSTIN: ${escapeHtml(biz.gstNo)}</div>` : ''}
      </div>
      <div class="bill-meta-row">
        <div>${s.invoiceNo}<br>${fmtDate(s.date)}</div>
        <div class="text-right">${cust ? escapeHtml(cust.name) : t('walkInCustomer')}<br>${cust && cust.phone ? escapeHtml(cust.phone) : ''}</div>
      </div>
      <table>
        <thead><tr><th>${t('product')}</th><th class="num">${t('qty')}</th><th class="num">${t('price')}</th><th class="num">${t('total')}</th></tr></thead>
        <tbody>
          ${s.items.map(it => `<tr><td>${escapeHtml(it.name)}</td><td class="num">${it.qty}</td><td class="num">${fmtMoney(it.price)}</td><td class="num">${fmtMoney(it.qty * it.price)}</td></tr>`).join('')}
        </tbody>
      </table>
      <div class="bill-totals">
        <div class="row"><span>${t('subtotal')}</span><span>${fmtMoney(s.subtotal)}</span></div>
        ${s.discount ? `<div class="row"><span>${t('discount')}</span><span>-${fmtMoney(s.discount)}</span></div>` : ''}
        ${s.tax ? `<div class="row"><span>${t('tax')}</span><span>${fmtMoney(s.tax)}</span></div>` : ''}
        <div class="row grand"><span>${t('total')}</span><span>${fmtMoney(s.total)}</span></div>
        <div class="row"><span>${t('paid')}</span><span>${fmtMoney(s.paid)}</span></div>
        ${s.due > 0 ? `<div class="row" style="color:#c0392b;font-weight:700;"><span>${t('due')}</span><span>${fmtMoney(s.due)}</span></div>` : ''}
      </div>
      <div class="bill-foot">Thank you for shopping with ${escapeHtml(biz.businessName || t('appName'))}!</div>
    </div>
  `;
}

function printBill(s) { window.print(); }

function downloadBill(s, cust) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${s.invoiceNo}</title>
  <style>${document.querySelector('link[href*="print.css"]') ? '' : ''} body{font-family:sans-serif;background:#fff;} </style>
  <link rel="stylesheet" href="css/print.css"></head><body>${billHtml(s, cust)}</body></html>`;
  download(`${s.invoiceNo}.html`, html, 'text/html');
}

function shareBill(s, cust) {
  const tmpl = APP_STATE.settings.whatsappTemplates.billShare;
  const text = tmpl.replace('{business}', APP_STATE.settings.businessName || t('appName'))
    .replace('{total}', fmtMoney(s.total)).replace('{paid}', fmtMoney(s.paid)).replace('{due}', fmtMoney(s.due));
  window.open(waLink(cust ? cust.phone : '', text), '_blank');
}

function duplicateSale(s) {
  cart = {
    customerId: s.customerId || '',
    items: s.items.map(it => ({ productId: it.productId, name: it.name, price: it.price, qty: it.qty, taxRate: it.taxRate || 0 })),
    discount: s.discount || 0,
    paymentMethod: s.paymentMethod || 'cash',
    paidNow: null,
    notes: '',
  };
  navigate('sales/new');
}

function recordSalePayment(s) {
  const overlay = openModal({
    title: t('paymentReceived'),
    bodyHtml: `
      <div class="field">
        <label>${t('amount')}</label>
        <div class="input-group"><span class="prefix">${getCurrencySymbol()}</span><input class="input" type="number" min="0" step="0.01" id="payAmt" value="${s.due}"></div>
        <div class="hint">${t('due')}: ${fmtMoney(s.due)}</div>
      </div>
    `,
    footerHtml: `<button class="btn btn-primary btn-block" id="payConfirmBtn">${t('confirm')}</button>`,
  });
  overlay.querySelector('#payConfirmBtn').onclick = async () => {
    const amt = Math.min(s.due, parseFloat(overlay.querySelector('#payAmt').value) || 0);
    if (amt <= 0) { closeModal(); return; }
    s.paid += amt;
    s.due -= amt;
    await DB.put('sales', s);
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    renderView();
  };
}

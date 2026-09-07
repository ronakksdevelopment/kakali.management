/* ============================================================
   PRODUCTS.JS — inventory management
   ============================================================ */

const UNITS = ['piece', 'kg', 'gram', 'litre', 'meter', 'box', 'pack', 'dozen', 'other'];
let productFilter = { search: '', category: 'all', sort: 'name' };

function renderProductsList() {
  setTimeout(() => mountProductsHandlers(), 0);
  const cats = [...new Set(APP_STATE.products.map(p => p.category).filter(Boolean))];
  let list = filterProducts();

  return `
    <div class="page-header">
      <h1>${t('products')}</h1>
      <button class="btn btn-primary btn-sm" id="addProductBtn"><i class="fa-solid fa-plus"></i> ${t('add')}</button>
    </div>

    <div class="search-box mb-3">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="search" id="prodSearch" placeholder="${t('search')}..." value="${escapeHtml(productFilter.search)}">
    </div>

    <div class="tabs mb-4" id="catTabs">
      <button class="tab-btn ${productFilter.category === 'all' ? 'active' : ''}" data-cat="all">${t('other') === 'Other' ? 'All' : 'All'}</button>
      ${cats.map(c => `<button class="tab-btn ${productFilter.category === c ? 'active' : ''}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}
    </div>

    ${APP_STATE.products.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-box"></i></div>
        <h3>${t('noProductsYet')}</h3>
        <p>${t('addFirstProduct')}</p>
        <button class="btn btn-primary" id="addProductBtn2"><i class="fa-solid fa-plus"></i> ${t('addProduct')}</button>
      </div>
    ` : list.length === 0 ? `
      <div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div><h3>${t('noResultsFound')}</h3></div>
    ` : `
      <div class="card">
        ${list.map(p => productRowHtml(p)).join('')}
      </div>
    `}
  `;
}

function filterProducts() {
  let list = [...APP_STATE.products];
  if (productFilter.category !== 'all') list = list.filter(p => p.category === productFilter.category);
  if (productFilter.search) {
    const q = productFilter.search.toLowerCase();
    list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q));
  }
  list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return list;
}

function productRowHtml(p) {
  const low = (p.stock ?? 0) <= (p.minStock ?? APP_STATE.settings.lowStockDefault ?? 5);
  const out = (p.stock ?? 0) <= 0;
  return `
    <div class="list-row clickable" onclick="openProductModal('${p.id}')">
      <div class="row-avatar" style="background:${out ? 'var(--red-100)' : low ? 'var(--orange-100)' : 'var(--blue-100)'};color:${out ? 'var(--red-700)' : low ? 'var(--orange-700)' : 'var(--blue-700)'};">
        <i class="fa-solid fa-box"></i>
      </div>
      <div class="row-main">
        <div class="row-title">${escapeHtml(p.name)}</div>
        <div class="row-sub">${fmtMoney(p.sellPrice)} ${p.sku ? '· ' + escapeHtml(p.sku) : ''}</div>
      </div>
      <div class="row-end">
        <div class="row-amount ${out ? 'amt-negative' : low ? '' : 'amt-neutral'}" style="${low && !out ? 'color:var(--orange-600)' : ''}">${p.stock ?? 0} ${t(p.unit) || ''}</div>
        ${out ? `<span class="badge badge-red">${t('outOfStock')}</span>` : low ? `<span class="badge badge-orange">${t('lowStock')}</span>` : ''}
      </div>
    </div>
  `;
}

function mountProductsHandlers() {
  const addBtn = document.getElementById('addProductBtn');
  const addBtn2 = document.getElementById('addProductBtn2');
  if (addBtn) addBtn.onclick = () => openProductModal();
  if (addBtn2) addBtn2.onclick = () => openProductModal();
  const search = document.getElementById('prodSearch');
  if (search) search.oninput = debounce((e) => { productFilter.search = e.target.value; rerenderList(); }, 200);
  document.querySelectorAll('#catTabs [data-cat]').forEach(b => b.onclick = () => { productFilter.category = b.dataset.cat; rerenderList(); });
}

function rerenderList() {
  document.getElementById('view').innerHTML = renderProductsList();
  mountProductsHandlers();
  const search = document.getElementById('prodSearch');
  if (search) { search.focus(); search.setSelectionRange(search.value.length, search.value.length); }
}

function openProductModal(id) {
  const editing = id ? productById(id) : null;
  const suppliersOpts = APP_STATE.suppliers.map(s => `<option value="${s.id}" ${editing && editing.supplierId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('');

  const overlay = openModal({
    title: editing ? t('editProduct') : t('addProduct'),
    bodyHtml: `
      <form id="productForm">
        <div class="field">
          <label>${t('productName')} *</label>
          <input class="input" name="name" required value="${editing ? escapeHtml(editing.name) : ''}" placeholder="e.g. Notebook">
        </div>
        <div class="input-row">
          <div class="field">
            <label>${t('sku')}</label>
            <input class="input" name="sku" value="${editing ? escapeHtml(editing.sku || '') : ''}">
          </div>
          <div class="field">
            <label>${t('category')}</label>
            <input class="input" name="category" value="${editing ? escapeHtml(editing.category || '') : ''}" placeholder="e.g. Stationery">
          </div>
        </div>
        <div class="input-row">
          <div class="field">
            <label>${t('purchasePrice')}</label>
            <div class="input-group"><span class="prefix">${getCurrencySymbol()}</span><input class="input" type="number" step="0.01" min="0" name="purchasePrice" value="${editing ? editing.purchasePrice : ''}"></div>
          </div>
          <div class="field">
            <label>${t('sellPrice')} *</label>
            <div class="input-group"><span class="prefix">${getCurrencySymbol()}</span><input class="input" type="number" step="0.01" min="0" name="sellPrice" required value="${editing ? editing.sellPrice : ''}"></div>
          </div>
        </div>
        <div class="input-row">
          <div class="field">
            <label>${t('currentStock')}</label>
            <input class="input" type="number" step="0.01" name="stock" value="${editing ? editing.stock : 0}">
          </div>
          <div class="field">
            <label>${t('unit')}</label>
            <select class="input" name="unit">
              ${UNITS.map(u => `<option value="${u}" ${editing && editing.unit === u ? 'selected' : ''}>${t(u)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="input-row">
          <div class="field">
            <label>${t('minStock')}</label>
            <input class="input" type="number" step="0.01" name="minStock" value="${editing ? editing.minStock : APP_STATE.settings.lowStockDefault || 5}">
          </div>
          <div class="field">
            <label>${t('taxRate')}</label>
            <input class="input" type="number" step="0.01" min="0" name="taxRate" value="${editing ? editing.taxRate || 0 : 0}">
          </div>
        </div>
        ${APP_STATE.suppliers.length ? `
        <div class="field">
          <label>${t('supplier')}</label>
          <select class="input" name="supplierId"><option value="">—</option>${suppliersOpts}</select>
        </div>` : ''}
        <div class="field">
          <label>${t('notes')}</label>
          <textarea class="input" name="notes">${editing ? escapeHtml(editing.notes || '') : ''}</textarea>
        </div>
        <div class="field">
          <label>Product image URL <span class="text-muted">(optional)</span></label>
          <input class="input" name="image" type="url" value="${editing ? escapeHtml(editing.image || '') : ''}" placeholder="https://…">
        </div>
        <div class="field">
          <label>Extra QR label details <span class="text-muted">(optional)</span></label>
          <textarea class="input" name="qrDetails" placeholder="Size, colour, offer, or any information to include in the QR">${editing ? escapeHtml(editing.qrDetails || '') : ''}</textarea>
        </div>
      </form>
    `,
    footerHtml: `
      ${editing ? `<button class="btn btn-outline" id="delProdBtn" style="flex:0;color:var(--red-600);border-color:var(--red-200,var(--ink-200));"><i class="fa-solid fa-trash"></i></button>` : ''}
      ${editing ? `<button class="btn btn-outline" id="productQrBtn" title="Generate product QR"><i class="fa-solid fa-qrcode"></i></button>` : ''}
      <button class="btn btn-primary btn-block" id="saveProdBtn">${editing ? t('update') : t('save')}</button>
    `,
  });

  overlay.querySelector('#saveProdBtn').onclick = async () => {
    const form = overlay.querySelector('#productForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    const name = fd.get('name').trim();
    const sellPrice = parseFloat(fd.get('sellPrice')) || 0;
    if (!name) { showToast(t('somethingWrong'), 'error'); return; }
    const obj = {
      id: editing ? editing.id : uid('prod'),
      name,
      sku: fd.get('sku').trim(),
      category: fd.get('category').trim(),
      purchasePrice: parseFloat(fd.get('purchasePrice')) || 0,
      sellPrice,
      stock: parseFloat(fd.get('stock')) || 0,
      minStock: parseFloat(fd.get('minStock')) || 0,
      unit: fd.get('unit'),
      supplierId: fd.get('supplierId') || null,
      taxRate: parseFloat(fd.get('taxRate')) || 0,
      notes: fd.get('notes').trim(),
      image: fd.get('image').trim(),
      qrDetails: fd.get('qrDetails').trim(),
      createdAt: editing ? editing.createdAt : Date.now(),
    };
    await DB.put('products', obj);
    const idx = APP_STATE.products.findIndex(p => p.id === obj.id);
    if (idx >= 0) APP_STATE.products[idx] = obj; else APP_STATE.products.push(obj);
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    if (baseKey(APP_STATE.route) === 'products') rerenderList();
    if (baseKey(APP_STATE.route) === 'dashboard') renderView();
  };

  if (editing) {
    overlay.querySelector('#productQrBtn').onclick = () => openProductQrModal(editing);
    overlay.querySelector('#delProdBtn').onclick = async () => {
      const ok = await confirmDialog({ message: t('confirmDelete'), danger: true, confirmLabel: t('delete') });
      if (!ok) return;
      await DB.delete('products', editing.id);
      APP_STATE.products = APP_STATE.products.filter(p => p.id !== editing.id);
      closeModal();
      showToast(t('itemDeleted'));
      if (baseKey(APP_STATE.route) === 'products') rerenderList();
    };
  }
}

async function adjustStock(productId, delta, reason, refId) {
  const p = productById(productId);
  if (!p) return;
  p.stock = Math.round(((p.stock || 0) + delta) * 100) / 100;
  await DB.put('products', p);
  const log = { id: uid('stk'), productId, date: Date.now(), change: delta, reason, refId, createdAt: Date.now() };
  await DB.put('stockLog', log);
  APP_STATE.stockLog.push(log);
}

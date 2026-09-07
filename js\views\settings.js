/* ============================================================
   SETTINGS.JS
   ============================================================ */

function renderSettings() {
  setTimeout(() => mountSettingsHandlers(), 0);
  const s = APP_STATE.settings;
  return `
    <div class="page-header"><h1>${t('settings')}</h1></div>

    <div class="section-title">${t('businessProfile')}</div>
    <div class="section-card mb-5">
      <div class="settings-row clickable" id="editProfileRow">
        <div class="s-icon"><i class="fa-solid fa-store"></i></div>
        <div class="s-main"><div class="s-title">${escapeHtml(s.businessName || '—')}</div><div class="s-sub">${escapeHtml(s.ownerName || '')}</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>
      <div class="settings-row clickable" id="gstRow">
        <div class="s-icon"><i class="fa-solid fa-receipt"></i></div>
        <div class="s-main"><div class="s-title">${t('gstSettings')}</div><div class="s-sub">${s.isGst ? t('gstBusiness') : t('nonGst')}</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>
    </div>

    <div class="section-title">${t('appearance')}</div>
    <div class="section-card mb-5">
      <div class="settings-row clickable" id="langRow">
        <div class="s-icon"><i class="fa-solid fa-language"></i></div>
        <div class="s-main"><div class="s-title">${t('language')}</div><div class="s-sub">${({ en: 'English', bn: 'বাংলা', hi: 'हिन्दी' })[s.language]}</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>
      <div class="settings-row clickable" id="currRow">
        <div class="s-icon"><i class="fa-solid fa-coins"></i></div>
        <div class="s-main"><div class="s-title">${t('currency')}</div><div class="s-sub">${s.currency}</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>
      <div class="settings-row">
        <div class="s-icon"><i class="fa-solid fa-moon"></i></div>
        <div class="s-main"><div class="s-title">${t('darkMode')}</div></div>
        <label class="switch"><input type="checkbox" id="darkModeToggle" ${s.theme === 'dark' ? 'checked' : ''}><span class="track"></span></label>
      </div>
    </div>

    <div class="section-title">${t('lowStockSettings')}</div>
    <div class="section-card mb-5">
      <div class="settings-row">
        <div class="s-icon"><i class="fa-solid fa-box"></i></div>
        <div class="s-main">
          <div class="s-title">${t('minStock')} (${t('other')})</div>
          <div class="s-sub">Default minimum level for new products</div>
        </div>
        <input type="number" min="0" id="lowStockInput" class="input" style="width:70px;min-height:36px;padding:6px 8px;text-align:center;" value="${s.lowStockDefault}">
      </div>
    </div>

    <div class="section-title">${t('pinLock')}</div>
    <div class="section-card mb-5">
      <div class="settings-row">
        <div class="s-icon"><i class="fa-solid fa-lock"></i></div>
        <div class="s-main"><div class="s-title">${t('enablePin')}</div></div>
        <label class="switch"><input type="checkbox" id="pinToggle" ${s.pinEnabled ? 'checked' : ''}><span class="track"></span></label>
      </div>
      ${s.pinEnabled ? `
      <div class="settings-row clickable" id="changePinRow">
        <div class="s-icon"><i class="fa-solid fa-key"></i></div>
        <div class="s-main"><div class="s-title">${t('changePin')}</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>` : ''}
    </div>

    <div class="section-title">${t('whatsappTemplates')}</div>
    <div class="section-card mb-5">
      <div class="settings-row clickable" id="waTemplatesRow">
        <div class="s-icon"><i class="fa-brands fa-whatsapp"></i></div>
        <div class="s-main"><div class="s-title">${t('whatsappTemplates')}</div><div class="s-sub">Edit reminder and bill messages</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>
    </div>

    <div class="section-title">${t('backupRestore')}</div>
    <div class="section-card mb-5">
      <div class="settings-row clickable" id="exportBackupRow">
        <div class="s-icon"><i class="fa-solid fa-database"></i></div>
        <div class="s-main"><div class="s-title">${t('exportBackup')}</div><div class="s-sub">${t('dataStoredLocally')}</div></div>
        <i class="fa-solid fa-download text-muted"></i>
      </div>
      <div class="settings-row clickable" id="importBackupRow">
        <div class="s-icon"><i class="fa-solid fa-upload"></i></div>
        <div class="s-main"><div class="s-title">${t('importBackup')}</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>
      <div class="settings-row clickable" id="exportCsvRow">
        <div class="s-icon"><i class="fa-solid fa-file-csv"></i></div>
        <div class="s-main"><div class="s-title">${t('exportCsv')}</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>
      <input type="file" id="importFileInput" accept=".json" class="hidden">
    </div>

    <div class="section-title">${t('about')}</div>
    <div class="section-card mb-5">
      <div class="settings-row">
        <div class="s-icon"><i class="fa-solid fa-circle-info"></i></div>
        <div class="s-main"><div class="s-title">${t('appName')}</div><div class="s-sub">v1.0 · ${t('dataStoredLocally')}</div></div>
      </div>
      <div class="settings-row clickable" id="installRow">
        <div class="s-icon"><i class="fa-solid fa-mobile-screen"></i></div>
        <div class="s-main"><div class="s-title">${t('install')}</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>
      ${!s.sampleDataLoaded && APP_STATE.products.length === 0 && APP_STATE.customers.length === 0 ? `
      <div class="settings-row clickable" id="loadSampleRow">
        <div class="s-icon"><i class="fa-solid fa-flask"></i></div>
        <div class="s-main"><div class="s-title">Load Sample Data</div><div class="s-sub">Explore the app with example products, customers &amp; suppliers</div></div>
        <i class="fa-solid fa-chevron-right text-muted"></i>
      </div>` : ''}
    </div>

    <div class="section-card mb-5">
      <div class="settings-row clickable" id="resetDataRow">
        <div class="s-icon" style="background:var(--red-100);color:var(--red-700);"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="s-main"><div class="s-title" style="color:var(--red-600);">${t('resetData')}</div></div>
      </div>
    </div>
  `;
}

function mountSettingsHandlers() {
  document.getElementById('editProfileRow').onclick = () => openBusinessProfileModal();
  document.getElementById('gstRow').onclick = () => openGstModal();
  document.getElementById('langRow').onclick = () => openLanguagePicker();
  document.getElementById('currRow').onclick = () => openCurrencyPicker();
  document.getElementById('darkModeToggle').onchange = async (e) => { await saveSettings({ theme: e.target.checked ? 'dark' : 'light' }); };
  document.getElementById('lowStockInput').onchange = async (e) => { await saveSettings({ lowStockDefault: parseFloat(e.target.value) || 5 }); showToast(t('savedSuccessfully'), 'success'); };
  document.getElementById('pinToggle').onchange = (e) => { if (e.target.checked) openSetPinFlow(); else disablePinFlow(); };
  const changePinRow = document.getElementById('changePinRow');
  if (changePinRow) changePinRow.onclick = () => openSetPinFlow(true);
  document.getElementById('waTemplatesRow').onclick = () => openWhatsappTemplatesModal();
  document.getElementById('exportBackupRow').onclick = () => exportBackup();
  document.getElementById('importBackupRow').onclick = () => document.getElementById('importFileInput').click();
  document.getElementById('importFileInput').onchange = (e) => handleImportFile(e.target.files[0]);
  document.getElementById('exportCsvRow').onclick = () => openExportCsvSheet();
  document.getElementById('installRow').onclick = () => triggerInstallPrompt();
  document.getElementById('resetDataRow').onclick = () => resetAllData();
  const sampleRow = document.getElementById('loadSampleRow');
  if (sampleRow) sampleRow.onclick = () => loadSampleData();
}

function openBusinessProfileModal() {
  const s = APP_STATE.settings;
  const overlay = openModal({
    title: t('businessProfile'),
    bodyHtml: `
      <form id="bizForm">
        <div class="field"><label>${t('businessName')} *</label><input class="input" name="businessName" required value="${escapeHtml(s.businessName || '')}"></div>
        <div class="field"><label>${t('ownerName')}</label><input class="input" name="ownerName" value="${escapeHtml(s.ownerName || '')}"></div>
        <div class="field"><label>${t('phone')}</label><input class="input" type="tel" name="phone" value="${escapeHtml(s.phone || '')}"></div>
        <div class="field"><label>${t('address')}</label><textarea class="input" name="address">${escapeHtml(s.address || '')}</textarea></div>
      </form>
    `,
    footerHtml: `<button class="btn btn-primary btn-block" id="saveBizBtn">${t('save')}</button>`,
  });
  overlay.querySelector('#saveBizBtn').onclick = async () => {
    const form = overlay.querySelector('#bizForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    await saveSettings({ businessName: fd.get('businessName').trim(), ownerName: fd.get('ownerName').trim(), phone: fd.get('phone').trim(), address: fd.get('address').trim() });
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    renderShell();
    renderShellNav();
    navigate('settings');
  };
}

function openGstModal() {
  const s = APP_STATE.settings;
  const overlay = openModal({
    title: t('gstSettings'),
    bodyHtml: `
      <div class="switch-row mb-3">
        <span class="font-semi">${t('gstBusiness')}</span>
        <label class="switch"><input type="checkbox" id="gstToggle" ${s.isGst ? 'checked' : ''}><span class="track"></span></label>
      </div>
      <div class="field" id="gstNoField" style="${s.isGst ? '' : 'display:none;'}">
        <label>GSTIN</label>
        <input class="input" id="gstNoInput" value="${escapeHtml(s.gstNo || '')}">
      </div>
      <p class="text-xs text-muted">This only controls whether GSTIN is shown on your bills. It does not guarantee legal GST filing compliance.</p>
    `,
    footerHtml: `<button class="btn btn-primary btn-block" id="saveGstBtn">${t('save')}</button>`,
  });
  overlay.querySelector('#gstToggle').onchange = (e) => { overlay.querySelector('#gstNoField').style.display = e.target.checked ? '' : 'none'; };
  overlay.querySelector('#saveGstBtn').onclick = async () => {
    await saveSettings({ isGst: overlay.querySelector('#gstToggle').checked, gstNo: overlay.querySelector('#gstNoInput').value.trim() });
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
    renderView();
  };
}

function openLanguagePicker() {
  actionSheet([
    { icon: 'fa-language', label: 'English', onClick: async () => { await saveSettings({ language: 'en' }); renderShellNav(); renderView(); } },
    { icon: 'fa-language', label: 'বাংলা', onClick: async () => { await saveSettings({ language: 'bn' }); renderShellNav(); renderView(); } },
    { icon: 'fa-language', label: 'हिन्दी', onClick: async () => { await saveSettings({ language: 'hi' }); renderShellNav(); renderView(); } },
  ]);
}

function openCurrencyPicker() {
  const opts = Object.keys(CURRENCY_SYMBOLS);
  actionSheet(opts.map(c => ({
    icon: 'fa-coins', label: `${c} (${CURRENCY_SYMBOLS[c]})`,
    onClick: async () => { await saveSettings({ currency: c }); renderView(); },
  })));
}

/* ---------------- PIN ---------------- */
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function openSetPinFlow(isChange) {
  showPinCapture(t('createPin'), async (pin1) => {
    showPinCapture(t('confirmPin'), async (pin2) => {
      if (pin1 !== pin2) {
        showToast(t('wrongPin'), 'error');
        closePinCapture();
        return;
      }
      const hash = await sha256(pin1);
      await saveSettings({ pinEnabled: true, pinHash: hash });
      closePinCapture();
      showToast(t('savedSuccessfully'), 'success');
      renderView();
    });
  }, () => { if (!isChange) { renderView(); } });
}

function disablePinFlow() {
  saveSettings({ pinEnabled: false, pinHash: '' }).then(() => { showToast(t('savedSuccessfully'), 'success'); renderView(); });
}

function showPinCapture(title, onComplete, onCancel) {
  closePinCapture();
  let entered = '';
  const overlay = document.createElement('div');
  overlay.className = 'pin-screen';
  overlay.id = 'pinCaptureScreen';
  overlay.innerHTML = `
    <img src="icons/icon-128.png" alt="">
    <h2>${title}</h2>
    <div class="pin-dots" id="pinDots">${[0, 1, 2, 3].map(() => '<div class="pin-dot"></div>').join('')}</div>
    <div class="pin-keypad">
      ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="pin-key" data-num="${n}">${n}</button>`).join('')}
      <button class="pin-key ghost" id="pinCancelBtn"><i class="fa-solid fa-xmark"></i></button>
      <button class="pin-key" data-num="0">0</button>
      <button class="pin-key ghost" id="pinBackBtn"><i class="fa-solid fa-delete-left"></i></button>
    </div>
  `;
  document.body.appendChild(overlay);
  const dots = () => overlay.querySelectorAll('.pin-dot');
  function updateDots() { dots().forEach((d, i) => d.classList.toggle('filled', i < entered.length)); }
  overlay.querySelectorAll('[data-num]').forEach(b => b.onclick = () => {
    if (entered.length >= 4) return;
    entered += b.dataset.num;
    updateDots();
    if (entered.length === 4) { const val = entered; setTimeout(() => onComplete(val), 150); }
  });
  overlay.querySelector('#pinBackBtn').onclick = () => { entered = entered.slice(0, -1); updateDots(); };
  overlay.querySelector('#pinCancelBtn').onclick = () => { closePinCapture(); if (onCancel) onCancel(); };
}
function closePinCapture() {
  document.querySelectorAll('#pinCaptureScreen').forEach(el => el.remove());
}

/* ---------------- WhatsApp Templates ---------------- */
function openWhatsappTemplatesModal() {
  const tmpl = APP_STATE.settings.whatsappTemplates;
  const overlay = openModal({
    title: t('whatsappTemplates'),
    bodyHtml: `
      <form id="waForm">
        <div class="field">
          <label>Due Reminder</label>
          <textarea class="input" name="dueReminder" rows="3">${escapeHtml(tmpl.dueReminder)}</textarea>
          <div class="hint">Use {name}, {business}, {amount}</div>
        </div>
        <div class="field">
          <label>Bill Share</label>
          <textarea class="input" name="billShare" rows="3">${escapeHtml(tmpl.billShare)}</textarea>
          <div class="hint">Use {business}, {total}, {paid}, {due}</div>
        </div>
        <div class="field">
          <label>Payment Reminder</label>
          <textarea class="input" name="paymentReminder" rows="3">${escapeHtml(tmpl.paymentReminder)}</textarea>
          <div class="hint">Use {business}, {amount}</div>
        </div>
      </form>
    `,
    footerHtml: `<button class="btn btn-primary btn-block" id="saveWaBtn">${t('save')}</button>`,
  });
  overlay.querySelector('#saveWaBtn').onclick = async () => {
    const fd = new FormData(overlay.querySelector('#waForm'));
    await saveSettings({ whatsappTemplates: { dueReminder: fd.get('dueReminder'), billShare: fd.get('billShare'), paymentReminder: fd.get('paymentReminder') } });
    closeModal();
    showToast(t('savedSuccessfully'), 'success');
  };
}

/* ---------------- Backup / Restore ---------------- */
async function exportBackup() {
  const data = await DB.exportAll();
  download(`kakali-backup-${todayISO()}.json`, JSON.stringify(data, null, 2));
  showToast(t('savedSuccessfully'), 'success');
}

function handleImportFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    let data;
    try { data = JSON.parse(e.target.result); } catch (err) { showToast(t('somethingWrong'), 'error'); return; }
    if (!data || typeof data !== 'object') { showToast(t('somethingWrong'), 'error'); return; }
    const ok = await confirmDialog({ message: t('restoreWarning'), danger: true, confirmLabel: t('confirm'), icon: 'fa-clock-rotate-left' });
    if (!ok) return;
    await DB.importAll(data);
    await loadAllState();
    showToast(t('savedSuccessfully'), 'success');
    renderShell();
    navigate('dashboard');
  };
  reader.readAsText(file);
  document.getElementById('importFileInput').value = '';
}

function openExportCsvSheet() {
  actionSheet([
    { icon: 'fa-cart-shopping', label: t('sales'), onClick: () => exportCsvFor('sales') },
    { icon: 'fa-box', label: t('products'), onClick: () => exportCsvFor('products') },
    { icon: 'fa-users', label: t('customers'), onClick: () => exportCsvFor('customers') },
    { icon: 'fa-truck', label: t('suppliers'), onClick: () => exportCsvFor('suppliers') },
    { icon: 'fa-money-bill-wave', label: t('expenses'), onClick: () => exportCsvFor('expenses') },
  ]);
}

function exportCsvFor(type) {
  let rows = [];
  if (type === 'sales') rows = APP_STATE.sales.map(s => ({ invoice: s.invoiceNo, date: fmtDate(s.date), total: s.total, paid: s.paid, due: s.due }));
  if (type === 'products') rows = APP_STATE.products.map(p => ({ name: p.name, sku: p.sku, stock: p.stock, sellPrice: p.sellPrice, purchasePrice: p.purchasePrice }));
  if (type === 'customers') rows = APP_STATE.customers.map(c => ({ name: c.name, phone: c.phone, due: customerBalance(c.id) }));
  if (type === 'suppliers') rows = APP_STATE.suppliers.map(s => ({ name: s.name, phone: s.phone, due: supplierBalance(s.id) }));
  if (type === 'expenses') rows = APP_STATE.expenses.map(e => ({ date: fmtDate(e.date), category: e.category, amount: e.amount, description: e.description }));
  if (!rows.length) { showToast(t('noResultsFound')); return; }
  download(`${type}-export.csv`, toCSV(rows), 'text/csv');
}

async function resetAllData() {
  const ok = await confirmDialog({ message: t('confirmReset'), danger: true, confirmLabel: t('resetData'), icon: 'fa-triangle-exclamation' });
  if (!ok) return;
  const ok2 = await confirmDialog({ message: t('confirmReset'), danger: true, confirmLabel: t('yes') });
  if (!ok2) return;
  await DB.clearAll();
  location.reload();
}

function triggerInstallPrompt() {
  if (window.deferredInstallPrompt) {
    window.deferredInstallPrompt.prompt();
  } else {
    showToast('Use your browser menu → "Add to Home Screen" or "Install App".');
  }
}

/* ---------------- Sample Data ---------------- */
async function loadSampleData() {
  const ok = await confirmDialog({
    title: 'Load Sample Data',
    message: 'This will add example products, customers, and suppliers so you can explore the app. You can clear it anytime from Reset Data.',
    confirmLabel: t('confirm'),
    icon: 'fa-flask',
  });
  if (!ok) return;

  const suppliers = [
    { id: uid('sup'), name: 'ABC Distributors', phone: '9800000001', address: '', notes: '(sample data)', createdAt: Date.now() },
    { id: uid('sup'), name: 'Stationery Wholesale Hub', phone: '9800000002', address: '', notes: '(sample data)', createdAt: Date.now() },
  ];
  for (const s of suppliers) await DB.put('suppliers', s);
  APP_STATE.suppliers.push(...suppliers);

  const products = [
    { id: uid('prod'), name: 'Notebook', sku: 'NB-001', category: 'Stationery', purchasePrice: 35, sellPrice: 50, stock: 40, minStock: 10, unit: 'piece', supplierId: suppliers[1].id, taxRate: 0, notes: '(sample data)', createdAt: Date.now() },
    { id: uid('prod'), name: 'Blue Pen', sku: 'PN-BL', category: 'Stationery', purchasePrice: 6, sellPrice: 10, stock: 100, minStock: 20, unit: 'piece', supplierId: suppliers[1].id, taxRate: 0, notes: '(sample data)', createdAt: Date.now() },
    { id: uid('prod'), name: 'Ball Pen', sku: 'PN-BALL', category: 'Stationery', purchasePrice: 9, sellPrice: 15, stock: 80, minStock: 20, unit: 'piece', supplierId: suppliers[1].id, taxRate: 0, notes: '(sample data)', createdAt: Date.now() },
    { id: uid('prod'), name: 'A4 Paper', sku: 'PPR-A4', category: 'Stationery', purchasePrice: 190, sellPrice: 250, stock: 15, minStock: 5, unit: 'pack', supplierId: suppliers[1].id, taxRate: 0, notes: '(sample data)', createdAt: Date.now() },
    { id: uid('prod'), name: 'School Bag', sku: 'BAG-01', category: 'Accessories', purchasePrice: 480, sellPrice: 650, stock: 3, minStock: 5, unit: 'piece', supplierId: suppliers[0].id, taxRate: 0, notes: '(sample data)', createdAt: Date.now() },
  ];
  for (const p of products) await DB.put('products', p);
  APP_STATE.products.push(...products);

  const customers = [
    { id: uid('cust'), name: 'Rahim', phone: '9123456701', address: '', notes: '(sample data)', createdAt: Date.now() },
    { id: uid('cust'), name: 'Suman', phone: '9123456702', address: '', notes: '(sample data)', createdAt: Date.now() },
    { id: uid('cust'), name: 'Priya', phone: '9123456703', address: '', notes: '(sample data)', createdAt: Date.now() },
  ];
  for (const c of customers) await DB.put('customers', c);
  APP_STATE.customers.push(...customers);

  // Rahim owes 1200, Suman owes 350, Priya paid in full
  const sales = [
    { id: uid('sale'), invoiceNo: nextInvoiceNo(), date: Date.now() - 86400000, customerId: customers[0].id,
      items: [{ productId: products[4].id, name: products[4].name, price: 650, qty: 1, taxRate: 0 }, { productId: products[0].id, name: products[0].name, price: 50, qty: 11, taxRate: 0 }],
      subtotal: 1200, discount: 0, tax: 0, total: 1200, paid: 0, due: 1200, paymentMethod: 'cash', notes: '(sample data)', createdAt: Date.now() },
  ];
  await bumpInvoiceCounter();
  sales.push({ id: uid('sale'), invoiceNo: nextInvoiceNo(), date: Date.now() - 43200000, customerId: customers[1].id,
    items: [{ productId: products[3].id, name: products[3].name, price: 250, qty: 1, taxRate: 0 }, { productId: products[2].id, name: products[2].name, price: 15, qty: 6.67, taxRate: 0 }],
    subtotal: 350, discount: 0, tax: 0, total: 350, paid: 0, due: 350, paymentMethod: 'cash', notes: '(sample data)', createdAt: Date.now() });
  await bumpInvoiceCounter();
  sales.push({ id: uid('sale'), invoiceNo: nextInvoiceNo(), date: Date.now() - 3600000, customerId: customers[2].id,
    items: [{ productId: products[1].id, name: products[1].name, price: 10, qty: 20, taxRate: 0 }],
    subtotal: 200, discount: 0, tax: 0, total: 200, paid: 200, due: 0, paymentMethod: 'upi', notes: '(sample data)', createdAt: Date.now() });
  await bumpInvoiceCounter();
  for (const s of sales) await DB.put('sales', s);
  APP_STATE.sales.push(...sales);

  await saveSettings({ sampleDataLoaded: true });
  showToast(t('savedSuccessfully'), 'success');
  navigate('dashboard');
}

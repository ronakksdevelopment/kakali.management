/* Kakali Enterprise 1.5 — camera QR billing and product QR labels. */
let quickBillCart = [];
let quickBillScanner = null;
let quickBillCamera = 'environment';

function productQrPayload(product) {
  return JSON.stringify({
    app: 'kakali-enterprise', version: '1.5', type: 'product',
    productId: product.id, name: product.name, price: Number(product.sellPrice || 0),
    sku: product.sku || '', image: product.image || '', details: product.qrDetails || ''
  });
}

function decodeProductQr(value) {
  try {
    const data = JSON.parse(value);
    if (data && data.app === 'kakali-enterprise' && data.type === 'product') return data;
  } catch (_) {}
  const product = APP_STATE.products.find(p => p.id === value || p.sku === value);
  return product ? { productId: product.id } : null;
}

function quickBillItem(product) {
  return {
    productId: product.id, name: product.name, price: Number(product.sellPrice || 0),
    qty: 1, image: product.image || '', sku: product.sku || ''
  };
}

function addQuickBillProduct(productId) {
  const product = productById(productId);
  if (!product) { showToast('This QR code is not linked to a product on this device.', 'error'); return; }
  const item = quickBillCart.find(i => i.productId === product.id);
  if (item) item.qty += 1; else quickBillCart.push(quickBillItem(product));
  vibrate(20);
  showToast(`${product.name} added`, 'success');
  renderQuickBill();
}

function quickBillTotal() { return quickBillCart.reduce((total, item) => total + item.price * item.qty, 0); }

function renderQuickBill() {
  stopQuickBillScanner();
  setTimeout(mountQuickBillHandlers, 0);
  return `
    <div class="page-header"><div><h1>Quick Bill</h1><p class="text-muted text-sm">Scan a Kakali product QR or add a product below.</p></div></div>
    <section class="card mb-4" style="overflow:hidden;">
      <div class="p-4" style="background:linear-gradient(135deg,var(--blue-700),var(--blue-500));color:#fff;">
        <div class="flex items-center justify-between"><div><div class="font-semi">QR & barcode scanner</div><div style="font-size:12px;opacity:.85">Place a QR or barcode inside the box</div></div><i class="fa-solid fa-barcode" style="font-size:28px"></i></div>
      </div>
      <div style="padding:16px"><div class="quick-camera-frame"><div id="quickScanner"></div><div class="quick-scan-guide" aria-hidden="true"><span></span><em>Align QR or barcode here</em></div></div><button class="btn btn-primary btn-block mt-3" id="startQuickScan"><i class="fa-solid fa-camera"></i> Start live camera scanner</button><div class="flex gap-2 mt-3"><button class="btn btn-outline btn-block" id="switchQuickCamera"><i class="fa-solid fa-camera-rotate"></i> Front / back</button><button class="btn btn-outline btn-block" id="manualQuickCode"><i class="fa-solid fa-keyboard"></i> Enter code</button></div><div id="quickScannerStatus" class="hint mt-3">Camera access is requested only when you start scanning.</div></div>
    </section>
    <section class="card mb-4" style="padding:16px;">
      <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input id="quickProductSearch" type="search" placeholder="Search and add product"></div>
      <div id="quickProductResults" class="mt-3"></div>
    </section>
    <section class="card">
      <div class="flex items-center justify-between" style="padding:16px 16px 8px"><h3 style="margin:0">Checkout list</h3><button class="btn btn-outline btn-sm" id="clearQuickCart" ${quickBillCart.length ? '' : 'disabled'}>Clear</button></div>
      <div id="quickCartRows">${quickBillCart.length ? quickBillCart.map((item, index) => quickBillRow(item, index)).join('') : `<div class="empty-state" style="padding:24px"><div class="empty-icon"><i class="fa-solid fa-cart-shopping"></i></div><p>Your scanned products will appear here.</p></div>`}</div>
      <div style="padding:16px;border-top:1px solid var(--ink-100)"><div class="flex items-center justify-between mb-3"><span class="font-semi">Subtotal</span><strong style="font-size:22px">${fmtMoney(quickBillTotal())}</strong></div><div class="flex gap-2"><button class="btn btn-outline btn-block" id="quickPrintBtn" ${quickBillCart.length ? '' : 'disabled'}><i class="fa-solid fa-print"></i> Print</button><button class="btn btn-primary btn-block" id="quickCheckoutBtn" ${quickBillCart.length ? '' : 'disabled'}><i class="fa-solid fa-arrow-right"></i> Checkout</button></div></div>
    </section>`;
}

function quickBillRow(item, index) {
  return `<div class="list-row"><div class="row-avatar" style="overflow:hidden;background:var(--blue-50)">${item.image ? `<img src="${escapeHtml(item.image)}" alt="" style="width:100%;height:100%;object-fit:cover">` : '<i class="fa-solid fa-box"></i>'}</div><div class="row-main"><div class="row-title">${escapeHtml(item.name)}</div><div class="row-sub">${fmtMoney(item.price)} each</div></div><div class="row-end" style="min-width:118px"><div class="flex items-center gap-2"><button class="icon-btn quick-qty" data-index="${index}" data-delta="-1" aria-label="Reduce quantity"><i class="fa-solid fa-minus"></i></button><strong>${item.qty}</strong><button class="icon-btn quick-qty" data-index="${index}" data-delta="1" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button><button class="icon-btn quick-remove" data-index="${index}" aria-label="Remove"><i class="fa-solid fa-xmark"></i></button></div><div class="row-amount mt-1">${fmtMoney(item.price * item.qty)}</div></div></div>`;
}

function mountQuickBillHandlers() {
  const start = document.getElementById('startQuickScan'); if (start) start.onclick = startQuickBillScanner;
  const switcher = document.getElementById('switchQuickCamera'); if (switcher) switcher.onclick = async () => { quickBillCamera = quickBillCamera === 'environment' ? 'user' : 'environment'; await startQuickBillScanner(); };
  const manual = document.getElementById('manualQuickCode'); if (manual) manual.onclick = openManualQuickCode;
  document.querySelectorAll('.quick-qty').forEach(b => b.onclick = () => { const item = quickBillCart[+b.dataset.index]; item.qty = Math.max(1, item.qty + (+b.dataset.delta)); renderQuickBill(); });
  document.querySelectorAll('.quick-remove').forEach(b => b.onclick = () => { quickBillCart.splice(+b.dataset.index, 1); renderQuickBill(); });
  const clear = document.getElementById('clearQuickCart'); if (clear) clear.onclick = () => { quickBillCart = []; renderQuickBill(); };
  const print = document.getElementById('quickPrintBtn'); if (print) print.onclick = () => printQuickBill();
  const checkout = document.getElementById('quickCheckoutBtn'); if (checkout) checkout.onclick = openQuickCheckout;
  const search = document.getElementById('quickProductSearch'); if (search) search.oninput = () => renderQuickProductResults(search.value);
}

function renderQuickProductResults(query) {
  const el = document.getElementById('quickProductResults'); if (!el) return;
  const q = query.trim().toLowerCase();
  const list = q ? APP_STATE.products.filter(p => `${p.name} ${p.sku || ''}`.toLowerCase().includes(q)).slice(0, 8) : [];
  el.innerHTML = list.map(p => `<button class="settings-row clickable" data-quick-product="${p.id}" style="width:100%;border:0;background:none;text-align:left"><div class="s-icon"><i class="fa-solid fa-box"></i></div><div class="s-main"><div class="s-title">${escapeHtml(p.name)}</div><div class="s-sub">${fmtMoney(p.sellPrice)} · Stock: ${p.stock || 0}</div></div><i class="fa-solid fa-plus"></i></button>`).join('');
  el.querySelectorAll('[data-quick-product]').forEach(b => b.onclick = () => addQuickBillProduct(b.dataset.quickProduct));
}

async function startQuickBillScanner() {
  const target = document.getElementById('quickScanner'); const status = document.getElementById('quickScannerStatus');
  if (!target || typeof Html5Qrcode === 'undefined') { showToast('Scanner is loading. Please check your internet connection and try again.', 'error'); return; }
  await stopQuickBillScanner(); target.innerHTML = ''; status.textContent = 'Opening camera…';
  quickBillScanner = new Html5Qrcode('quickScanner');
  try {
    const supportedFormats = typeof Html5QrcodeSupportedFormats !== 'undefined' ? [
      Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39, Html5QrcodeSupportedFormats.CODE_93,
      Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.ITF, Html5QrcodeSupportedFormats.CODABAR
    ] : undefined;
    await quickBillScanner.start({ facingMode: quickBillCamera }, { fps: 12, qrbox: { width: 260, height: 180 }, aspectRatio: 1.333, formatsToSupport: supportedFormats }, async text => {
      const data = decodeProductQr(text); if (!data) { showToast('This is not a Kakali product QR code.', 'error'); return; }
      await stopQuickBillScanner(); addQuickBillProduct(data.productId);
    });
    status.textContent = `Scanning with ${quickBillCamera === 'environment' ? 'back' : 'front'} camera.`;
  } catch (error) { quickBillScanner = null; status.textContent = 'Camera could not start. You can enter a product code manually.'; showToast('Camera access was unavailable.', 'error'); }
}

async function stopQuickBillScanner() {
  if (!quickBillScanner) return;
  const scanner = quickBillScanner; quickBillScanner = null;
  try { await scanner.stop(); } catch (_) {}
  try { await scanner.clear(); } catch (_) {}
}

function openManualQuickCode() {
  const overlay = openModal({ title: 'Enter product QR code', bodyHtml: '<div class="field"><label>Product ID or SKU</label><input class="input" id="manualCodeInput" autofocus></div>', footerHtml: '<button class="btn btn-primary btn-block" id="addManualCode">Add to bill</button>' });
  overlay.querySelector('#addManualCode').onclick = () => { const value = overlay.querySelector('#manualCodeInput').value.trim(); const data = decodeProductQr(value); if (!data) { showToast('Product not found.', 'error'); return; } closeModal(); addQuickBillProduct(data.productId); };
}

function openQuickCheckout() {
  const overlay = openModal({ title: 'Complete quick bill', bodyHtml: `<form id="quickCheckoutForm"><div class="field"><label>Customer name <span class="text-muted">(optional)</span></label><input class="input" name="name" placeholder="Walk-in customer"></div><div class="field"><label>WhatsApp number <span class="text-muted">(optional)</span></label><input class="input" name="phone" type="tel" placeholder="Country code + number"></div><div class="field"><label>Payment method</label><select class="input" name="payment"><option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="other">Other</option></select></div><div class="card-flat">Subtotal: <strong>${fmtMoney(quickBillTotal())}</strong></div></form>`, footerHtml: '<button class="btn btn-primary btn-block" id="saveQuickBill">Save bill</button>' });
  overlay.querySelector('#saveQuickBill').onclick = async () => {
    const fd = new FormData(overlay.querySelector('#quickCheckoutForm')); const total = quickBillTotal();
    const sale = { id: uid('sale'), invoiceNo: nextInvoiceNo(), date: Date.now(), customerId: null, items: quickBillCart.map(i => ({ productId:i.productId,name:i.name,price:i.price,qty:i.qty,taxRate:0 })), subtotal:total, discount:0, tax:0, total, paid:total, due:0, paymentMethod:fd.get('payment'), notes:'Quick Bill', createdAt:Date.now() };
    await DB.put('sales', sale); APP_STATE.sales.push(sale); await bumpInvoiceCounter();
    for (const item of quickBillCart) await adjustStock(item.productId, -item.qty, 'quick-bill', sale.id);
    const name = fd.get('name').trim(), phone = fd.get('phone').trim(); closeModal();
    if (phone) shareQuickBillWhatsapp(sale, name || 'Customer', phone);
    showToast('Quick bill saved.', 'success'); quickBillCart = []; navigate('sales/view', { id: sale.id });
  };
}

function quickBillText() { return quickBillCart.map(i => `${i.name} × ${i.qty} — ${fmtMoney(i.price * i.qty)}`).join('\n'); }
function printQuickBill() { const original = document.body.innerHTML; const receipt = `<main style="font-family:Arial;padding:24px;max-width:420px"><h2>${escapeHtml(APP_STATE.settings.businessName || 'Kakali Enterprise')}</h2><h3>Quick Bill</h3><pre style="white-space:pre-wrap;font:inherit">${escapeHtml(quickBillText())}</pre><hr><h2>Subtotal: ${fmtMoney(quickBillTotal())}</h2></main>`; document.body.innerHTML = receipt; window.print(); document.body.innerHTML = original; location.reload(); }
function shareQuickBillWhatsapp(sale, name, phone) { const text = `Hello ${name},\n${APP_STATE.settings.businessName || 'Kakali Enterprise'} bill ${sale.invoiceNo}\n${sale.items.map(i => `${i.name} × ${i.qty} — ${fmtMoney(i.price * i.qty)}`).join('\n')}\nTotal: ${fmtMoney(sale.total)}\nThank you.`; window.open(waLink(phone, text), '_blank'); }

function openProductQrModal(product) {
  actionSheet([
    { icon: 'fa-qrcode', label: 'Generate QR code', bg: 'var(--blue-100)', color: 'var(--blue-700)', onClick: () => openProductCodeLabel(product, 'qr') },
    { icon: 'fa-barcode', label: 'Generate barcode', bg: 'var(--gold-100)', color: 'var(--gold-700)', onClick: () => openProductCodeLabel(product, 'barcode') },
  ]);
}

function openProductCodeLabel(product, kind) {
  if (kind === 'qr' && typeof QRCode === 'undefined') { showToast('QR generator is loading. Please try again shortly.', 'error'); return; }
  if (kind === 'barcode' && typeof JsBarcode === 'undefined') { showToast('Barcode generator is loading. Please try again shortly.', 'error'); return; }
  const isQr = kind === 'qr';
  const overlay = openModal({ title: isQr ? 'Product QR label' : 'Product barcode label', bodyHtml: `<div class="text-center"><p class="text-muted">${escapeHtml(product.name)}</p><div id="productQrCanvas" style="display:inline-block;padding:12px;background:white"></div><p class="hint mt-3">${isQr ? 'QR includes the product details and adds it to Quick Bill.' : 'Barcode uses the product SKU or internal product ID and adds it to Quick Bill.'}</p></div>`, footerHtml: `<button class="btn btn-outline" id="downloadProductQr"><i class="fa-solid fa-download"></i> Download PNG</button>` });
  const holder = overlay.querySelector('#productQrCanvas');
  if (isQr) {
    new QRCode(holder, { text: productQrPayload(product), width: 280, height: 280, correctLevel: QRCode.CorrectLevel.H });
    setTimeout(() => { const canvas = holder.querySelector('canvas'); if (!canvas) return; const ctx = canvas.getContext('2d'); const logo = new Image(); logo.onload = () => { const size = 48, x = (canvas.width-size)/2, y=(canvas.height-size)/2; ctx.fillStyle='white'; ctx.fillRect(x-5,y-5,size+10,size+10); ctx.drawImage(logo,x,y,size,size); }; logo.src='assets/logo.png'; }, 100);
  } else {
    holder.innerHTML = '<canvas id="productBarcodeCanvas"></canvas>';
    JsBarcode(holder.querySelector('canvas'), product.sku || product.id, { format: 'CODE128', width: 2, height: 105, displayValue: true, fontSize: 15, margin: 8 });
  }
  overlay.querySelector('#downloadProductQr').onclick = () => { const canvas = holder.querySelector('canvas'); if (!canvas) return; const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download=`${(product.sku || product.name || 'product').replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-${isQr ? 'qr' : 'barcode'}.png`; a.click(); };
}

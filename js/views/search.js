/* ============================================================
   SEARCH.JS — global search across products, customers, suppliers, sales, expenses
   ============================================================ */

function renderSearch() {
  setTimeout(() => {
    const input = document.getElementById('globalSearchInput');
    input.focus();
    input.oninput = debounce((e) => {
      document.getElementById('searchResults').innerHTML = globalSearchResultsHtml(e.target.value);
    }, 200);
  }, 0);

  return `
    <div class="page-header">
      <div class="flex items-center gap-3">
        <button class="icon-btn" onclick="navigate('dashboard')"><i class="fa-solid fa-arrow-left"></i></button>
        <h1>${t('search')}</h1>
      </div>
    </div>
    <div class="search-box mb-4">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="search" id="globalSearchInput" placeholder="${t('search')} ${t('product')}, ${t('customer')}, ${t('supplier')}...">
    </div>
    <div id="searchResults">${globalSearchResultsHtml('')}</div>
  `;
}

function globalSearchResultsHtml(q) {
  if (!q || q.trim().length < 1) {
    return `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div><p>Search products, customers, suppliers, sales, and expenses.</p></div>`;
  }
  const query = q.toLowerCase();
  const products = APP_STATE.products.filter(p => (p.name || '').toLowerCase().includes(query) || (p.sku || '').toLowerCase().includes(query));
  const customers = APP_STATE.customers.filter(c => (c.name || '').toLowerCase().includes(query) || (c.phone || '').includes(query));
  const suppliers = APP_STATE.suppliers.filter(s => (s.name || '').toLowerCase().includes(query) || (s.phone || '').includes(query));
  const sales = APP_STATE.sales.filter(s => (s.invoiceNo || '').toLowerCase().includes(query));
  const expenses = APP_STATE.expenses.filter(e => (e.description || '').toLowerCase().includes(query) || (e.category || '').toLowerCase().includes(query));

  const total = products.length + customers.length + suppliers.length + sales.length + expenses.length;
  if (total === 0) return `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div><h3>${t('noResultsFound')}</h3></div>`;

  let html = '';
  if (customers.length) html += searchSection(t('customers'), customers.map(c => customerRowHtml(c)));
  if (suppliers.length) html += searchSection(t('suppliers'), suppliers.map(s => supplierRowHtml(s)));
  if (products.length) html += searchSection(t('products'), products.map(p => productRowHtml(p)));
  if (sales.length) html += searchSection(t('sales'), sales.map(s => saleRowHtml(s)));
  if (expenses.length) html += searchSection(t('expenses'), expenses.map(e => expenseRowHtml(e)));
  return html;
}

function searchSection(label, rowsHtml) {
  return `<div class="section-title">${label}</div><div class="card mb-4">${rowsHtml.join('')}</div>`;
}

/* ============================================================
   ROUTER.JS — simple hash-based router + shell rendering
   ============================================================ */

const ROUTES = {
  dashboard: () => renderDashboard(),
  sales: () => renderSalesList(),
  'sales/new': () => renderSaleForm(),
  'sales/view': (p) => renderSaleDetail(p.id),
  'quick-bill': () => renderQuickBill(),
  products: () => renderProductsList(),
  purchases: () => renderPurchasesList(),
  'purchases/new': () => renderPurchaseForm(),
  customers: () => renderCustomersList(),
  'customers/view': (p) => renderCustomerDetail(p.id),
  suppliers: () => renderSuppliersList(),
  'suppliers/view': (p) => renderSupplierDetail(p.id),
  khata: () => renderKhata(),
  expenses: () => renderExpensesList(),
  income: () => renderIncomeList(),
  reports: () => renderReports(),
  reminders: () => renderReminders(),
  settings: () => renderSettings(),
  search: () => renderSearch(),
  more: () => renderMore(),
};

const BOTTOM_NAV_ITEMS = [
  { key: 'dashboard', icon: 'fa-house', label: 'dashboard' },
  { key: 'sales', icon: 'fa-cart-shopping', label: 'sales' },
  { key: 'products', icon: 'fa-box', label: 'products' },
  { key: 'khata', icon: 'fa-book', label: 'khata' },
  { key: 'more', icon: 'fa-grip', label: 'more' },
];

const SIDEBAR_SECTIONS = [
  { items: [
    { key: 'dashboard', icon: 'fa-house', label: 'dashboard' },
  ]},
  { label: 'Business', items: [
    { key: 'quick-bill', icon: 'fa-qrcode', label: 'Quick Bill' },
    { key: 'sales', icon: 'fa-cart-shopping', label: 'sales' },
    { key: 'purchases', icon: 'fa-truck', label: 'purchases' },
    { key: 'products', icon: 'fa-box', label: 'products' },
    { key: 'customers', icon: 'fa-users', label: 'customers' },
    { key: 'suppliers', icon: 'fa-truck-field', label: 'suppliers' },
  ]},
  { label: 'Money', items: [
    { key: 'khata', icon: 'fa-book', label: 'khata' },
    { key: 'expenses', icon: 'fa-money-bill-wave', label: 'expenses' },
    { key: 'income', icon: 'fa-arrow-trend-up', label: 'income' },
    { key: 'reports', icon: 'fa-chart-line', label: 'reports' },
  ]},
  { label: 'Tools', items: [
    { key: 'reminders', icon: 'fa-bell', label: 'reminders' },
    { key: 'search', icon: 'fa-magnifying-glass', label: 'search' },
    { key: 'settings', icon: 'fa-gear', label: 'settings' },
  ]},
];

function baseKey(route) { return route.split('/')[0]; }

function navigate(route, params = {}) {
  APP_STATE.route = route;
  APP_STATE.routeParams = params;
  location.hash = '#' + route + (params.id ? '/' + params.id : '');
  renderShellNav();
  renderView();
  window.scrollTo(0, 0);
}

function parseHash() {
  const hash = location.hash.replace(/^#/, '');
  if (!hash) return { route: 'dashboard', params: {} };
  const parts = hash.split('/');
  if (['sales', 'customers', 'suppliers'].includes(parts[0]) && parts[1] === 'view') {
    return { route: `${parts[0]}/view`, params: { id: parts[2] } };
  }
  if (parts[1] === 'new') return { route: `${parts[0]}/new`, params: {} };
  const twoPartRoute = parts.slice(0, 2).join('/');
  return { route: ROUTES[twoPartRoute] ? twoPartRoute : parts[0], params: {} };
}

function renderView() {
  const view = document.getElementById('view');
  const handler = ROUTES[APP_STATE.route] || ROUTES.dashboard;
  try {
    view.innerHTML = '';
    const content = handler(APP_STATE.routeParams) || '';
    if (typeof content === 'string') view.innerHTML = content;
    view.classList.remove('fade-in'); void view.offsetWidth; view.classList.add('fade-in');
  } catch (err) {
    console.error(err);
    view.innerHTML = `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><h3>${t('somethingWrong')}</h3></div>`;
  }
}

function renderShellNav() {
  const bn = document.getElementById('bottomNav');
  const active = baseKey(APP_STATE.route);
  if (bn) {
    bn.innerHTML = BOTTOM_NAV_ITEMS.map(it => `
      <button class="bn-item ${active === it.key ? 'active' : ''}" data-nav="${it.key}">
        <i class="fa-solid ${it.icon}"></i>
        <span>${t(it.label)}</span>
      </button>
    `).join('');
    bn.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => navigate(b.dataset.nav));
  }
  const sb = document.getElementById('sidebar');
  if (sb) {
    sb.innerHTML = `
      <div style="padding:0 10px 14px;">
        <button class="btn btn-primary btn-block" id="sbNewSale"><i class="fa-solid fa-plus"></i> ${t('newSale')}</button>
      </div>
      ${SIDEBAR_SECTIONS.map(sec => `
        ${sec.label ? `<div class="side-section-label">${sec.label}</div>` : ''}
        ${sec.items.map(it => `
          <a class="side-link ${active === it.key ? 'active' : ''}" data-nav="${it.key}">
            <i class="fa-solid ${it.icon}"></i> ${t(it.label)}
          </a>
        `).join('')}
      `).join('')}
    `;
    sb.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => navigate(b.dataset.nav));
    sb.querySelector('#sbNewSale').onclick = () => navigate('sales/new');
  }
  document.querySelectorAll('.fab').forEach(f => f.onclick = () => openQuickActionSheet());
}

function renderMore() {
  const items = [
    { key: 'quick-bill', icon: 'fa-qrcode', label: 'Quick Bill' },
    { key: 'purchases', icon: 'fa-truck', label: 'purchases' },
    { key: 'customers', icon: 'fa-users', label: 'customers' },
    { key: 'suppliers', icon: 'fa-truck-field', label: 'suppliers' },
    { key: 'expenses', icon: 'fa-money-bill-wave', label: 'expenses' },
    { key: 'income', icon: 'fa-arrow-trend-up', label: 'income' },
    { key: 'reports', icon: 'fa-chart-line', label: 'reports' },
    { key: 'reminders', icon: 'fa-bell', label: 'reminders' },
    { key: 'search', icon: 'fa-magnifying-glass', label: 'search' },
    { key: 'settings', icon: 'fa-gear', label: 'settings' },
  ];
  setTimeout(() => {
    document.querySelectorAll('[data-more-nav]').forEach(b => b.onclick = () => navigate(b.dataset.moreNav));
  });
  return `
    <div class="page-header"><h1>${t('more')}</h1></div>
    <div class="section-card">
      ${items.map(it => `
        <div class="settings-row clickable" data-more-nav="${it.key}">
          <div class="s-icon"><i class="fa-solid ${it.icon}"></i></div>
          <div class="s-main"><div class="s-title">${t(it.label)}</div></div>
          <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
      `).join('')}
    </div>
  `;
}

function openQuickActionSheet() {
  actionSheet([
    { icon: 'fa-qrcode', label: 'Quick Bill', bg: 'var(--blue-100)', color: 'var(--blue-700)', onClick: () => navigate('quick-bill') },
    { icon: 'fa-bolt', label: t('quickSell'), bg: 'var(--gold-100)', color: 'var(--gold-700)', onClick: () => openQuickSellModal() },
    { icon: 'fa-cart-shopping', label: t('sale'), bg: 'var(--blue-100)', color: 'var(--blue-700)', onClick: () => navigate('sales/new') },
    { icon: 'fa-money-bill-wave', label: t('expense'), bg: 'var(--red-100)', color: 'var(--red-700)', onClick: () => openExpenseModal() },
    { icon: 'fa-arrow-trend-up', label: t('income'), bg: 'var(--green-100)', color: 'var(--green-700)', onClick: () => openIncomeModal() },
    { icon: 'fa-hand-holding-dollar', label: t('paymentReceived'), bg: 'var(--green-100)', color: 'var(--green-700)', onClick: () => openLedgerModal('receive') },
    { icon: 'fa-money-bill-transfer', label: t('paymentGiven'), bg: 'var(--orange-100)', color: 'var(--orange-700)', onClick: () => openLedgerModal('give') },
    { icon: 'fa-user-plus', label: t('customer'), bg: 'var(--blue-100)', color: 'var(--blue-700)', onClick: () => openCustomerModal() },
    { icon: 'fa-box', label: t('product'), bg: 'var(--gold-100)', color: 'var(--gold-700)', onClick: () => openProductModal() },
    { icon: 'fa-truck', label: t('purchase'), bg: 'var(--blue-100)', color: 'var(--blue-700)', onClick: () => navigate('purchases/new') },
  ]);
}

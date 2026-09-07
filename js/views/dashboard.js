/* ============================================================
   DASHBOARD.JS
   ============================================================ */

function renderDashboard() {
  const stats = todayStats();
  const yStats = yesterdayStats();
  const custDue = totalCustomerDue();
  const suppDue = totalSupplierDue();
  const low = lowStockProducts();
  const top = topProductsToday();
  const bizName = APP_STATE.settings.businessName || t('appName');

  setTimeout(() => mountDashboardHandlers(), 0);

  return `
    <div class="page-header">
      <div>
        <div class="text-muted text-sm font-semi">${fmtDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h1>${escapeHtml(bizName)}</h1>
      </div>
      <button class="icon-btn" id="dashSearchBtn"><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>

    <div class="section-title">${t('today')}</div>
    <div class="stats-grid cols-4 mb-4">
      <div class="stat-card tone-blue">
        <div class="stat-icon"><i class="fa-solid fa-cart-shopping"></i></div>
        <div class="stat-label">${t('salesLabel')}</div>
        <div class="stat-value">${fmtMoney(stats.sales)}</div>
      </div>
      <div class="stat-card tone-green">
        <div class="stat-icon"><i class="fa-solid fa-wallet"></i></div>
        <div class="stat-label">${t('received')}</div>
        <div class="stat-value">${fmtMoney(stats.received)}</div>
      </div>
      <div class="stat-card tone-red">
        <div class="stat-icon"><i class="fa-solid fa-hand-holding-dollar"></i></div>
        <div class="stat-label">${t('customerDue')}</div>
        <div class="stat-value">${fmtMoney(stats.due)}</div>
      </div>
      <div class="stat-card tone-orange">
        <div class="stat-icon"><i class="fa-solid fa-money-bill-wave"></i></div>
        <div class="stat-label">${t('expenses')}</div>
        <div class="stat-value">${fmtMoney(stats.expenses)}</div>
      </div>
    </div>

    <div class="stat-card tone-gold mb-5">
      <div class="stat-icon"><i class="fa-solid fa-scale-balanced"></i></div>
      <div class="stat-label">${t('net')}</div>
      <div class="stat-value">${fmtMoney(stats.net)}</div>
      <div class="stat-sub">${t('received')} − ${t('expenses')}</div>
    </div>

    <div class="section-title">${t('quickActions')}</div>
    <div class="quick-actions mb-5">
      ${qaItem('fa-bolt', t('quickSell'), 'var(--gold-700)', "openQuickSellModal()")}
      ${qaItem('fa-cart-shopping', t('sale'), 'var(--blue-700)', "navigate('sales/new')")}
      ${qaItem('fa-money-bill-wave', t('expense'), 'var(--red-500)', "openExpenseModal()")}
      ${qaItem('fa-arrow-trend-up', t('income'), 'var(--green-600)', "openIncomeModal()")}
      ${qaItem('fa-hand-holding-dollar', t('paymentReceived'), 'var(--green-600)', "openLedgerModal('receive')")}
      ${qaItem('fa-money-bill-transfer', t('paymentGiven'), 'var(--orange-500)', "openLedgerModal('give')")}
      ${qaItem('fa-user-plus', t('customer'), 'var(--blue-500)', "openCustomerModal()")}
      ${qaItem('fa-box', t('product'), 'var(--gold-600)', "openProductModal()")}
      ${qaItem('fa-truck', t('purchase'), 'var(--blue-800)', "navigate('purchases/new')")}
    </div>

    <div class="section-title">${t('insights')}</div>
    <div class="card mb-5">
      ${renderInsights(stats, yStats, custDue, suppDue, low, top)}
    </div>

    ${low.length ? `
    <div class="flex items-center justify-between mb-3">
      <div class="section-title" style="margin-bottom:0;">${t('lowStockItems')}</div>
      <a class="text-sm font-semi" style="color:var(--blue-700)" data-nav="products">${t('products')} →</a>
    </div>
    <div class="card mb-5">
      ${low.slice(0, 5).map(p => `
        <div class="list-row">
          <div class="row-avatar" style="background:var(--red-100);color:var(--red-700);"><i class="fa-solid fa-box"></i></div>
          <div class="row-main">
            <div class="row-title">${escapeHtml(p.name)}</div>
            <div class="row-sub">${t('currentStock')}: ${p.stock} ${t(p.unit) || p.unit}</div>
          </div>
          <div class="row-end"><span class="badge badge-red">${t('lowStock')}</span></div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="flex items-center justify-between mb-3">
      <div class="section-title" style="margin-bottom:0;">${t('sales')}</div>
      <a class="text-sm font-semi" style="color:var(--blue-700)" data-nav="sales">${t('sales')} →</a>
    </div>
    <div class="card">
      ${renderRecentSales()}
    </div>
  `;
}

function qaItem(icon, label, color, onclick) {
  return `<button class="qa-item" onclick="${onclick}">
    <div class="qa-icon" style="background:${color}"><i class="fa-solid ${icon}"></i></div>
    <div class="qa-label">${label}</div>
  </button>`;
}

function renderInsights(stats, yStats, custDue, suppDue, low, top) {
  const insights = [];
  if (yStats.sales > 0) {
    const change = ((stats.sales - yStats.sales) / yStats.sales) * 100;
    if (Math.abs(change) >= 1) {
      const key = change >= 0 ? 'insightSalesHigher' : 'insightSalesLower';
      insights.push({
        icon: change >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down',
        color: change >= 0 ? 'var(--green-600)' : 'var(--red-600)',
        text: t(key).replace('{pct}', Math.abs(change).toFixed(0)),
      });
    }
  }
  if (low.length) {
    const key = low.length > 1 ? 'insightLowStockPlural' : 'insightLowStockSingle';
    insights.push({ icon: 'fa-box', color: 'var(--red-600)', text: t(key).replace('{n}', low.length) });
  }
  if (custDue > 0) {
    insights.push({ icon: 'fa-hand-holding-dollar', color: 'var(--orange-600)', text: t('insightCustomerDue').replace('{amount}', fmtMoney(custDue)) });
  }
  if (suppDue > 0) {
    insights.push({ icon: 'fa-truck', color: 'var(--blue-700)', text: t('insightSupplierDue').replace('{amount}', fmtMoney(suppDue)) });
  }
  if (top.length) {
    insights.push({ icon: 'fa-star', color: 'var(--gold-600)', text: t('insightTopProduct').replace('{name}', escapeHtml(top[0].product.name)) });
  }
  const avgExp = avgDailyExpense(30);
  if (avgExp > 0 && stats.expenses > avgExp * 1.3) {
    insights.push({ icon: 'fa-circle-exclamation', color: 'var(--orange-600)', text: t('insightHighExpense') });
  }

  if (!insights.length) {
    return `<div class="empty-state" style="padding:var(--sp-5) var(--sp-3);">
      <div class="empty-icon"><i class="fa-solid fa-chart-line"></i></div>
      <p style="margin-bottom:0;">${t('noInsightsYet')}</p>
    </div>`;
  }
  return insights.map(i => `
    <div class="list-row">
      <div class="row-avatar" style="background:var(--ink-100);color:${i.color};"><i class="fa-solid ${i.icon}"></i></div>
      <div class="row-main"><div class="row-title" style="font-weight:600;font-size:var(--fs-sm);">${i.text}</div></div>
    </div>
  `).join('');
}

function renderRecentSales() {
  const recent = [...APP_STATE.sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  if (!recent.length) {
    return `<div class="empty-state">
      <div class="empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
      <h3>${t('noSalesYet')}</h3>
      <p>${t('recordFirstSale')}</p>
      <button class="btn btn-primary" onclick="navigate('sales/new')"><i class="fa-solid fa-plus"></i> ${t('newSale')}</button>
    </div>`;
  }
  return recent.map(s => saleRowHtml(s)).join('');
}

function saleRowHtml(s) {
  const cust = s.customerId ? customerById(s.customerId) : null;
  const name = cust ? cust.name : t('walkInCustomer');
  const statusBadge = s.due > 0 ? `<span class="badge badge-red">${t('due')}</span>` : `<span class="badge badge-green">${t('paid')}</span>`;
  return `
    <div class="list-row clickable" onclick="navigate('sales/view',{id:'${s.id}'})">
      <div class="row-avatar">${initials(name)}</div>
      <div class="row-main">
        <div class="row-title">${escapeHtml(name)}</div>
        <div class="row-sub">${s.invoiceNo} · ${fmtDate(s.date)}</div>
      </div>
      <div class="row-end">
        <div class="row-amount">${fmtMoney(s.total)}</div>
        ${statusBadge}
      </div>
    </div>
  `;
}

function mountDashboardHandlers() {
  document.querySelectorAll('[data-nav]').forEach(el => { if (!el.onclick) el.onclick = () => navigate(el.dataset.nav); });
  const sb = document.getElementById('dashSearchBtn');
  if (sb) sb.onclick = () => navigate('search');
}

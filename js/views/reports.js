/* ============================================================
   REPORTS.JS
   ============================================================ */

let reportRange = 'today';

function renderReports() {
  setTimeout(() => {
    document.querySelectorAll('#reportTabs [data-r]').forEach(b => b.onclick = () => { reportRange = b.dataset.r; renderView(); });
    const exportBtn = document.getElementById('exportReportBtn');
    if (exportBtn) exportBtn.onclick = () => exportReportCsv(range);
  }, 0);

  let from, to, label;
  const now = new Date();
  if (reportRange === 'today') { from = startOfDay(now); to = endOfDay(now); label = t('today'); }
  else if (reportRange === 'week') { from = startOfWeek(now); to = endOfDay(now); label = t('thisWeek'); }
  else if (reportRange === 'month') { from = startOfMonth(now); to = endOfDay(now); label = t('thisMonth'); }
  else { from = daysAgo(30); to = endOfDay(now); label = t('customRange'); }
  const range = { from, to };

  const sales = salesInRange(from, to);
  const exps = expensesInRange(from, to);
  const incs = incomesInRange(from, to);
  const purs = purchasesInRange(from, to);

  const totalSales = sumSales(sales);
  const totalReceived = sumReceived(sales) + sumIncomes(incs);
  const totalExp = sumExpenses(exps);
  const totalDue = sumDue(sales);
  const profit = estimateProfit(sales);

  const productMap = {};
  sales.forEach(s => (s.items || []).forEach(it => { productMap[it.productId] = (productMap[it.productId] || 0) + it.qty; }));
  const topProds = Object.entries(productMap).map(([pid, qty]) => ({ product: productById(pid), qty })).filter(x => x.product).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const low = lowStockProducts();

  return `
    <div class="page-header"><h1>${t('reports')}</h1></div>
    <div class="tabs mb-4" id="reportTabs">
      <button class="tab-btn ${reportRange === 'today' ? 'active' : ''}" data-r="today">${t('dailyReport')}</button>
      <button class="tab-btn ${reportRange === 'week' ? 'active' : ''}" data-r="week">${t('weeklyReport')}</button>
      <button class="tab-btn ${reportRange === 'month' ? 'active' : ''}" data-r="month">${t('monthlyReport')}</button>
    </div>

    <div class="stats-grid mb-4">
      <div class="stat-card tone-blue"><div class="stat-icon"><i class="fa-solid fa-cart-shopping"></i></div><div class="stat-label">${t('salesLabel')}</div><div class="stat-value">${fmtMoney(totalSales)}</div></div>
      <div class="stat-card tone-green"><div class="stat-icon"><i class="fa-solid fa-wallet"></i></div><div class="stat-label">${t('received')}</div><div class="stat-value">${fmtMoney(totalReceived)}</div></div>
      <div class="stat-card tone-red"><div class="stat-icon"><i class="fa-solid fa-money-bill-wave"></i></div><div class="stat-label">${t('expenses')}</div><div class="stat-value">${fmtMoney(totalExp)}</div></div>
      <div class="stat-card tone-orange"><div class="stat-icon"><i class="fa-solid fa-hand-holding-dollar"></i></div><div class="stat-label">${t('due')}</div><div class="stat-value">${fmtMoney(totalDue)}</div></div>
      <div class="stat-card tone-gold"><div class="stat-icon"><i class="fa-solid fa-chart-line"></i></div><div class="stat-label">${t('profitEst')}</div><div class="stat-value">${fmtMoney(profit)}</div></div>
    </div>

    <div class="section-title">${t('topProducts')} — ${label}</div>
    <div class="card mb-5">
      ${topProds.length === 0 ? `<div class="empty-state" style="padding:24px;"><p>${t('noInsightsYet')}</p></div>` : topProds.map(tp => `
        <div class="list-row">
          <div class="row-avatar" style="background:var(--gold-100);color:var(--gold-700);"><i class="fa-solid fa-box"></i></div>
          <div class="row-main"><div class="row-title">${escapeHtml(tp.product.name)}</div></div>
          <div class="row-end"><div class="row-amount">${tp.qty} ${t(tp.product.unit) || ''}</div></div>
        </div>
      `).join('')}
    </div>

    <div class="section-title">${t('lowStockItems')}</div>
    <div class="card mb-5">
      ${low.length === 0 ? `<div class="empty-state" style="padding:24px;"><p>All stock levels look healthy.</p></div>` : low.map(p => `
        <div class="list-row">
          <div class="row-avatar" style="background:var(--red-100);color:var(--red-700);"><i class="fa-solid fa-box"></i></div>
          <div class="row-main"><div class="row-title">${escapeHtml(p.name)}</div><div class="row-sub">${t('currentStock')}: ${p.stock}</div></div>
          <div class="row-end"><span class="badge badge-red">${t('lowStock')}</span></div>
        </div>
      `).join('')}
    </div>

    <div class="section-title">${t('transactionSummary')}</div>
    <div class="card-flat">
      <div class="flex justify-between mb-2 text-sm"><span class="text-muted">${t('sales')}</span><span class="font-bold">${sales.length}</span></div>
      <div class="flex justify-between mb-2 text-sm"><span class="text-muted">${t('purchases')}</span><span class="font-bold">${purs.length}</span></div>
      <div class="flex justify-between mb-2 text-sm"><span class="text-muted">${t('expenses')}</span><span class="font-bold">${exps.length}</span></div>
      <div class="flex justify-between text-sm"><span class="text-muted">${t('income')}</span><span class="font-bold">${incs.length}</span></div>
    </div>

    <button class="btn btn-outline btn-block mt-4" id="exportReportBtn"><i class="fa-solid fa-download"></i> ${t('exportCsv')}</button>
  `;
}

function exportReportCsv() {
  const rows = APP_STATE.sales.map(s => ({
    invoice: s.invoiceNo, date: fmtDate(s.date), customer: s.customerId ? (customerById(s.customerId) || {}).name : t('walkInCustomer'),
    total: s.total, paid: s.paid, due: s.due, paymentMethod: s.paymentMethod,
  }));
  if (!rows.length) { showToast(t('noResultsFound')); return; }
  download('sales-report.csv', toCSV(rows), 'text/csv');
}

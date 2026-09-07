/* ============================================================
   STATE.JS — in-memory cache of DB data + business calculations
   ============================================================ */

const APP_STATE = {
  settings: null,
  products: [],
  customers: [],
  suppliers: [],
  sales: [],
  purchases: [],
  expenses: [],
  incomes: [],
  ledger: [],
  reminders: [],
  stockLog: [],
  route: 'dashboard',
  routeParams: {},
};

const DEFAULT_SETTINGS = {
  key: 'app',
  onboarded: false,
  businessName: '',
  ownerName: '',
  phone: '',
  address: '',
  gstNo: '',
  isGst: false,
  currency: 'INR',
  language: 'en',
  theme: 'light',
  pinEnabled: false,
  pinHash: '',
  lowStockDefault: 5,
  invoicePrefix: 'INV',
  invoiceCounter: 1000,
  whatsappTemplates: {
    dueReminder: "Hello {name}, this is a friendly reminder from {business}. Your pending amount is {amount}. Thank you.",
    billShare: "Thank you for shopping with {business}. Your bill total is {total}. Paid {paid}. Due {due}.",
    paymentReminder: "Your pending balance with {business} is {amount}.",
  },
  sampleDataLoaded: false,
};

async function loadAllState() {
  let settings = await DB.get('settings', 'app');
  if (!settings) {
    settings = { ...DEFAULT_SETTINGS };
    await DB.put('settings', settings);
  } else {
    settings = { ...DEFAULT_SETTINGS, ...settings, whatsappTemplates: { ...DEFAULT_SETTINGS.whatsappTemplates, ...(settings.whatsappTemplates || {}) } };
  }
  APP_STATE.settings = settings;
  setLang(settings.language);

  const [products, customers, suppliers, sales, purchases, expenses, incomes, ledger, reminders, stockLog] = await Promise.all([
    DB.getAll('products'), DB.getAll('customers'), DB.getAll('suppliers'),
    DB.getAll('sales'), DB.getAll('purchases'), DB.getAll('expenses'),
    DB.getAll('incomes'), DB.getAll('ledger'), DB.getAll('reminders'), DB.getAll('stockLog'),
  ]);
  Object.assign(APP_STATE, { products, customers, suppliers, sales, purchases, expenses, incomes, ledger, reminders, stockLog });
  applyTheme();
}

async function saveSettings(patch) {
  APP_STATE.settings = { ...APP_STATE.settings, ...patch };
  await DB.put('settings', APP_STATE.settings);
  if (patch.language) setLang(patch.language);
  if (patch.theme) applyTheme();
}

function applyTheme() {
  const theme = APP_STATE.settings && APP_STATE.settings.theme;
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
}

function nextInvoiceNo() {
  const n = APP_STATE.settings.invoiceCounter || 1000;
  return `${APP_STATE.settings.invoicePrefix || 'INV'}-${n}`;
}
async function bumpInvoiceCounter() {
  await saveSettings({ invoiceCounter: (APP_STATE.settings.invoiceCounter || 1000) + 1 });
}

/* ============================================================
   DERIVED BUSINESS CALCULATIONS
   ============================================================ */

function productById(id) { return APP_STATE.products.find(p => p.id === id); }
function customerById(id) { return APP_STATE.customers.find(c => c.id === id); }
function supplierById(id) { return APP_STATE.suppliers.find(s => s.id === id); }

// Customer balance: positive = customer owes us (due), based on sales dues minus ledger receives, plus ledger "give" (rare - advance)
function customerBalance(customerId) {
  let bal = 0;
  APP_STATE.sales.filter(s => s.customerId === customerId).forEach(s => { bal += (s.due || 0); });
  APP_STATE.ledger.filter(l => l.personType === 'customer' && l.personId === customerId).forEach(l => {
    if (l.type === 'receive') bal -= l.amount;
    if (l.type === 'give') bal += l.amount;
  });
  return Math.round(bal * 100) / 100;
}

function supplierBalance(supplierId) {
  let bal = 0;
  APP_STATE.purchases.filter(p => p.supplierId === supplierId).forEach(p => { bal += (p.due || 0); });
  APP_STATE.ledger.filter(l => l.personType === 'supplier' && l.personId === supplierId).forEach(l => {
    if (l.type === 'give') bal -= l.amount;
    if (l.type === 'receive') bal += l.amount;
  });
  return Math.round(bal * 100) / 100;
}

function totalCustomerDue() {
  return APP_STATE.customers.reduce((sum, c) => sum + Math.max(0, customerBalance(c.id)), 0);
}
function totalSupplierDue() {
  return APP_STATE.suppliers.reduce((sum, s) => sum + Math.max(0, supplierBalance(s.id)), 0);
}

function salesInRange(from, to) {
  return APP_STATE.sales.filter(s => { const d = new Date(s.date); return d >= from && d <= to; });
}
function expensesInRange(from, to) {
  return APP_STATE.expenses.filter(e => { const d = new Date(e.date); return d >= from && d <= to; });
}
function incomesInRange(from, to) {
  return APP_STATE.incomes.filter(i => { const d = new Date(i.date); return d >= from && d <= to; });
}
function purchasesInRange(from, to) {
  return APP_STATE.purchases.filter(p => { const d = new Date(p.date); return d >= from && d <= to; });
}

function sumSales(sales) { return sales.reduce((s, x) => s + (x.total || 0), 0); }
function sumReceived(sales) { return sales.reduce((s, x) => s + (x.paid || 0), 0); }
function sumDue(sales) { return sales.reduce((s, x) => s + (x.due || 0), 0); }
function sumExpenses(exps) { return exps.reduce((s, x) => s + (x.amount || 0), 0); }
function sumIncomes(incs) { return incs.reduce((s, x) => s + (x.amount || 0), 0); }

function estimateProfit(sales) {
  let profit = 0;
  sales.forEach(s => {
    (s.items || []).forEach(it => {
      const p = productById(it.productId);
      const cost = p ? (p.purchasePrice || 0) : (it.cost || 0);
      profit += (it.price - cost) * it.qty;
    });
    profit -= (s.discount || 0);
  });
  return profit;
}

function lowStockProducts() {
  return APP_STATE.products.filter(p => (p.stock ?? 0) <= (p.minStock ?? APP_STATE.settings.lowStockDefault ?? 5));
}

function todayStats() {
  const from = startOfDay(new Date()), to = endOfDay(new Date());
  const ySales = salesInRange(from, to);
  const yExp = expensesInRange(from, to);
  const yInc = incomesInRange(from, to);
  const sales = sumSales(ySales);
  const received = sumReceived(ySales) + sumIncomes(yInc);
  const expenses = sumExpenses(yExp);
  const due = sumDue(ySales);
  return { sales, received, due, expenses, net: received - expenses };
}

function yesterdayStats() {
  const y = daysAgo(1);
  const from = startOfDay(y), to = endOfDay(y);
  const ySales = salesInRange(from, to);
  return { sales: sumSales(ySales) };
}

function topProductsToday() {
  const from = startOfDay(new Date()), to = endOfDay(new Date());
  const sales = salesInRange(from, to);
  const map = {};
  sales.forEach(s => (s.items || []).forEach(it => {
    map[it.productId] = (map[it.productId] || 0) + it.qty;
  }));
  const arr = Object.entries(map).map(([pid, qty]) => ({ product: productById(pid), qty }));
  arr.sort((a, b) => b.qty - a.qty);
  return arr.filter(a => a.product);
}

function avgDailyExpense(days = 30) {
  const from = daysAgo(days);
  const exps = expensesInRange(from, new Date());
  if (!exps.length) return 0;
  return sumExpenses(exps) / days;
}

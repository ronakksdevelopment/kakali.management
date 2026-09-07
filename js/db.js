/* ============================================================
   DB.JS — IndexedDB wrapper for Kakali Enterprise
   All business data lives here. No server calls, ever.
   ============================================================ */

const DB_NAME = 'kakali_enterprise_db';
const DB_VERSION = 1;

const STORES = [
  'products',      // id, name, sku, category, purchasePrice, sellPrice, stock, minStock, unit, supplierId, image, taxRate, notes, createdAt
  'customers',      // id, name, phone, address, notes, createdAt
  'suppliers',      // id, name, phone, address, notes, createdAt
  'sales',          // id, invoiceNo, date, customerId, items[], subtotal, discount, tax, total, paid, due, paymentMethod, status, notes
  'purchases',      // id, date, supplierId, items[], total, paid, due, notes
  'expenses',       // id, date, category, amount, description, paymentMethod, notes
  'incomes',        // id, date, amount, description, notes
  'ledger',         // id, date, type(receive/give), personType(customer/supplier), personId, amount, note, relatedSaleId, relatedPurchaseId
  'reminders',      // id, title, note, dueDate, done, createdAt
  'stockLog',       // id, productId, date, change, reason, refId
  'settings',       // key, value  (single doc store, key='app')
];

let _db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (_db) return resolve(_db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      STORES.forEach(name => {
        if (!db.objectStoreNames.contains(name)) {
          const keyPath = name === 'settings' ? 'key' : 'id';
          const store = db.createObjectStore(name, { keyPath });
          if (name !== 'settings') {
            store.createIndex('createdAt', 'createdAt', { unique: false });
          }
        }
      });
    };
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror = (e) => reject(e.target.error);
  });
}

function tx(storeName, mode = 'readonly') {
  return openDB().then(db => db.transaction(storeName, mode).objectStore(storeName));
}

const DB = {
  async getAll(store) {
    const s = await tx(store);
    return new Promise((resolve, reject) => {
      const req = s.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async get(store, id) {
    const s = await tx(store);
    return new Promise((resolve, reject) => {
      const req = s.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async put(store, obj) {
    const s = await tx(store, 'readwrite');
    return new Promise((resolve, reject) => {
      const req = s.put(obj);
      req.onsuccess = () => resolve(obj);
      req.onerror = () => reject(req.error);
    });
  },

  async bulkPut(store, arr) {
    const s = await tx(store, 'readwrite');
    return new Promise((resolve, reject) => {
      arr.forEach(obj => s.put(obj));
      s.transaction.oncomplete = () => resolve();
      s.transaction.onerror = () => reject(s.transaction.error);
    });
  },

  async delete(store, id) {
    const s = await tx(store, 'readwrite');
    return new Promise((resolve, reject) => {
      const req = s.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async clear(store) {
    const s = await tx(store, 'readwrite');
    return new Promise((resolve, reject) => {
      const req = s.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async clearAll() {
    for (const s of STORES) await this.clear(s);
  },

  async exportAll() {
    const data = {};
    for (const s of STORES) {
      data[s] = await this.getAll(s);
    }
    data.__meta = { app: 'kakali-enterprise', exportedAt: new Date().toISOString(), version: DB_VERSION };
    return data;
  },

  async importAll(data) {
    for (const s of STORES) {
      if (Array.isArray(data[s])) {
        await this.clear(s);
        await this.bulkPut(s, data[s]);
      }
    }
  },
};

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

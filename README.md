# Kakali Enterprise Business Manager v1.5

A complete, offline-first Progressive Web App for managing a local shop or small
business — sales, stock, customer/supplier ledgers (khata), expenses, purchases,
billing, reports, and reminders. No server, no backend, no account required.
All data stays on the owner's device.

## Deploying to GitHub Pages

1. Create a new GitHub repository (public or private with Pages enabled).
2. Upload the entire contents of this folder to the repository root
   (`index.html`, `manifest.json`, `service-worker.js`, `css/`, `js/`, `icons/`,
   `assets/` should all sit at the top level of the repo).
3. In the repository settings, go to **Settings → Pages**, set the source to
   your default branch (e.g. `main`) and root folder (`/`).
4. Wait a minute for GitHub to publish, then visit the URL GitHub gives you
   (usually `https://<username>.github.io/<repo-name>/`).
5. Open the site on a phone or desktop browser — you'll get an "Install"
   prompt (or use the browser menu → "Add to Home Screen" / "Install App").

No build step, no npm install, no server configuration needed — it's plain
HTML/CSS/JS and works directly from static hosting.

## Local testing

You can also run it locally with any static file server, for example:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Project structure

```
index.html            Entry point
manifest.json         PWA manifest (icons, name, theme colors)
service-worker.js     Offline caching
css/
  tokens.css          Design tokens (colors, spacing, type scale)
  base.css            Reset + base layout
  components.css      Buttons, cards, forms, lists
  layout.css          Navigation, modals, toasts, PIN screen
  print.css           Bill/invoice print styles
js/
  db.js               IndexedDB wrapper (all business data)
  i18n.js             English / Bengali / Hindi translations
  utils.js            Formatting, dates, toast/modal helpers
  state.js            App state + business calculations
  router.js           Hash-based router + navigation shell
  app.js              Boot sequence, PIN gate, install prompt
  views/              One file per screen (dashboard, sales, products, ...)
icons/                All PWA icon sizes, generated from the brand logo
assets/               Source logo
```

## Data & privacy

- All business data is stored locally on the device using IndexedDB.
- Nothing is ever sent to a server — the app works fully offline after first
  load.
- Use **Settings → Backup & Restore** regularly to export a JSON backup,
  since clearing browser data will remove locally stored records.

## Features included

- Dashboard with today's sales, receipts, dues, expenses, and net, plus
  auto-generated insights (no fabricated data — empty states shown when
  there isn't enough history yet).
- Sales: cart-based new sale flow, discounts, tax, multiple payment methods,
  partial/full payment, auto invoice numbering, printable/shareable bills,
  WhatsApp share, duplicate-sale shortcut.
- Quick Bill: rear/front camera QR scanner, manual product-code fallback,
  editable quantity/removal checkout list, subtotal, saved bills, print, and
  optional WhatsApp receipt sharing.
- Product QR labels: optional image and extra details, a Kakali QR payload,
  branded centre logo, and PNG download for printing and attachment to stock.
- Products & stock: low-stock alerts, categories, units, per-product tax
  rate, stock history log.
- Purchases: restocking from suppliers with automatic stock and supplier
  balance updates.
- Customers & Suppliers: running balances ("you will receive" / "you need
  to give"), transaction history, WhatsApp due reminders.
- Khata ledger: simple Receive / Give actions tied to any customer or
  supplier.
- Expenses & other income tracking with categories.
- Reports: daily/weekly/monthly views, profit estimate, top products, low
  stock, CSV export.
- Reminders list (in-app, no dependency on browser notification support).
- Global search across products, customers, suppliers, sales, expenses.
- Settings: business profile, GST toggle, language (English/Bengali/Hindi),
  currency (configurable, not hard-coded to INR), dark mode, optional 4-digit
  PIN lock, WhatsApp message templates, backup/restore (JSON) and CSV export,
  full data reset with confirmation.
- Optional sample data mode for exploring the app risk-free (Settings →
  Load Sample Data), only offered while your own data is still empty.
- Responsive layouts: bottom navigation on mobile, sidebar on desktop/tablet.
- Installable PWA with offline support via service worker caching.

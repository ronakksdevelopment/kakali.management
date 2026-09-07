/* ============================================================
   APP.JS — bootstrap, shell, PIN gate, install prompt
   ============================================================ */

window.addEventListener('DOMContentLoaded', boot);

async function boot() {
  await loadAllState();
  if (!APP_STATE.settings.onboarded) {
    renderOnboarding();
    return;
  }
  if (APP_STATE.settings.pinEnabled) {
    showUnlockScreen(startMainApp);
  } else {
    startMainApp();
  }
}

function startMainApp() {
  renderShell();
  const parsed = parseHash();
  APP_STATE.route = parsed.route;
  APP_STATE.routeParams = parsed.params;
  renderShellNav();
  renderView();
  setupInstallPrompt();
  registerServiceWorker();
  window.addEventListener('hashchange', () => {
    const p = parseHash();
    APP_STATE.route = p.route; APP_STATE.routeParams = p.params;
    renderShellNav(); renderView();
  });
}

function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <img src="icons/icon-72.png" alt="">
        <span class="brand-name">${escapeHtml(APP_STATE.settings.businessName || t('appName'))}</span>
      </div>
      <div class="top-actions">
        <button class="icon-btn on-blue" id="topSearchBtn"><i class="fa-solid fa-magnifying-glass"></i></button>
        <button class="icon-btn on-blue" id="topSettingsBtn"><i class="fa-solid fa-gear"></i></button>
      </div>
    </header>
    <div class="app-body">
      <nav class="sidebar" id="sidebar"></nav>
      <main id="view"></main>
    </div>
    <nav class="bottom-nav" id="bottomNav"></nav>
    <button class="fab" aria-label="Quick add"><i class="fa-solid fa-plus"></i></button>
  `;
  document.getElementById('topSearchBtn').onclick = () => navigate('search');
  document.getElementById('topSettingsBtn').onclick = () => navigate('settings');
}

/* ---------------- PIN unlock gate ---------------- */
function showUnlockScreen(onSuccess) {
  let entered = '';
  let attempts = 0;
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="pin-screen">
      <img src="icons/icon-192.png" alt="">
      <h2>${t('enterPin')}</h2>
      <div class="pin-dots" id="unlockDots">${[0,1,2,3].map(() => '<div class="pin-dot"></div>').join('')}</div>
      <div class="pin-keypad">
        ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="pin-key" data-num="${n}">${n}</button>`).join('')}
        <span></span>
        <button class="pin-key" data-num="0">0</button>
        <button class="pin-key ghost" id="unlockBackBtn"><i class="fa-solid fa-delete-left"></i></button>
      </div>
      <p style="opacity:0.6;font-size:12px;margin-top:28px;text-align:center;max-width:280px;">${t('forgotPin')}</p>
    </div>
  `;
  const dotsWrap = document.getElementById('unlockDots');
  function updateDots() { dotsWrap.querySelectorAll('.pin-dot').forEach((d, i) => d.classList.toggle('filled', i < entered.length)); }
  function shakeDots() { dotsWrap.querySelectorAll('.pin-dot').forEach(d => d.classList.add('shake')); setTimeout(() => dotsWrap.querySelectorAll('.pin-dot').forEach(d => d.classList.remove('shake')), 400); }

  app.querySelectorAll('[data-num]').forEach(b => b.onclick = async () => {
    if (entered.length >= 4) return;
    entered += b.dataset.num;
    updateDots();
    if (entered.length === 4) {
      const hash = await sha256(entered);
      if (hash === APP_STATE.settings.pinHash) {
        onSuccess();
      } else {
        attempts++;
        shakeDots();
        vibrate(200);
        setTimeout(() => { entered = ''; updateDots(); }, 400);
        showToast(t('wrongPin'), 'error');
      }
    }
  });
  app.querySelector('#unlockBackBtn').onclick = () => { entered = entered.slice(0, -1); updateDots(); };
}

/* ---------------- Install prompt ---------------- */
window.deferredInstallPrompt = null;
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredInstallPrompt = e;
    if (!localStorage.getItem('kakali_install_dismissed') && !localStorage.getItem('kakali_installed')) {
      setTimeout(showInstallBanner, 4000);
    }
  });
  window.addEventListener('appinstalled', () => {
    localStorage.setItem('kakali_installed', '1');
    const b = document.getElementById('installBannerEl');
    if (b) b.remove();
  });
}

function showInstallBanner() {
  if (document.getElementById('installBannerEl')) return;
  const el = document.createElement('div');
  el.className = 'install-banner';
  el.id = 'installBannerEl';
  el.innerHTML = `
    <img src="icons/icon-72.png" style="width:44px;height:44px;border-radius:12px;flex-shrink:0;">
    <div style="flex:1;">
      <div style="font-weight:700;font-size:14px;">${t('installAppTitle')}</div>
      <div style="font-size:12px;color:var(--ink-500);">${t('installAppDesc')}</div>
    </div>
    <button class="btn btn-primary btn-sm" id="doInstallBtn">${t('install')}</button>
    <button class="icon-btn" id="dismissInstallBtn" style="width:32px;height:32px;"><i class="fa-solid fa-xmark"></i></button>
  `;
  document.body.appendChild(el);
  el.querySelector('#doInstallBtn').onclick = async () => {
    if (window.deferredInstallPrompt) {
      window.deferredInstallPrompt.prompt();
      await window.deferredInstallPrompt.userChoice;
      window.deferredInstallPrompt = null;
    }
    el.remove();
  };
  el.querySelector('#dismissInstallBtn').onclick = () => { localStorage.setItem('kakali_install_dismissed', '1'); el.remove(); };
}

/* ---------------- Service worker ---------------- */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(err => console.warn('SW registration failed', err));
    });
  }
}

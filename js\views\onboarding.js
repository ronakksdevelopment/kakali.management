/* ============================================================
   ONBOARDING.JS — first launch welcome flow
   ============================================================ */

let onboardData = { businessName: '', ownerName: '', phone: '', address: '', currency: 'INR', language: 'en', isGst: false };
let onboardStep = 0;

function renderOnboarding() {
  const app = document.getElementById('app');
  app.innerHTML = `<div id="onboardRoot"></div>`;
  paintOnboardStep();
}

const ONBOARD_STEPS = ['welcome', 'language', 'business', 'currency', 'ready'];

function paintOnboardStep() {
  const root = document.getElementById('onboardRoot');
  const step = ONBOARD_STEPS[onboardStep];
  root.innerHTML = onboardStepHtml(step);
  bindOnboardStep(step);
}

function onboardShell(inner, showBack = true) {
  return `
    <div style="min-height:100vh;display:flex;flex-direction:column;background:linear-gradient(160deg,var(--blue-900),var(--blue-700));color:#fff;">
      <div style="padding:20px;">
        ${showBack ? `<button class="icon-btn on-blue" id="obBack"><i class="fa-solid fa-arrow-left"></i></button>` : ''}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 28px 40px;max-width:480px;margin:0 auto;width:100%;">
        ${inner}
      </div>
    </div>
  `;
}

function onboardStepHtml(step) {
  if (step === 'welcome') {
    return onboardShell(`
      <div class="text-center">
        <img src="icons/icon-192.png" style="width:88px;height:88px;border-radius:22px;margin:0 auto 24px;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <h1 style="font-size:28px;font-weight:800;margin-bottom:12px;">${t('welcomeTitle')}</h1>
        <p style="font-size:15px;opacity:0.85;line-height:1.5;margin-bottom:40px;">${t('tagline')}</p>
        <button class="btn btn-accent btn-lg btn-block" id="obNext">${t('getStarted')}</button>
      </div>
    `, false);
  }
  if (step === 'language') {
    return onboardShell(`
      <h2 style="font-size:22px;font-weight:800;margin-bottom:6px;">${t('language')}</h2>
      <p style="opacity:0.8;margin-bottom:24px;font-size:14px;">Choose your preferred language</p>
      <div class="flex-col gap-3">
        ${[['en','English'],['bn','বাংলা'],['hi','हिन्दी']].map(([code,label]) => `
          <button class="btn ${onboardData.language===code?'btn-accent':'btn-outline'}" data-lang="${code}" style="justify-content:flex-start;background:${onboardData.language===code?'':'rgba(255,255,255,0.08)'};color:${onboardData.language===code?'':'#fff'};border-color:rgba(255,255,255,0.25);">
            <i class="fa-solid fa-language"></i> ${label}
          </button>
        `).join('')}
      </div>
      <button class="btn btn-accent btn-lg btn-block mt-4" id="obNext">${t('next')}</button>
    `);
  }
  if (step === 'business') {
    return onboardShell(`
      <h2 style="font-size:22px;font-weight:800;margin-bottom:20px;">${t('businessProfile')}</h2>
      <form id="obBizForm" class="flex-col gap-3">
        <div class="field" style="margin-bottom:0;"><label style="color:#fff;">${t('businessName')} *</label><input class="input" name="businessName" required value="${escapeHtml(onboardData.businessName)}" placeholder="Kakali Enterprise"></div>
        <div class="field" style="margin-bottom:0;"><label style="color:#fff;">${t('ownerName')}</label><input class="input" name="ownerName" value="${escapeHtml(onboardData.ownerName)}"></div>
        <div class="field" style="margin-bottom:0;"><label style="color:#fff;">${t('phone')}</label><input class="input" type="tel" name="phone" value="${escapeHtml(onboardData.phone)}"></div>
        <div class="field" style="margin-bottom:0;"><label style="color:#fff;">${t('address')}</label><input class="input" name="address" value="${escapeHtml(onboardData.address)}"></div>
      </form>
      <button class="btn btn-accent btn-lg btn-block mt-4" id="obNext">${t('next')}</button>
    `);
  }
  if (step === 'currency') {
    const opts = Object.keys(CURRENCY_SYMBOLS);
    return onboardShell(`
      <h2 style="font-size:22px;font-weight:800;margin-bottom:6px;">${t('currency')}</h2>
      <p style="opacity:0.8;margin-bottom:20px;font-size:14px;">Select your business currency</p>
      <select class="input" id="obCurrencySelect" style="margin-bottom:16px;">
        ${opts.map(c => `<option value="${c}" ${onboardData.currency===c?'selected':''}>${c} (${CURRENCY_SYMBOLS[c]})</option>`).join('')}
      </select>
      <div class="switch-row" style="color:#fff;">
        <span class="font-semi">${t('gstBusiness')}</span>
        <label class="switch"><input type="checkbox" id="obGstToggle" ${onboardData.isGst?'checked':''}><span class="track"></span></label>
      </div>
      <button class="btn btn-accent btn-lg btn-block mt-4" id="obNext">${t('next')}</button>
    `);
  }
  if (step === 'ready') {
    return onboardShell(`
      <div class="text-center">
        <div style="width:88px;height:88px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;color:var(--gold-400);">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h1 style="font-size:26px;font-weight:800;margin-bottom:12px;">${t('shopReady')}</h1>
        <p style="font-size:14px;opacity:0.85;margin-bottom:40px;">${t('dataStoredLocally')}</p>
        <button class="btn btn-accent btn-lg btn-block" id="obFinish">${t('getStarted')}</button>
      </div>
    `, false);
  }
}

function bindOnboardStep(step) {
  const back = document.getElementById('obBack');
  if (back) back.onclick = () => { onboardStep = Math.max(0, onboardStep - 1); paintOnboardStep(); };

  if (step === 'welcome') {
    document.getElementById('obNext').onclick = () => { onboardStep++; paintOnboardStep(); };
  }
  if (step === 'language') {
    document.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { onboardData.language = b.dataset.lang; setLang(b.dataset.lang); paintOnboardStep(); });
    document.getElementById('obNext').onclick = () => { onboardStep++; paintOnboardStep(); };
  }
  if (step === 'business') {
    document.getElementById('obNext').onclick = () => {
      const form = document.getElementById('obBizForm');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const fd = new FormData(form);
      onboardData.businessName = fd.get('businessName').trim();
      onboardData.ownerName = fd.get('ownerName').trim();
      onboardData.phone = fd.get('phone').trim();
      onboardData.address = fd.get('address').trim();
      onboardStep++; paintOnboardStep();
    };
  }
  if (step === 'currency') {
    document.getElementById('obNext').onclick = () => {
      onboardData.currency = document.getElementById('obCurrencySelect').value;
      onboardData.isGst = document.getElementById('obGstToggle').checked;
      onboardStep++; paintOnboardStep();
    };
  }
  if (step === 'ready') {
    document.getElementById('obFinish').onclick = async () => {
      await saveSettings({
        onboarded: true,
        businessName: onboardData.businessName,
        ownerName: onboardData.ownerName,
        phone: onboardData.phone,
        address: onboardData.address,
        currency: onboardData.currency,
        language: onboardData.language,
        isGst: onboardData.isGst,
      });
      startMainApp();
    };
  }
}

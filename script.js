/* =========================================================
   IcomTV × Senses — configuração e comportamento da landing
   ========================================================= */

const CONFIG = {
  // URL que recebe o lead via POST (JSON). Ex.: webhook do n8n, Zapier, RD Station, planilha via Apps Script.
  // Deixe vazio para enviar o lead direto para o WhatsApp abaixo.
  LEAD_WEBHOOK_URL: '',

  // WhatsApp comercial que recebe o contato (somente números, com DDI + DDD).
  WHATSAPP_NUMBER: '5519989555714',

  // Identificação da origem do lead.
  CAMPAIGN: 'Parceria IcomTV + Senses',
};

// Os 3 modelos ofertados aos clientes IcomTV (dados de gruposenses.com.br/atuacao/locacao-de-difusores/).
const MODELS = [
  {
    id: 'brisa',
    name: 'Brisa',
    ideal: 'Consultórios e salas compactas',
    tagline: 'Presença discreta e contínua para espaços compactos.',
    area: 25,
    price: 169,
    specs: [
      ['Cobertura', 'até 25 m²'],
      ['Aspersão', 'Borrifação'],
      ['Reservatório', '280 ml'],
      ['Dimensões', '7,5 × 20 × 7,5 cm'],
    ],
  },
  {
    id: 'serena',
    name: 'Serena',
    ideal: 'Recepções de clínicas',
    tagline: 'Controle preciso com nano nebulização em formato compacto.',
    area: 45,
    price: 269,
    featured: true,
    badge: 'Mais indicado para recepção',
    specs: [
      ['Cobertura', 'até 45 m²'],
      ['Aspersão', 'Nano nebulização'],
      ['Reservatório', '100 ml'],
      ['Dimensões', '17 × 16 × 6 cm'],
    ],
  },
  {
    id: 'ventus',
    name: 'Ventus',
    ideal: 'Clínicas amplas e áreas integradas',
    tagline: 'Aromatização inteligente via app, com até 5 rotinas programadas.',
    area: 160,
    price: 449,
    specs: [
      ['Cobertura', 'até 160 m²'],
      ['Aspersão', 'Nano nebulização'],
      ['Reservatório', '400 ml'],
      ['Controle', 'App Scent Tech (Bluetooth)'],
    ],
  },
];

const INCLUDES = ['Comodato do equipamento', 'Garantia eterna', 'Essências MoreSenses recorrentes', 'Instalação e monitoramento'];

document.documentElement.classList.remove('no-js');

/* ---------- render dos modelos ---------- */
function renderModels() {
  const list = document.getElementById('models-list');
  const chips = document.getElementById('model-chips');
  const maxArea = Math.max(...MODELS.map((m) => m.area));

  list.innerHTML = MODELS.map((m) => `
    <article class="model reveal${m.featured ? ' model--featured' : ''}">
      ${m.badge ? `<span class="model__badge">${m.badge}</span>` : ''}
      <span class="model__ideal">${m.ideal}</span>
      <h3><small>Senses</small>${m.name}</h3>
      <p class="model__tagline">${m.tagline}</p>
      <div class="model__price">
        <small>Assinatura mensal</small>
        <div><span class="model__currency">R$</span><strong>${m.price}</strong><span class="model__per">/mês</span></div>
        <em>Equipamento + essências + garantia eterna</em>
      </div>
      <div class="model__gauge">
        <div class="model__gauge-top">
          <strong>${m.area}<small>m²</small></strong>
          <span>de cobertura</span>
        </div>
        <div class="model__bar"><i style="--w:${Math.max(12, (m.area / maxArea) * 100)}%"></i></div>
      </div>
      <ul class="model__specs">
        ${m.specs.map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join('')}
      </ul>
      <ul class="model__includes">
        ${INCLUDES.map((i) => `<li>${i}</li>`).join('')}
      </ul>
      <a href="#formulario" class="btn btn--gold" data-model="${m.id}">Quero o ${m.name} <span aria-hidden="true">→</span></a>
    </article>`).join('');

  chips.insertAdjacentHTML('afterbegin', MODELS.map((m) => `
    <label class="chip"><input type="radio" name="modelo" value="Senses ${m.name} (R$${m.price}/mês)" data-model="${m.id}"><span>${m.name} · R$${m.price}/mês</span></label>`).join(''));

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-model]');
    if (!btn) return;
    const radio = chips.querySelector(`input[data-model="${btn.dataset.model}"]`);
    if (radio) radio.checked = true;
  });
}

/* ---------- animações ao rolar ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el, i) => {
    if (el.parentElement.children.length > 1 && !el.classList.contains('reveal--delay')) {
      el.style.transitionDelay = `${(Array.from(el.parentElement.children).indexOf(el) % 4) * 0.08}s`;
    }
    io.observe(el);
  });
}

/* ---------- contadores ---------- */
function initCounters() {
  const fmt = new Intl.NumberFormat('pt-BR');
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1600, 1);
        el.textContent = fmt.format(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => io.observe(c));
}

/* ---------- nav e CTA fixo ---------- */
function initScrollUi() {
  const nav = document.querySelector('.nav');
  const sticky = document.getElementById('sticky-cta');
  const form = document.getElementById('formulario');
  let formInView = false;

  new IntersectionObserver(([e]) => { formInView = e.isIntersecting; onScroll(); }, { threshold: 0.05 }).observe(form);

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    sticky.classList.toggle('is-visible', y > 600 && !formInView);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- formulário ---------- */
function maskPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function whatsappLink(lead) {
  const lines = [
    `Olá! Sou cliente IcomTV e quero a condição especial da Senses.`,
    ``,
    `*Nome:* ${lead.nome}`,
    `*Clínica:* ${lead.clinica}`,
    `*Cidade:* ${lead.cidade}`,
    lead.area ? `*Recepção:* ${lead.area}` : null,
    `*Modelo:* ${lead.modelo}`,
    lead.email ? `*E-mail:* ${lead.email}` : null,
  ].filter((l) => l !== null);
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function initForm() {
  const form = document.getElementById('lead-form');
  const phone = form.elements.whatsapp;
  const errorBox = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');
  const success = document.getElementById('lead-success');

  // UTMs da URL para os campos ocultos
  const params = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((k) => {
    if (params.get(k)) form.elements[k].value = params.get(k);
  });

  phone.addEventListener('input', () => { phone.value = maskPhone(phone.value); });
  form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));
  form.elements.consentimento.addEventListener('change', (e) => e.target.closest('.consent').classList.remove('is-invalid'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    if (form.elements.empresa_site.value) return; // honeypot

    const data = Object.fromEntries(new FormData(form));
    const invalid = [];
    ['nome', 'clinica', 'cidade'].forEach((k) => { if (!data[k]?.trim()) invalid.push(form.elements[k]); });
    if (data.whatsapp.replace(/\D/g, '').length < 10) invalid.push(phone);
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) invalid.push(form.elements.email);
    if (!form.elements.consentimento.checked) form.elements.consentimento.closest('.consent').classList.add('is-invalid');

    if (invalid.length || !form.elements.consentimento.checked) {
      invalid.forEach((el) => el.classList.add('is-invalid'));
      errorBox.textContent = invalid.length
        ? 'Confira os campos destacados para continuar.'
        : 'Marque a autorização de contato para continuar.';
      errorBox.hidden = false;
      (invalid[0] || form.elements.consentimento).focus();
      return;
    }

    const lead = {
      ...data,
      consentimento: true,
      origem: CONFIG.CAMPAIGN,
      pagina: location.href,
      enviado_em: new Date().toISOString(),
    };
    delete lead.empresa_site;
    const wa = whatsappLink(lead);

    if (!CONFIG.LEAD_WEBHOOK_URL) {
      window.open(wa, '_blank', 'noopener');
      showSuccess(wa);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.firstChild.textContent = 'Enviando… ';
    try {
      const res = await fetch(CONFIG.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(res.status);
      if (window.dataLayer) window.dataLayer.push({ event: 'lead_icomtv_senses', modelo: lead.modelo });
      showSuccess(wa);
    } catch (err) {
      errorBox.innerHTML = `Não conseguimos enviar agora. <a href="${wa}" target="_blank" rel="noopener">Fale direto pelo WhatsApp</a>.`;
      errorBox.hidden = false;
      submitBtn.disabled = false;
      submitBtn.firstChild.textContent = 'Quero falar com um consultor ';
    }
  });

  function showSuccess(wa) {
    document.getElementById('success-wa').href = wa;
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

renderModels();
initReveal();
initCounters();
initScrollUi();
initForm();
document.getElementById('year').textContent = new Date().getFullYear();

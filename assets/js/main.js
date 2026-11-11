(() => {
  'use strict';

  /* ===== KONFIGURASI (mudah diganti) ===== */
  const CONFIG = {
    whatsappNumber: '6281234567890', // format internasional tanpa +
    whatsappMessage: 'Halo CengskySite, saya ingin berdiskusi tentang proyek website/aplikasi.',
    whatsappMessageEn: 'Hello CengskySite, I would like to discuss a website/application project.'
  };

  const PROJECTS = [
    { cat: 'Enterprise', label: 'Enterprise Web Application', icon: 'bi-headset', title: 'IT Ticketing Management System',
      desc: 'Sistem pengelolaan tiket IT untuk memudahkan pelaporan masalah, komunikasi antara user dan tim IT, tracking status, serta pengelolaan penyelesaian tiket.',
      features: ['Ticket management', 'Real-time chat', 'Ticket status tracking', 'SLA response & resolution monitoring', 'User management', 'Reporting'] },
    { cat: 'Business Process', label: 'Business Process Management', icon: 'bi-journal-check', title: 'SOP Management & Approval System',
      desc: 'Sistem pengelolaan dokumen SOP dan proses approval bertingkat untuk mengelola dokumen serta alur persetujuan secara terstruktur.',
      features: ['SOP document management', 'Multi-level approval', 'Sequential approval workflow', 'User role management', 'Approval status tracking', 'Document access management'] },
    { cat: 'Custom App', label: 'Custom Business Application', icon: 'bi-receipt-cutoff', title: 'Claim Management System',
      desc: 'Sistem pengelolaan klaim untuk pencatatan, monitoring, dan pengelolaan klaim dengan data customer dan produk.',
      features: ['Claim management', 'Customer & product mapping', 'Quantity & value management', 'Payment date tracking', 'Reporting & export to Excel'] },
    { cat: 'Enterprise', label: 'Enterprise Application', icon: 'bi-cart-check', title: 'E-Procurement System',
      desc: 'Sistem digital untuk membantu proses pengadaan barang dan kebutuhan perusahaan secara lebih terstruktur.',
      features: ['Pengadaan terstruktur', 'Alur persetujuan', 'Pencatatan & monitoring'],
      note: 'Catatan: tampilkan detail lebih lengkap setelah implementasi dapat dipresentasikan.' },
    { cat: 'Platform', label: 'Digital Platform / Wedding Management', icon: 'bi-heart-fill', title: 'Everweds', internal: true,
      desc: 'Platform digital untuk membantu pengelolaan kebutuhan pernikahan melalui wedding planning, digital invitation, budget management, dan vendor management.',
      features: ['Wedding planning', 'Digital invitation', 'Budget management', 'Vendor management'],
      note: 'Everweds adalah produk internal yang sedang dikembangkan sendiri, bukan proyek klien.' }
  ];

  const TESTIMONIALS = [
    { name: 'Nama Klien', role: 'Jabatan, Perusahaan', text: 'Placeholder testimoni. Ganti dengan testimoni asli klien setelah tersedia.' },
    { name: 'Nama Klien', role: 'Jabatan, Perusahaan', text: 'Placeholder testimoni. Struktur ini siap diisi dengan masukan nyata dari pelanggan.' },
    { name: 'Nama Klien', role: 'Jabatan, Perusahaan', text: 'Placeholder testimoni. Jangan dipublikasikan sebelum diganti dengan konten asli.' }
  ];

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

  /* ===== Bahasa (ID/EN) & tema (gelap/terang) ===== */
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* abaikan */ } }
  };
  const root = document.documentElement;
  let lang = store.get('cs-lang') || ((navigator.language || '').toLowerCase().startsWith('id') ? 'id' : 'en');
  const L = (en, id) => (lang === 'id' ? id : en);
  const MAP = new Map();
  (window.CS_I18N || []).forEach(([en, id, ...alias]) => {
    const pair = { en, id };
    [en, id, ...alias].forEach(k => MAP.set(k, pair));
  });
  const tr = s => (MAP.get(s) || {})[lang] || s;
  const applyLang = (scope = document.body) => {
    const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT), nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => {
      if (!n.parentElement || n.parentElement.closest('script,style,pre')) return;
      const m = n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const pair = MAP.get(m[2].replace(/\s+/g, ' '));
      if (pair && pair[lang] !== m[2]) n.nodeValue = m[1] + pair[lang] + m[3];
    });
  };
  const syncTools = () => {
    const dark = root.dataset.theme === 'dark';
    $('#langBtn').innerHTML = `<i class="bi bi-translate"></i> ${lang.toUpperCase()}`;
    $('#langBtn').setAttribute('aria-label', L('Switch language', 'Ganti bahasa'));
    $('#themeBtn').innerHTML = `<i class="bi ${dark ? 'bi-sun' : 'bi-moon-stars'}"></i>`;
    $('#themeBtn').setAttribute('aria-label', dark ? L('Switch to light mode', 'Beralih ke mode terang') : L('Switch to dark mode', 'Beralih ke mode gelap'));
  };
  const setLang = l => { lang = l; store.set('cs-lang', l); root.lang = l; applyLang(); syncTools(); };
  const setTheme = t => { root.dataset.theme = t; store.set('cs-theme', t); syncTools(); };

  /* ===== Navbar, back-to-top, tahun ===== */
  const nav = $('#mainNav'), toTop = $('#toTop');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    toTop.classList.toggle('show', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  $('#year').textContent = new Date().getFullYear();

  // tutup menu mobile saat link diklik
  $$('#navMenu a').forEach(a => a.addEventListener('click', () => {
    const el = $('#navMenu');
    if (el.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(el).hide();
  }));

  /* ===== Portofolio ===== */
  const grid = $('#portfolioGrid'), filterBox = $('#portfolioFilters');
  const cats = ['All', ...new Set(PROJECTS.map(p => p.cat))];
  filterBox.innerHTML = cats.map((c, i) => `<button type="button" class="${i ? '' : 'active'}" data-cat="${c}">${c}</button>`).join('');

  applyLang(filterBox);
  const renderProjects = cat => {
    const list = PROJECTS.map((p, i) => ({ ...p, i })).filter(p => cat === 'All' || p.cat === cat);
    grid.innerHTML = list.map(p => `
      <div class="col-md-6 col-lg-4"><article class="pcard">
        <div class="pthumb" role="img" aria-label="Mockup ilustratif ${esc(p.title)}"><i class="bi ${p.icon}"></i>${p.internal ? '<span class="badge-cs tag">Internal Product</span>' : ''}</div>
        <div class="pbody"><span class="pcat">${esc(p.label)}</span><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
        <div class="pfeat">${p.features.slice(0, 3).map(f => `<span>${esc(f)}</span>`).join('')}</div>
        <button type="button" class="btn" data-project="${p.i}">View Details</button></div>
      </article></div>`).join('');
    applyLang(grid);
  };
  renderProjects('All');

  filterBox.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', filterBox).forEach(x => x.classList.toggle('active', x === b));
    renderProjects(b.dataset.cat);
  });

  const modalEl = $('#projectModal'), modal = new bootstrap.Modal(modalEl);
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-project]'); if (!b) return;
    const p = PROJECTS[+b.dataset.project];
    $('#pmCat').textContent = tr(p.label) + (p.internal ? ' · ' + tr('Internal Product') : '');
    $('#pmTitle').textContent = p.title;
    $('#pmDesc').textContent = p.desc;
    $('#pmFeat').innerHTML = p.features.map(f => `<li>${esc(f)}</li>`).join('');
    $('#pmNote').textContent = p.note || '';
    applyLang(modalEl);
    modal.show();
  });

  /* ===== Testimoni (placeholder) ===== */
  $('#testimonialGrid').innerHTML = TESTIMONIALS.map(t => `
    <div class="col-md-4 reveal"><div class="tcard"><span class="badge-cs">Placeholder</span>
    <p>${esc(t.text)}</p><strong>${esc(t.name)}</strong><small>${esc(t.role)}</small></div></div>`).join('');
  applyLang($('#testimonialGrid'));

  /* ===== Pilih layanan dari tombol CTA ===== */
  const serviceSel = $('#service');
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-service]'); if (!a) return;
    const v = a.dataset.service;
    if ([...serviceSel.options].some(o => o.text === v)) serviceSel.value = v;
  });

  /* ===== WhatsApp ===== */
  const waUrl = msg => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  const refreshWa = () => { $('#waBtn').href = waUrl(L(CONFIG.whatsappMessageEn, CONFIG.whatsappMessage)); };
  refreshWa();

  /* ===== Form: validasi + simulasi kirim (belum ada backend) ===== */
  const form = $('#contactForm'), sendBtn = $('#sendBtn'), status = $('#formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    status.innerHTML = '';
    form.classList.add('was-validated');
    if (!form.checkValidity()) { form.querySelector(':invalid')?.focus(); return; }

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>' + L('Sending...', 'Mengirim...');

    const data = Object.fromEntries(new FormData(form));
    // TODO backend: ganti blok setTimeout dengan fetch('/api/inquiry', {method:'POST', body: JSON.stringify(data)})
    setTimeout(() => {
      const msg = `Halo CengskySite, saya ${data.name}${data.company ? ' dari ' + data.company : ''}.\nLayanan: ${data.service}\nBudget: ${data.budget || '-'}\nKebutuhan: ${data.desc}\nKontak: ${data.wa} / ${data.email}`;
      status.innerHTML = `<div class="alert alert-info mb-0">${L('Demo mode: the form is not connected to a server, so nothing was saved. Continue via ', 'Mode demo: form belum terhubung ke server, jadi data belum tersimpan. Lanjutkan via ')}<a class="alert-link" target="_blank" rel="noopener" href="${waUrl(msg)}">WhatsApp</a>${L(' so your inquiry reaches us.', ' agar inquiry Anda sampai ke kami.')}</div>`;
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span class="btn-label">Send Project Inquiry</span>';
      applyLang(sendBtn);
      form.reset(); form.classList.remove('was-validated');
    }, 1200);
  });

  /* ===== Init bahasa & tema ===== */
  $$('#service option, #budget option').forEach(o => { if (!o.hasAttribute('value')) o.setAttribute('value', o.textContent); });
  if (!root.dataset.theme) root.dataset.theme = 'light';
  root.lang = lang; applyLang(); syncTools(); refreshWa();
  $('#langBtn').addEventListener('click', () => { setLang(lang === 'id' ? 'en' : 'id'); refreshWa(); });
  $('#themeBtn').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ===== Scroll reveal ===== */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));
})();

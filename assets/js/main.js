
(() => {
  'use strict';

  /* ===== KONFIGURASI ===== */
  const CONFIG = {
    whatsappNumber: '6281234567890',
    whatsappMessage: 'Halo CengskySite, saya ingin berdiskusi tentang proyek website/aplikasi.',
    whatsappMessageEn: 'Hello CengskySite, I would like to discuss a website/application project.'
  };

  const PROJECTS = [
    // {
    //   cat: 'Enterprise',
    //   label: 'Enterprise Web Application',
    //   icon: 'bi-headset',
    //   title: 'IT Ticketing Management System',
    //   desc: 'Sistem pengelolaan tiket IT untuk memudahkan pelaporan masalah, komunikasi antara user dan tim IT, tracking status, serta pengelolaan penyelesaian tiket.',
    //   features: ['Ticket management', 'Real-time chat', 'Ticket status tracking', 'SLA response & resolution monitoring', 'User management', 'Reporting']
    // },
    // {
    //   cat: 'Business Process',
    //   label: 'Business Process Management',
    //   icon: 'bi-journal-check',
    //   title: 'SOP Management & Approval System',
    //   desc: 'Sistem pengelolaan dokumen SOP dan proses approval bertingkat untuk mengelola dokumen serta alur persetujuan secara terstruktur.',
    //   features: ['SOP document management', 'Multi-level approval', 'Sequential approval workflow', 'User role management', 'Approval status tracking', 'Document access management']
    // },
    // {
    //   cat: 'Custom App',
    //   label: 'Custom Business Application',
    //   icon: 'bi-receipt-cutoff',
    //   title: 'Claim Management System',
    //   desc: 'Sistem pengelolaan klaim untuk pencatatan, monitoring, dan pengelolaan klaim dengan data customer dan produk.',
    //   features: ['Claim management', 'Customer & product mapping', 'Quantity & value management', 'Payment date tracking', 'Reporting & export to Excel']
    // },
    // {
    //   cat: 'Enterprise',
    //   label: 'Enterprise Application',
    //   icon: 'bi-cart-check',
    //   title: 'E-Procurement System',
    //   desc: 'Sistem digital untuk membantu proses pengadaan barang dan kebutuhan perusahaan secara lebih terstruktur.',
    //   features: ['Pengadaan terstruktur', 'Alur persetujuan', 'Pencatatan & monitoring'],
    //   note: 'Catatan: tampilkan detail lebih lengkap setelah implementasi dapat dipresentasikan.'
    // },
    // {
    //   cat: 'Platform',
    //   label: 'Digital Platform / Wedding Management',
    //   icon: 'bi-heart-fill',
    //   title: 'Everweds',
    //   internal: false,
    //   desc: 'Platform digital untuk membantu pengelolaan kebutuhan pernikahan melalui wedding planning, digital invitation, budget management, dan vendor management.',
    //   features: [
    //     'Wedding planning',
    //     'Digital invitation',
    //     'Budget management',
    //     'Vendor management'
    //   ],
    //   images: [
    //     'assets/images/portfolio/rj1.webp',
    //     'assets/images/portfolio/rj2.webp',
    //     'assets/images/portfolio/rj3.webp'
    //   ],
    //   note: 'Everweds adalah produk internal yang sedang dikembangkan sendiri, bukan proyek klien.'
    // }
  ];

  const TESTIMONIALS = [
    { name: 'Nama Klien', role: 'Jabatan, Perusahaan', text: 'Placeholder testimoni. Ganti dengan testimoni asli klien setelah tersedia.' },
    { name: 'Nama Klien', role: 'Jabatan, Perusahaan', text: 'Placeholder testimoni. Struktur ini siap diisi dengan masukan nyata dari pelanggan.' },
    { name: 'Nama Klien', role: 'Jabatan, Perusahaan', text: 'Placeholder testimoni. Jangan dipublikasikan sebelum diganti dengan konten asli.' }
  ];

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => s.replace(/[&<>"]/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[m]));

  /* ===== BAHASA DAN TEMA ===== */
  const store = {
    get: k => {
      try { return localStorage.getItem(k); }
      catch { return null; }
    },
    set: (k, v) => {
      try { localStorage.setItem(k, v); }
      catch { /* abaikan */ }
    }
  };

  const root = document.documentElement;
  let lang = store.get('cs-lang') || (
    (navigator.language || '').toLowerCase().startsWith('id') ? 'id' : 'en'
  );

  const L = (en, id) => lang === 'id' ? id : en;
  const MAP = new Map();

  (window.CS_I18N || []).forEach(([en, id, ...alias]) => {
    const pair = { en, id };
    [en, id, ...alias].forEach(k => MAP.set(k, pair));
  });

  const tr = s => (MAP.get(s) || {})[lang] || s;

  const applyLang = (scope = document.body) => {
    const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (w.nextNode()) nodes.push(w.currentNode);

    nodes.forEach(n => {
      if (!n.parentElement || n.parentElement.closest('script,style,pre')) return;

      const m = n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const pair = MAP.get(m[2].replace(/\s+/g, ' '));

      if (pair && pair[lang] !== m[2]) {
        n.nodeValue = m[1] + pair[lang] + m[3];
      }
    });
  };

  const syncTools = () => {
    const dark = root.dataset.theme === 'dark';

    $('#langBtn').innerHTML = `<i class="bi bi-translate"></i> ${lang.toUpperCase()}`;
    $('#langBtn').setAttribute('aria-label', L('Switch language', 'Ganti bahasa'));

    $('#themeBtn').innerHTML = `<i class="bi ${dark ? 'bi-sun' : 'bi-moon-stars'}"></i>`;
    $('#themeBtn').setAttribute(
      'aria-label',
      dark ? L('Switch to light mode', 'Beralih ke mode terang') : L('Switch to dark mode', 'Beralih ke mode gelap')
    );
  };

  const setLang = l => {
    lang = l;
    store.set('cs-lang', l);
    root.lang = l;
    applyLang();
    syncTools();
  };

  const setTheme = t => {
    root.dataset.theme = t;
    store.set('cs-theme', t);
    syncTools();
  };

  /* ===== NAVBAR, BACK TO TOP, TAHUN ===== */
  const nav = $('#mainNav');
  const toTop = $('#toTop');

  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    toTop.classList.toggle('show', scrollY > 600);
  };

  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: 'smooth' });
  });

  $('#year').textContent = new Date().getFullYear();

  $$('#navMenu a').forEach(a => {
    a.addEventListener('click', () => {
      const el = $('#navMenu');
      if (el.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(el).hide();
      }
    });
  });

  /* ===== PORTFOLIO ===== */
  const grid = $('#portfolioGrid');
  const filterBox = $('#portfolioFilters');

  const cats = ['All', ...new Set(PROJECTS.map(p => p.cat))];

  filterBox.innerHTML = cats.map((c, i) => `
    <button type="button" class="${i ? '' : 'active'}" data-cat="${c}">${c}</button>
  `).join('');

  applyLang(filterBox);

  const initPortfolioCarousels = () => {
    $$('.pthumb[data-carousel]', grid).forEach(carousel => {
      if (carousel._carouselTimer) {
        clearInterval(carousel._carouselTimer);
      }

      const slides = $$('.pthumb-img', carousel);
      const dots = $$('.slide-dot', carousel);

      if (slides.length <= 1) return;

      let current = 0;

      const showSlide = index => {
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === current);
        });

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === current);
          dot.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
      };

      const startAutoplay = () => {
        clearInterval(carousel._carouselTimer);

        carousel._carouselTimer = setInterval(() => {
          showSlide(current + 1);
        }, 3500);
      };

      carousel._showSlide = showSlide;
      carousel._startAutoplay = startAutoplay;

      carousel.addEventListener('mouseenter', () => {
        clearInterval(carousel._carouselTimer);
      });

      carousel.addEventListener('mouseleave', startAutoplay);

      startAutoplay();
    });
  };

  const renderProjects = cat => {
    // Hentikan autoplay carousel lama sebelum filter diganti.
    $$('.pthumb[data-carousel]', grid).forEach(el => {
      if (el._carouselTimer) clearInterval(el._carouselTimer);
    });

    const list = PROJECTS
      .map((p, i) => ({ ...p, i }))
      .filter(p => cat === 'All' || p.cat === cat);

    grid.innerHTML = list.map(p => {
      const images = Array.isArray(p.images)
        ? p.images
        : (p.image ? [p.image] : []);

      const hasImages = images.length > 0;

      return `
        <div class="col-md-6 col-lg-4">
          <article class="pcard">
            <div class="pthumb ${hasImages ? 'has-carousel' : ''}" data-carousel>
              ${
                hasImages
                  ? `
                    <div class="pthumb-slides">
                      ${images.map((img, index) => `
                        <img
                          src="${esc(img)}"
                          alt="${esc(p.title)} - gambar ${index + 1}"
                          class="pthumb-img ${index === 0 ? 'active' : ''}"
                          loading="${index === 0 ? 'eager' : 'lazy'}"
                        >
                      `).join('')}
                    </div>

                    ${
                      images.length > 1
                        ? `
                          <button type="button"
                            class="slide-control slide-prev"
                            data-slide-action="prev"
                            aria-label="Gambar sebelumnya">‹</button>

                          <button type="button"
                            class="slide-control slide-next"
                            data-slide-action="next"
                            aria-label="Gambar berikutnya">›</button>

                          <div class="slide-dots">
                            ${images.map((_, index) => `
                              <button type="button"
                                class="slide-dot ${index === 0 ? 'active' : ''}"
                                data-slide-to="${index}"
                                aria-label="Tampilkan gambar ${index + 1}"></button>
                            `).join('')}
                          </div>
                        `
                        : ''
                    }
                  `
                  : `<i class="bi ${p.icon}"></i>`
              }

              ${p.internal ? '<span class="badge-cs tag">Internal Product</span>' : ''}
            </div>

            <div class="pbody">
              <span class="pcat">${esc(p.label)}</span>
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.desc)}</p>

              <div class="pfeat">
                ${p.features.slice(0, 3).map(f => `<span>${esc(f)}</span>`).join('')}
              </div>

              <button type="button" class="btn" data-project="${p.i}">
                View Details
              </button>
            </div>
          </article>
        </div>
      `;
    }).join('');

    applyLang(grid);
    initPortfolioCarousels();
  };

  renderProjects('All');

  filterBox.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;

    $$('button', filterBox).forEach(x => {
      x.classList.toggle('active', x === b);
    });

    renderProjects(b.dataset.cat);
  });

  // Kontrol panah dan indikator carousel.
  grid.addEventListener('click', e => {
    const control = e.target.closest('[data-slide-action], [data-slide-to]');
    if (!control) return;

    const carousel = control.closest('[data-carousel]');
    if (!carousel || !carousel._showSlide) return;

    e.preventDefault();
    e.stopPropagation();

    const slides = $$('.pthumb-img', carousel);
    const activeIndex = slides.findIndex(slide => slide.classList.contains('active'));

    if (control.hasAttribute('data-slide-to')) {
      carousel._showSlide(Number(control.dataset.slideTo));
    } else if (control.dataset.slideAction === 'next') {
      carousel._showSlide(activeIndex + 1);
    } else {
      carousel._showSlide(activeIndex - 1);
    }

    carousel._startAutoplay?.();
  });

  const modalEl = $('#projectModal');
  const modal = new bootstrap.Modal(modalEl);

  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-project]');
    if (!b) return;

    const p = PROJECTS[+b.dataset.project];

    $('#pmCat').textContent = tr(p.label) + (
      p.internal ? ' · ' + tr('Internal Product') : ''
    );

    $('#pmTitle').textContent = p.title;
    $('#pmDesc').textContent = p.desc;
    $('#pmFeat').innerHTML = p.features.map(f => `<li>${esc(f)}</li>`).join('');
    $('#pmNote').textContent = p.note || '';

    applyLang(modalEl);
    modal.show();
  });

  /* ===== TESTIMONI ===== */
  $('#testimonialGrid').innerHTML = TESTIMONIALS.map(t => `
    <div class="col-md-4 reveal">
      <div class="tcard">
        <span class="badge-cs">Placeholder</span>
        <p>${esc(t.text)}</p>
        <strong>${esc(t.name)}</strong>
        <small>${esc(t.role)}</small>
      </div>
    </div>
  `).join('');

  applyLang($('#testimonialGrid'));

  /* ===== CTA LAYANAN ===== */
  const serviceSel = $('#service');

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-service]');
    if (!a) return;

    const v = a.dataset.service;

    if ([...serviceSel.options].some(o => o.text === v)) {
      serviceSel.value = v;
    }
  });

  /* ===== WHATSAPP ===== */
  const waUrl = msg =>
    `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;

  const refreshWa = () => {
    $('#waBtn').href = waUrl(L(CONFIG.whatsappMessageEn, CONFIG.whatsappMessage));
  };

  refreshWa();

  /* ===== FORM KONTAK ===== */
  const form = $('#contactForm');
  const sendBtn = $('#sendBtn');
  const status = $('#formStatus');

  form.addEventListener('submit', e => {
    e.preventDefault();
    status.innerHTML = '';

    form.classList.add('was-validated');

    if (!form.checkValidity()) {
      form.querySelector(':invalid')?.focus();
      return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>' +
      L('Sending...', 'Mengirim...');

    const data = Object.fromEntries(new FormData(form));

    setTimeout(() => {
      const msg = `Halo CengskySite, saya ${data.name}${data.company ? ' dari ' + data.company : ''}.
Layanan: ${data.service}
Budget: ${data.budget || '-'}
Kebutuhan: ${data.desc}
Kontak: ${data.wa} / ${data.email}`;

      status.innerHTML = `
        <div class="alert alert-info mb-0">
          ${L(
            'Demo mode: the form is not connected to a server, so nothing was saved. Continue via ',
            'Mode demo: form belum terhubung ke server, jadi data belum tersimpan. Lanjutkan via '
          )}
          <a class="alert-link" target="_blank" rel="noopener" href="${waUrl(msg)}">WhatsApp</a>
          ${L(' so your inquiry reaches us.', ' agar inquiry Anda sampai ke kami.')}
        </div>
      `;

      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span class="btn-label">Send Project Inquiry</span>';

      applyLang(sendBtn);

      form.reset();
      form.classList.remove('was-validated');
    }, 1200);
  });

  /* ===== INIT BAHASA DAN TEMA ===== */
  $$('#service option, #budget option').forEach(o => {
    if (!o.hasAttribute('value')) {
      o.setAttribute('value', o.textContent);
    }
  });

  if (!root.dataset.theme) root.dataset.theme = 'light';

  root.lang = lang;
  applyLang();
  syncTools();
  refreshWa();

  $('#langBtn').addEventListener('click', () => {
    setLang(lang === 'id' ? 'en' : 'id');
    refreshWa();
  });

  $('#themeBtn').addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  /* ===== SCROLL REVEAL ===== */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: .12 });

  $$('.reveal').forEach(el => io.observe(el));

})();

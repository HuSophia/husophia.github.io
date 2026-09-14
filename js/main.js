(function () {
  'use strict';

  /* ============================================================
     1. THEME TOGGLE
     ============================================================ */
  const themeButtons = document.querySelectorAll('.theme-btn');
  const body = document.body;

  function setTheme(themeName) {
    body.setAttribute('data-theme', themeName);
    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
    try {
      localStorage.setItem('personalSiteTheme', themeName);
    } catch (e) {
      /* localStorage unavailable — ignore */
    }
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  const savedTheme = (() => {
    try { return localStorage.getItem('personalSiteTheme'); }
    catch (e) { return null; }
  })();

  if (savedTheme && ['sage', 'chiffon', 'lavender', 'mistblue'].includes(savedTheme)) {
    setTheme(savedTheme);
  } else {
    setTheme('sage');
  }

  /* ============================================================
     2. SCROLL SPY — highlight sidebar link for visible section
     ============================================================ */
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.25;
    let activeIndex = 0;

    sections.forEach((section, index) => {
      if (scrollPosition >= section.offsetTop) {
        activeIndex = index;
      }
    });

    navLinks.forEach((link, index) => {
      link.classList.toggle('active', index === activeIndex);
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();

  /* ============================================================
     3. SMOOTH SCROLL for nav links
     ============================================================ */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
     4. PUBLICATIONS
     ============================================================ */
  const publicationsData = [
    {
      title: 'Leverage-FLARE: Coherence-Aware Sampling for Epistemic Uncertainty in Diffusion Models',
      authors: 'Hu, S. & Erichson, N. B.',
      venue: 'DOE SULI Technical Report, LBNL',
      status: 'Technical Report',
      year: 2026
    },
    {
      title: 'Deep Learning Correction and Automated Visualization of NOAA-20 ATMS and MiRS Satellite Data',
      authors: 'Hu, S.',
      venue: 'MiRS Technical Report, NOAA',
      status: 'Technical Report',
      year: 2022
    }
  ];

  const publicationList = document.getElementById('publicationList');

  if (publicationList) {
    publicationsData.forEach(pub => {
      const item = document.createElement('div');
      item.className = 'publication-item';

      const statusHtml = pub.status
        ? `<span class="pub-status">${pub.status}</span>`
        : '';

      item.innerHTML = `
        <div class="pub-icon"><i class="fas fa-file-alt"></i></div>
        <div class="pub-content">
          <h4>${pub.title}</h4>
          <p>${pub.authors} · <em>${pub.venue}</em></p>
          ${statusHtml}
        </div>
      `;
      publicationList.appendChild(item);
    });
  }

  /* ============================================================
     5. PROJECTS
     ============================================================ */
  const projectsData = [
    {
      title: '🧠 Leverage-FLARE',
      description: 'Interactive dashboard for interpreting diffusion model decisions using local surrogate models and attribution heatmaps over the reverse trajectory.',
      tags: ['Python', 'React', 'D3.js']
    },
    {
      title: '⚡ Leverage-Sampling Sampler',
      description: 'PyTorch library implementing leverage-score-guided timestep selection for DDPM and flow matching samplers. Reduces NFE by up to 40% at matched FID.',
      tags: ['PyTorch', 'Diffusers', 'CUDA']
    },
    {
      title: '🌿 Eco-Sense Kit',
      description: 'Low-power sensor network with on-device anomaly detection for soil and air quality, running quantized models on 8-bit microcontrollers.',
      tags: ['C++', 'TinyML', 'IoT']
    },
    {
      title: '📚 Paper-Arc',
      description: 'Visualization tool that maps citation networks and research trends for systematic literature reviews.',
      tags: ['GraphQL', 'Neo4j', 'D3.js']
    },
    {
      title: '🎨 Generative Art Studio',
      description: 'Creative coding experiments with procedural generation, flow-based animation, and interactive installations.',
      tags: ['p5.js', 'WebGL', 'Flow']
    },
    {
      title: '🔬 UQ Bench',
      description: 'Benchmark suite for uncertainty quantification in diffusion and flow matching models, with calibration and conformal prediction baselines.',
      tags: ['Python', 'PyTorch', 'Conformal']
    }
  ];

  const projectsGrid = document.getElementById('projectsGrid');

  if (projectsGrid) {
    projectsData.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';

      const tagsHtml = proj.tags
        .map(t => `<span class="tag">${t}</span>`)
        .join('');

      card.innerHTML = `
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        <div>${tagsHtml}</div>
      `;
      projectsGrid.appendChild(card);
    });
  }

  /* ============================================================
     6. TRAVEL GALLERY + LIGHTBOX
     ============================================================ */
  const travelImages = [
    { src: 'images/travel1.jpg', caption: 'Misty mountains · Nepal' },
    { src: 'images/travel2.jpg', caption: 'Sunset beach · Thailand' },
    { src: 'images/travel3.jpg', caption: 'Old town · Prague' },
    { src: 'images/travel4.jpg', caption: 'Redwood forest · California' },
    { src: 'images/travel5.jpg', caption: 'Historic arch · Rome' },
    { src: 'images/travel6.jpg', caption: 'Glacier lake · Iceland' }
  ];

  const galleryGrid = document.getElementById('galleryGrid');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightbox');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const imageCounter = document.getElementById('imageCounter');

  let currentIndex = 0;

  // Build gallery
  if (galleryGrid) {
    travelImages.forEach((img, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `View ${img.caption}`);

      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.caption;
      imgEl.loading = 'lazy';
      imgEl.onerror = function () {
        this.src = `https://via.placeholder.com/600x600?text=${encodeURIComponent(img.caption)}`;
      };

      const captionEl = document.createElement('div');
      captionEl.className = 'gallery-caption';
      captionEl.textContent = img.caption;

      item.appendChild(imgEl);
      item.appendChild(captionEl);

      item.addEventListener('click', () => openLightbox(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });

      galleryGrid.appendChild(item);
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    if (lightboxOverlay) lightboxOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const img = travelImages[currentIndex];
    if (!img) return;

    const imgEl = lightboxImage ? lightboxImage.querySelector('img') : null;
    if (imgEl) {
      imgEl.src = img.src;
      imgEl.alt = img.caption;
      imgEl.onerror = function () {
        this.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(img.caption)}`;
      };
    }
    if (lightboxCaption) lightboxCaption.textContent = img.caption;
    if (imageCounter) imageCounter.textContent = `${currentIndex + 1} / ${travelImages.length}`;
  }

  function closeLightbox() {
    if (lightboxOverlay) lightboxOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % travelImages.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + travelImages.length) % travelImages.length;
    updateLightbox();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('show')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  });

  /* ============================================================
     7. FOOTER YEAR
     ============================================================ */
  const footer = document.querySelector('.footer-note p');
  if (footer) {
    footer.innerHTML = footer.innerHTML.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
  }

})();

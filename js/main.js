(function () {
  'use strict';

  /* ============================================================
     1. THEME TOGGLE — beige/brown (light) / sage/cream (dark)
     ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    if (themeIcon) {
      themeIcon.className = themeName === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    try {
      localStorage.setItem('personalSiteTheme', themeName);
    } catch (e) {
      /* localStorage unavailable — ignore */
    }
  }

  function toggleTheme() {
    const current = document.body.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  const savedTheme = (() => {
    try { return localStorage.getItem('personalSiteTheme'); }
    catch (e) { return null; }
  })();

  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

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
     5. PROJECTS — NOAA internship + current research
     ============================================================ */
  const projectsData = [
    {
      title: '🧠 Leverage-FLARE',
      description: 'Coherence-aware sampling framework for epistemic uncertainty in diffusion models. Combines leverage-score-based timestep selection with conformal prediction to produce calibrated, distribution-free uncertainty estimates over generated samples.',
      tags: ['PyTorch', 'Diffusers', 'UQ']
    },
    {
      title: '🌀 tcmirs',
      description: 'Python package for automated merging of IBTrACS tropical cyclone tracks with MiRS satellite retrievals. Handles temporal and geospatial granule matching, longitude normalization, and produces analysis-ready netCDF files. Reduced manual data-prep to under 2 minutes for Hurricane Ida (2021).',
      tags: ['Python', 'Xarray', 'Shapely', 'netCDF']
    },
    {
      title: '🗺️ tc-viz',
      description: 'Comprehensive tropical cyclone lifecycle visualization tool, now used operationally by NOAA scientists. Renders storm tracks with Saffir-Simpson category coloring, four-quadrant wind radii (34/50/64 kt), and dynamic annotations for time, wind speed, and pressure.',
      tags: ['Cartopy', 'Matplotlib', 'Geospatial']
    },
    {
      title: '🌊 sst-bias-dnn',
      description: 'Deep neural network for correcting systematic SST retrieval biases in NOAA-20 ATMS brightness temperatures. Contributed to the codebase supporting a published method (Liu et al., IEEE JSTARS). Reduced SST retrieval error from 3.22 K to 2.15 K (~30% improvement).',
      tags: ['TensorFlow', 'Keras', 'Remote Sensing']
    },
    {
      title: '🌐 ParaView 3D Visualization',
      description: 'ParaView-based workflow for interactive 3D visualization of atmospheric hydrometeors (graupel, rain) in tropical cyclones. Produces isosurfaces colored by temperature profile to reveal vertical precipitation structure.',
      tags: ['ParaView', 'Python', '3D Viz']
    },
    {
      title: '🔬 MiRS Algorithm Verification',
      description: 'Statistical verification of independent MiRS processing streams (STAR vs. NCCF) across PTemp, TPW, Tskin, RR, and surface emissivity. Confirmed near-unity correlation and slope, validating algorithm consistency across pipelines.',
      tags: ['SciPy', 'Statistics', 'Validation']
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
    { src: 'images/travel5.jpg', caption: 'SF Bay Views · Berkeley' },
    { src: 'images/travel6.jpg', caption: 'Tidal Basin · DC' }
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

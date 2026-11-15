/* ===================================
   Ali Fathi — Portfolio
   Main Application
=================================== */

(function () {
  'use strict';

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getProjectById(id) {
    return PROJECTS.find(p => p.id === id) || null;
  }

  /* ===== Preloader ===== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('done');
        setTimeout(() => preloader.remove(), 1200);
      }, 2400);
    });
    // Safety fallback
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('done')) {
        preloader.classList.add('done');
        setTimeout(() => preloader.remove(), 1200);
      }
    }, 4000);
  }

  /* ===== Custom cursor ===== */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cursorDot.style.left = tx + 'px';
      cursorDot.style.top = ty + 'px';
    });

    function animateCursor() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, [data-cursor="hover"], .work-item, .case-nav-link').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ===== Navbar scroll ===== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ===== Mobile menu ===== */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      menuToggle?.classList.remove('active');
    });
  });

  /* ===== Animated counters ===== */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(target * ease);
      el.textContent = String(val).padStart(2, '0');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = String(target).padStart(2, '0');
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && e.target.dataset.count) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ============================================================
     HOME — Render work list
  ============================================================ */
  const workList = document.getElementById('workList');
  if (workList) {
    workList.innerHTML = PROJECTS.map(p => `
      <a href="case-study.html?project=${encodeURIComponent(p.id)}" class="work-item" data-cursor="hover">
        <span class="work-item-index">${escapeHtml(p.index)}</span>
        <div class="work-item-main">
          <div class="work-item-icon">${p.icon}</div>
          <h3>${escapeHtml(p.name)}</h3>
          <span class="work-item-sub">${escapeHtml(p.nameAr)}</span>
        </div>
        <div class="work-item-tags">
          ${p.tech.slice(0, 3).map(t => `<span>${escapeHtml(t)}</span>`).join('')}
        </div>
        <span class="work-item-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>
    `).join('');

    // Add hover cursor listeners to dynamically created items
    if (cursor) {
      workList.querySelectorAll('.work-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    }
  }

  /* ============================================================
     WORK PAGE — Render full list
  ============================================================ */
  const projectsList = document.getElementById('projectsList');
  if (projectsList) {
    projectsList.innerHTML = PROJECTS.map(p => `
      <a href="case-study.html?project=${encodeURIComponent(p.id)}" class="work-item" data-cursor="hover">
        <span class="work-item-index">${escapeHtml(p.index)}</span>
        <div class="work-item-main">
          <div class="work-item-icon">${p.icon}</div>
          <h3>${escapeHtml(p.name)}</h3>
          <span class="work-item-sub">${escapeHtml(p.nameAr)} · ${escapeHtml(p.year)}</span>
        </div>
        <div class="work-item-tags">
          ${p.tech.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
        </div>
        <span class="work-item-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>
    `).join('');

    if (cursor) {
      projectsList.querySelectorAll('.work-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    }
  }

  /* ============================================================
     CASE STUDY
  ============================================================ */
  const caseMain = document.getElementById('caseMain');
  if (caseMain) {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    const project = getProjectById(projectId);
    const notFound = document.getElementById('caseNotFound');

    if (!project) {
      if (notFound) notFound.style.display = 'block';
    } else {
      document.title = `${project.name} — Case Study | Ali Fathi`;

      const currentIndex = PROJECTS.findIndex(p => p.id === projectId);
      const prev = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
      const next = PROJECTS[(currentIndex + 1) % PROJECTS.length];

      caseMain.innerHTML = `
        <header class="case-header">
          <div class="case-eyebrow">
            <a href="work.html" style="color:inherit;">Work</a>
            <span style="margin:0 10px;">/</span>
            <span>Case Study ${escapeHtml(project.index)}</span>
          </div>
          <h1 class="case-title">${escapeHtml(project.name)}</h1>
          <p class="case-tagline">${escapeHtml(project.tagline)}</p>
          <div class="case-meta">
            <div class="case-meta-item">
              <span class="case-meta-label">Year</span>
              <span class="case-meta-value">${escapeHtml(project.year)}</span>
            </div>
            <div class="case-meta-item">
              <span class="case-meta-label">Role</span>
              <span class="case-meta-value">Design & Development</span>
            </div>
            <div class="case-meta-item">
              <span class="case-meta-label">Stack</span>
              <span class="case-meta-value">${project.tech.length} technologies</span>
            </div>
            <div class="case-meta-item">
              <span class="case-meta-label">Type</span>
              <span class="case-meta-value">Personal Project</span>
            </div>
          </div>
        </header>

        <div class="case-body">
          <aside class="case-body-side">
            Case Study<br>${escapeHtml(project.index)} / 05
          </aside>
          <div>
            <section class="case-section">
              <h2>The Challenge</h2>
              <p>${escapeHtml(project.challenge)}</p>
            </section>

            <section class="case-section">
              <h2>The Solution</h2>
              <p>${escapeHtml(project.solution)}</p>
            </section>

            <section class="case-section">
              <h2>What Was Built</h2>
              <ul>
                ${project.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
              </ul>
            </section>

            <section class="case-section">
              <h2>Tech Stack</h2>
              <div class="case-tech-grid">
                ${project.tech.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
              </div>
            </section>

            <section class="case-section">
              <h2>Key Highlight</h2>
              <p>${escapeHtml(project.highlight)}</p>
            </section>

            <div class="case-actions">
              <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener" class="btn btn-primary" data-cursor="hover">
                View Live Site
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H8M17 7v9" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
              <a href="work.html" class="btn btn-ghost" data-cursor="hover">← All Projects</a>
            </div>
          </div>
        </div>

        <nav class="case-nav">
          <a href="case-study.html?project=${encodeURIComponent(prev.id)}" class="case-nav-link" data-cursor="hover">
            <small>← Previous</small>
            <strong>${escapeHtml(prev.name)}</strong>
          </a>
          <a href="case-study.html?project=${encodeURIComponent(next.id)}" class="case-nav-link" data-cursor="hover">
            <small>Next →</small>
            <strong>${escapeHtml(next.name)}</strong>
          </a>
        </nav>
      `;

      // Attach cursor listeners to new elements
      if (cursor) {
        caseMain.querySelectorAll('a, button, [data-cursor="hover"]').forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
      }
    }
  }

  /* ===== Smooth scroll anchors ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===== Scroll reveal ===== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ===== Parallax orbs ===== */
  if (window.matchMedia('(pointer: fine)').matches) {
    const orbs = document.querySelectorAll('.orb');
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

})();
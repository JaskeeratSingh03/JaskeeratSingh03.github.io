/* ==========================================================================
   Portfolio — main.js
   - Mobile nav toggle
   - Sticky-nav shadow on scroll
   - Scroll-reveal animations (IntersectionObserver)
   - Footer year
   - Scroll progress bar
   - Smooth in-page anchor scrolling
   - Enderman-style purple particle effect on hover
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- 1. Mobile nav toggle ----- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (nav && navToggle && navMenu) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 720) closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (
        nav.classList.contains('is-open') &&
        !nav.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ----- 2. Sticky-nav shadow + scroll progress on scroll ----- */
  const progressBar = document.getElementById('scrollProgress');

  const onScroll = () => {
    if (nav) {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    if (progressBar) {
      const max =
        (document.documentElement.scrollHeight || document.body.scrollHeight) -
        window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- 3. Smooth in-page anchor scrolling ----- */
  // Enhances the native CSS smooth scroll with a manual easing animation
  // so the feel is consistent across browsers.
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const smoothScrollTo = (targetY, duration = 700) => {
    const startY = window.scrollY || window.pageYOffset;
    const diff = targetY - startY;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, startY + diff * eased);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const rect = target.getBoundingClientRect();
      const targetY = rect.top + window.scrollY - 70; // account for sticky nav
      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
      } else {
        smoothScrollTo(targetY, 720);
      }
      // Update URL hash without jumping
      history.replaceState(null, '', href);
    });
  });

  /* ----- 4. Scroll-reveal animations ----- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ----- 5. Footer year ----- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ----- 6. Enderman-style purple particle effect on hover ----- */
  // Spawns small purple particles around the cursor while it hovers
  // interactive elements (buttons, cards, chips, nav links, etc.).
  // Particles drift upward with random spread and fade out — reminiscent
  // of the purple ambient particles that trail the Enderman in Minecraft.
  (function setupParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Skip on touch-only devices and for users who prefer reduced motion
    const isTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || prefersReducedMotion) return;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;

    const resize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const HOVER_SELECTOR = [
      '.btn',
      '.card',
      '.chip',
      '.timeline-card',
      '.nav-menu a',
      '.card-link',
      '.cert-card',
    ].join(',');

    const PURPLE_HUES = [270, 285, 295, 310, 260]; // varied purples

    const particles = [];
    const MAX_PARTICLES = 220;

    const rand = (min, max) => Math.random() * (max - min) + min;

    const spawnBurst = (x, y, intensity = 1) => {
      const count = Math.min(6, Math.floor(3 * intensity));
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) break;
        const angle = rand(-Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9); // upward cone
        const speed = rand(0.6, 1.8) * intensity;
        particles.push({
          x: x + rand(-6, 6),
          y: y + rand(-4, 4),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - rand(0.3, 0.9), // biased upward
          life: rand(0.7, 1.2),     // seconds
          age: 0,
          size: rand(2.5, 5.5),
          hue: PURPLE_HUES[(Math.random() * PURPLE_HUES.length) | 0],
        });
      }
    };

    let hovering = false;
    let lastEmit = 0;

    document.addEventListener('mousemove', (e) => {
      const target = e.target;
      const isInteractive =
        target instanceof Element && target.closest(HOVER_SELECTOR);
      hovering = isInteractive;
      if (isInteractive) {
        const now = performance.now();
        // throttle emission ~ every 16ms
        if (now - lastEmit > 16) {
          spawnBurst(e.clientX, e.clientY, 1);
          lastEmit = now;
        }
      }
    });

    document.addEventListener('mouseleave', () => {
      hovering = false;
    });

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); // clamp big frame gaps
      last = now;

      ctx.clearRect(0, 0, w, h);

      // additive blending for a glow feel
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          particles.splice(i, 1);
          continue;
        }
        // physics: drift + slight gravity + drag
        p.vy += 0.25 * dt; // mild downward pull so they slow & fall
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        const t = p.age / p.life;
        const alpha = (1 - t) * 0.85;
        const r = p.size * (1 - t * 0.4);

        // soft glow halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 95%, 70%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(${p.hue}, 90%, 55%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, 45%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fill();

        // bright core
        ctx.fillStyle = `hsla(${p.hue}, 100%, 88%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })();
})();

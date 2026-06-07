/*!
 * Filter.im — Complete Animation Script
 * GSAP 3.12 + ScrollTrigger + Lenis
 */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────────────────────
     PAGE DETECTION
  ───────────────────────────────────────────────────────── */
  const path = window.location.pathname;
  const PAGE = path.includes('studio') ? 'studio'
             : path.includes('connect') ? 'connect'
             : 'index';

  /* ─────────────────────────────────────────────────────────
     LENIS SMOOTH SCROLL
  ───────────────────────────────────────────────────────── */
  let lenis;

  function initLenis() {
    lenis = new Lenis({
      duration: 1.1,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ─────────────────────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────────────────────── */
  function initCursor() {
    const el = document.getElementById('cursor');
    if (!el) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function tick() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      gsap.set(el, { x: cx, y: cy });
      requestAnimationFrame(tick);
    }
    tick();

    // Expand on interactive elements
    const hoverEls = () => document.querySelectorAll('a, button, .highlight-word, .archive-card, .cr-card, .spotlight-title-item h1, .cr-arrow, .cr-prog-dot, .spotlight-dot');
    function bindHover() {
      hoverEls().forEach(node => {
        node.addEventListener('mouseenter', () => el.classList.add('expanded'));
        node.addEventListener('mouseleave', () => el.classList.remove('expanded'));
      });
    }
    bindHover();
    // rebind after animations settle
    setTimeout(bindHover, 4000);
  }

  /* ─────────────────────────────────────────────────────────
     GRID REVEAL
  ───────────────────────────────────────────────────────── */
  function initGrid() {
    gsap.to('.grid-overlay', {
      opacity: 1, duration: 1.5,
      delay: PAGE === 'index' ? 3.5 : 0.6
    });
  }

  /* ─────────────────────────────────────────────────────────
     COOKIE
  ───────────────────────────────────────────────────────── */
  function initCookie() {
    const notice = document.getElementById('cookieNotice');
    const btn = document.getElementById('cookieBtn');
    if (!notice || !btn) return;
    const accepted = localStorage.getItem('fc-cookies');
    if (!accepted) {
      setTimeout(() => {
        gsap.to(notice, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        notice.classList.add('visible');
      }, PAGE === 'index' ? 5000 : 1200);
    }
    btn.addEventListener('click', () => {
      localStorage.setItem('fc-cookies', '1');
      gsap.to(notice, {
        opacity: 0, y: 12, duration: 0.4,
        onComplete: () => notice.remove()
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     MENU  (hamburger → clip-path reveal)
  ───────────────────────────────────────────────────────── */
  function initMenu() {
    const toggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('menuOverlay');
    const menu = document.getElementById('menu');
    if (!toggle || !menu) return;

    const barTop    = toggle.querySelector('[data-position="top"]');
    const barBot    = toggle.querySelector('[data-position="bottom"]');
    const linkSpans = menu.querySelectorAll('.menu-link-item a span');
    const labels    = menu.querySelectorAll('.menu-info-label');
    const values    = menu.querySelectorAll('.menu-info-value');

    let open = false;

    // Initial state — menu hidden behind clip
    gsap.set(menu, { clipPath: 'inset(0 0 100% 0 round 0px)', visibility: 'hidden' });
    gsap.set(linkSpans, { y: '108%' });
    gsap.set([labels, values], { y: 20, opacity: 0 });

    function openMenu() {
      open = true;
      document.body.classList.add('menu-open');
      menu.setAttribute('aria-hidden', 'false');

      if (overlay) overlay.classList.add('open');

      // Clip reveal
      gsap.set(menu, { visibility: 'visible' });
      gsap.to(menu, {
        clipPath: 'inset(0 0 0% 0 round 0px)',
        duration: 0.85,
        ease: 'power4.inOut'
      });

      // Hamburger → X
      gsap.to(barTop, { rotation: 45, y: 4.5, duration: 0.38, ease: 'power2.inOut' });
      gsap.to(barBot, { rotation: -45, y: -4.5, duration: 0.38, ease: 'power2.inOut' });

      // Links fly in
      gsap.to(linkSpans, {
        y: '0%', duration: 0.75,
        stagger: 0.08, ease: 'power4.out', delay: 0.25
      });
      // Meta text fade up
      gsap.to(labels, {
        y: 0, opacity: 1, duration: 0.55,
        stagger: 0.04, ease: 'power3.out', delay: 0.4
      });
      gsap.to(values, {
        y: 0, opacity: 1, duration: 0.5,
        stagger: 0.03, ease: 'power3.out', delay: 0.48
      });
    }

    function closeMenu() {
      open = false;
      document.body.classList.remove('menu-open');
      menu.setAttribute('aria-hidden', 'true');

      if (overlay) overlay.classList.remove('open');

      // Links fade out fluidly
      gsap.to(linkSpans, {
        opacity: 0, duration: 0.5,
        stagger: -0.04, ease: 'power2.inOut'
      });
      gsap.to([labels, values], {
        y: 20, opacity: 0, duration: 0.4,
        stagger: -0.02, ease: 'power3.inOut'
      });

      // Clip hide with a slight delay
      gsap.to(menu, {
        clipPath: 'inset(0 0 100% 0 round 0px)',
        duration: 0.7, ease: 'power4.inOut', delay: 0.2,
        onComplete: () => {
          gsap.set(menu, { visibility: 'hidden' });
          gsap.set(linkSpans, { y: '108%', opacity: 1 });
        }
      });

      // X → hamburger
      gsap.to(barTop, { rotation: 0, y: 0, duration: 0.38, ease: 'power2.inOut' });
      gsap.to(barBot, { rotation: 0, y: 0, duration: 0.38, ease: 'power2.inOut' });
    }

    toggle.addEventListener('click', () => open ? closeMenu() : openMenu());

    // Close on overlay click
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && open) closeMenu();
    });

    // Close menu links on click (navigate)
    menu.querySelectorAll('.menu-link-item a').forEach(link => {
      link.addEventListener('click', () => { if (open) closeMenu(); });
    });
  }

  /* ─────────────────────────────────────────────────────────
     LOADER  (index only)
  ───────────────────────────────────────────────────────── */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    if (PAGE !== 'index') {
      gsap.set(loader, { autoAlpha: 0 });
      return;
    }

    const tl = gsap.timeline();
    const d0 = document.getElementById('d0');
    const d1 = document.getElementById('d1');
    const d2 = document.getElementById('d2');
    const word1 = document.getElementById('loaderWord1');
    const word2 = document.getElementById('loaderWord2');
    const divider = document.getElementById('loaderDivider');
    const blockL = document.getElementById('loaderBlockL');
    const blockR = document.getElementById('loaderBlockR');

    // Reset Hero
    const heroH3 = document.getElementById('heroH3');
    const heroP  = document.getElementById('heroP');
    const heroBtns = document.getElementById('heroButtons')?.children;
    const heroLogos= document.getElementById('heroLogos');
    const heroImg = document.querySelector('.hero-img-wrapper');
    gsap.set([heroH3, heroP, heroBtns, heroLogos, heroImg], { autoAlpha: 0, y: 30 });
    if(heroImg) gsap.set(heroImg, { scale: 0.9, y: 0 });

    // Set initial word state
    gsap.set([word1?.querySelector('h1'), word2?.querySelector('h1')], { y: '110%' });

    // ── Counter animation ──
    let count = 0;
    const target = 100;
    const startTime = performance.now();
    const duration = 2200; // ms

    function updateCounter() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      let count = Math.round(eased * target);
      const counterText = document.getElementById('counterText');
      if (counterText) counterText.textContent = count + '%';
      if (progress < 1) requestAnimationFrame(updateCounter);
    }
    requestAnimationFrame(updateCounter);

    // ── Divider grow ──
    gsap.to(divider, {
      height: 72, duration: 1.2, delay: 0.3, ease: 'power2.inOut'
    });

    // Intro Words
    tl.to([word1?.querySelector('h1'), word2?.querySelector('h1')], { y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1 });
    
    // Divider
    tl.to(divider, { scaleY: 1, duration: 1, ease: 'power3.inOut' }, '-=0.8');



    // Words separate
    tl.to(word1, { x: '-50vw', duration: 1, ease: 'power4.inOut' }, '+=0.2');
    tl.to(word2, { x: '50vw', duration: 1, ease: 'power4.inOut' }, '<');
    tl.to(divider, { scaleY: 0, duration: 0.8, ease: 'power3.inOut' }, '<');
    tl.to('.loader-counter', { autoAlpha: 0, duration: 0.5 }, '<');

    // Open blocks
    tl.to(blockL, { scaleY: 0, duration: 1, ease: 'power4.inOut' }, '-=0.4');
    tl.to(blockR, { scaleY: 0, duration: 1, ease: 'power4.inOut' }, '<');
    tl.set(loader, { display: 'none' });

    // Hero Reveal
    if(heroImg) tl.to(heroImg, { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power3.out' }, '-=0.5');
    tl.to([heroH3, heroP], { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, '-=1');
    if(heroBtns) tl.to(heroBtns, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.8');
    if(heroLogos) tl.to(heroLogos, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
    
    // Grid reveal & logo text
    const logoTxt = document.querySelector('.logo-text');
    if (logoTxt) {
      tl.to(logoTxt, { opacity: 1, width: 'auto', duration: 0.9, ease: 'power3.out' }, '-=1');
    }
    tl.to('.grid-overlay', { opacity: 1, duration: 1.5 }, '-=1');

    // Init scroll animations after hero is done (~1.5s)
    tl.add(() => {
      initWhatWeDo();
      initFeaturedProjects();
      initSpotlight();
      initReviews();
      initGalleryCallout();
      ScrollTrigger.refresh();
    });
  }

  /* ─────────────────────────────────────────────────────────
     WHAT WE DO  — hover cards + background swap
  ───────────────────────────────────────────────────────── */
  function initWhatWeDo() {
    const section   = document.getElementById('whatWeDo');
    const h1        = document.getElementById('wwdH1');
    const bgVideos  = section?.querySelectorAll('.wwd-bg-video');
    const cards     = document.getElementById('wwdHoverCards')?.querySelectorAll('.wwd-hover-card');
    const words     = section?.querySelectorAll('.highlight-word');

    if (!section || !h1) return;

    // ScrollTrigger: reveal h1
    gsap.set(h1, { autoAlpha: 0, y: 55 });
    ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      onEnter: () => gsap.to(h1, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power4.out' })
    });

    if (!words || !cards) return;

    // Track mouse position relative to section
    let mx = 0, my = 0;
    let activeCard = null;
    let cardTargetX = 0, cardTargetY = 0;
    let cardCurX = 0, cardCurY = 0;

    section.addEventListener('mousemove', e => {
      const r = section.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (activeCard) {
        cardTargetX = mx;
        cardTargetY = my;
      }
    });

    // Smooth card follow
    (function followCard() {
      cardCurX += (cardTargetX - cardCurX) * 0.1;
      cardCurY += (cardTargetY - cardCurY) * 0.1;
      if (activeCard) {
        gsap.set(activeCard, { x: cardCurX - 130, y: cardCurY - 85 });
      }
      requestAnimationFrame(followCard);
    })();

    words.forEach((word, i) => {
      word.addEventListener('mouseenter', () => {
        // Swap background
        bgVideos?.forEach((v, j) => {
          gsap.to(v, { opacity: j === i % bgVideos.length ? 0.35 : 0, duration: 0.5 });
        });

        // Show hover card
        const card = cards[i % cards.length];
        if (card) {
          cards.forEach(c => gsap.to(c, { opacity: 0, scale: 0.95, duration: 0.25 }));
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
          activeCard = card;
          cardTargetX = mx;
          cardTargetY = my;
          cardCurX = mx;
          cardCurY = my;
        }
      });

      word.addEventListener('mouseleave', () => {
        bgVideos?.forEach(v => gsap.to(v, { opacity: 0, duration: 0.4 }));
        cards.forEach(c => gsap.to(c, { opacity: 0, scale: 0.95, duration: 0.25 }));
        activeCard = null;
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     FEATURED PROJECTS  — scroll reveal + parallax
  ───────────────────────────────────────────────────────── */
  function initFeaturedProjects() {
    const tagline = document.getElementById('fpTagline');
    const heading = document.getElementById('fpHeading');
    const cards   = document.querySelectorAll('.fp-card');

    [tagline, heading].forEach(el => {
      if (!el) return;
      gsap.set(el, { autoAlpha: 0, y: 32 });
      ScrollTrigger.create({
        trigger: el, start: 'top 82%',
        onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' })
      });
    });

    cards.forEach(card => {
      // Fade in and out as the card enters and leaves the viewport
      gsap.fromTo(card, 
        { autoAlpha: 0.1, y: 50 },
        { 
          autoAlpha: 1, 
          y: 0, 
          scrollTrigger: {
            trigger: card, 
            start: "top 85%", 
            end: "top 50%", 
            scrub: true 
          } 
        }
      );
      
      gsap.fromTo(card,
        { autoAlpha: 1 },
        {
          autoAlpha: 0.1, 
          y: -50,
          scrollTrigger: {
            trigger: card,
            start: "bottom 50%",
            end: "bottom 15%",
            scrub: true
          }
        }
      );

      // Parallax image scale
      const media = card.querySelector('.fp-card-media');
      if (media) {
        gsap.fromTo(media,
          { scale: 1.06 },
          { scale: 1, ease: 'none',
            scrollTrigger: {
              trigger: card, start: 'top bottom', end: 'bottom top', scrub: 2
            }
          }
        );
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     SPOTLIGHT  — native scroll-driven project showcase
  ───────────────────────────────────────────────────────── */
  function initSpotlight() {
    const section   = document.getElementById('spotlight');
    if (!section) return;

    const titlesList = section.querySelector('.spotlight-titles-list');
    const titles    = section.querySelectorAll('.spotlight-title-item h1');
    const imgs      = section.querySelectorAll('.spotlight-img');
    const bgs       = section.querySelectorAll('.spotlight-bg-item');
    const strTop    = section.querySelector('.spotlight-string-top');
    const strBot    = section.querySelector('.spotlight-string-bottom');
    const count     = titles.length;

    if (!count) return;

    // Set initial position
    if (titles[0]) {
      const itemH = titles[0].parentElement.offsetHeight;
      gsap.set(titlesList, { y: -(itemH / 2) });
    }

    // Natural entry and exit fade
    const contentWrapper = section.querySelector('.spotlight-content-wrapper');
    if (contentWrapper) {
      gsap.fromTo(contentWrapper, 
        { opacity: 0 }, 
        { 
          opacity: 1, 
          ease: "none", 
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 30%",
            scrub: true
          }
        }
      );
      
      // We also want an exit fade
      // The section is pinned for totalScroll.
      // We can use a separate scroll trigger that starts when the pin ends.
    }

    // Pin the section and scrub the titles
    const totalScroll = count * 80; // Decreased to 80vh per item for higher sensitivity and speed
    
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${totalScroll}%`,
      pin: true,
      scrub: 1, // Decreased scrub smoothing for faster response
      onUpdate: self => {
        const p = self.progress;
        
        // Calculate float index for smooth transitions
        const floatIdx = p * (count - 1);
        let activeIdx = Math.round(floatIdx);
        
        // Update active classes for texts and backgrounds
        titles.forEach((t, i) => t.classList.toggle('active', i === activeIdx));
        if (bgs.length) {
          bgs.forEach((bg, i) => bg.classList.toggle('active', i === activeIdx));
        }

        // Vertical carousel for PIP images
        imgs.forEach((img, i) => {
          const dist = i - floatIdx;
          const gap = 280; // 220px image height + 60px padding
          const yOffset = dist * gap;
          
          // Continuous smooth interpolation for scale and opacity
          const scale = Math.max(0.7, 1 - (Math.abs(dist) * 0.2));
          const opacity = Math.max(0, 1 - (Math.abs(dist) * 0.6));
          
          gsap.to(img, { 
            y: yOffset, 
            scale: scale, 
            opacity: opacity, 
            duration: 0.1, 
            overwrite: 'auto' 
          });
        });
        
        // Translate the titles list up so the active item is centered
        if (titles[0]) {
          const itemH = titles[0].parentElement.offsetHeight;
          gsap.to(titlesList, { y: -(floatIdx * itemH) - (itemH / 2), duration: 0.1, overwrite: 'auto' });
          
          // Horizontally offset each title to match the 45-degree < angle
          titles.forEach((t, i) => {
            const distance = Math.abs(i - floatIdx);
            // Translate X based on distance from center.
            // For a 45 degree angle, the horizontal shift equals the vertical shift (distance * itemH)
            const offsetX = distance * itemH; 
            gsap.to(t, { x: offsetX, duration: 0.1, overwrite: 'auto' });
          });
        }
        
        // Strings stretch horizontally based on progress
        const strW = 100 + (p * 60); // 100vw to 160vw
        gsap.to(strTop, { width: `${strW}vw`, duration: 0.1, overwrite: 'auto' });
        gsap.to(strBot, { width: `${strW}vw`, duration: 0.1, overwrite: 'auto' });
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     GALLERY CALLOUT  — Parallax images
  ───────────────────────────────────────────────────────── */
  function initGalleryCallout() {
    const section = document.getElementById('galleryCallout');
    if (!section) return;

    const images = section.querySelectorAll('.gallery-callout-img');
    images.forEach((img, i) => {
      const speed = 1 + (i * 0.5);
      gsap.fromTo(img, 
        { y: 150 }, 
        { y: -150, ease: 'none', scrollTrigger: {
          trigger: section, start: 'top bottom', end: 'bottom top', scrub: speed
        }}
      );
    });
  }

  /* ─────────────────────────────────────────────────────────
     REVIEWS CAROUSEL  — CSS Infinite Scroll
  ───────────────────────────────────────────────────────── */
  function initReviews() {
    const section   = document.getElementById('reviewsSection');
    const h2        = document.getElementById('reviewsH2');
    const track     = document.getElementById('crTrack');
    const viewport  = document.querySelector('.cr-viewport');
    const cards     = track?.querySelectorAll('.cr-card');

    if (!track || !viewport || !cards) return;

    // ── Heading blur-in ──
    if (h2) {
      gsap.set(h2, { opacity: 0, filter: 'blur(16px)', y: 20 });
      ScrollTrigger.create({
        trigger: h2, start: 'top 72%',
        onEnter: () => gsap.to(h2, {
          opacity: 1, filter: 'blur(0px)', y: 0,
          duration: 1.3, ease: 'power3.out'
        })
      });
    }

    // Cards reveal on initial load
    cards.forEach((card, i) => {
      // Only animate the first few cards to prevent massive delay
      if (i > 5) return;
      gsap.set(card, { autoAlpha: 0, y: 40 });
      ScrollTrigger.create({
        trigger: section, start: 'top 60%',
        onEnter: () => gsap.to(card, {
          autoAlpha: 1, y: 0, duration: 0.9,
          delay: i * 0.06, ease: 'power3.out'
        })
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     ARCHIVE  (studio page)
  ───────────────────────────────────────────────────────── */
  function initArchive() {
    const hero = document.querySelector('.archive-hero');
    if (hero) {
      gsap.set(hero.querySelectorAll('h1, p'), { autoAlpha: 0, y: 40 });
      gsap.to(hero.querySelectorAll('h1, p'), {
        autoAlpha: 1, y: 0, duration: 1, stagger: 0.15,
        ease: 'power3.out', delay: 0.5
      });
    }

    const cards = document.querySelectorAll('.archive-card');
    cards.forEach((card, i) => {
      gsap.set(card, { autoAlpha: 0, y: 45, scale: 0.97 });
      ScrollTrigger.create({
        trigger: card, start: 'top 92%',
        onEnter: () => gsap.to(card, {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.75,
          delay: (i % 4) * 0.06,
          ease: 'power3.out'
        })
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     CONNECT  (contact page)
  ───────────────────────────────────────────────────────── */
  function initConnect() {
    const year    = document.querySelector('.contact-year h1');
    const heading = document.querySelector('.contact-heading h1');
    const cta     = document.querySelector('.contact-cta');
    const media   = document.querySelector('.contact-media');
    const blocks  = document.querySelectorAll('.contact-info-block');

    if (year)    gsap.from(year,    { x: -50, autoAlpha: 0, duration: 1.2, delay: 0.4, ease: 'power3.out' });
    if (heading) gsap.from(heading, { y: 30,  autoAlpha: 0, duration: 1,   delay: 0.55, ease: 'power3.out' });
    if (cta)     gsap.from(cta,     { y: 20,  autoAlpha: 0, duration: 0.9, delay: 0.7,  ease: 'power3.out' });
    if (media)   gsap.from(media,   { scale: 1.05, autoAlpha: 0, duration: 1.2, delay: 0.45, ease: 'power3.out' });

    blocks.forEach((b, i) => {
      gsap.from(b, {
        x: -25, autoAlpha: 0, duration: 0.75,
        delay: 0.8 + i * 0.1, ease: 'power3.out'
      });
    });

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = Object.assign(document.createElement('textarea'), { value: text });
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     FOOTER  — scroll reveal
  ───────────────────────────────────────────────────────── */
  function initFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const h2    = footer.querySelector('.footer-left h2');
    const links = footer.querySelectorAll('.footer-right a');
    const socials = footer.querySelector('.footer-socials');

    if (h2) {
      gsap.set(h2, { autoAlpha: 0, y: 30 });
      ScrollTrigger.create({
        trigger: footer, start: 'top 82%',
        onEnter: () => gsap.to(h2, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' })
      });
    }
    if (links.length) {
      gsap.set(links, { autoAlpha: 0, y: 18 });
      ScrollTrigger.create({
        trigger: footer, start: 'top 82%',
        onEnter: () => gsap.to(links, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.1 })
      });
    }
  }

  /* ─────────────────────────────────────────────────────────
     LOGO TEXT REVEAL  (non-index pages: immediate)
  ───────────────────────────────────────────────────────── */
  function initLogoTextSubpage() {
    const lt = document.querySelector('.logo-text');
    if (!lt) return;
    gsap.to(lt, { opacity: 1, width: 'auto', duration: 0.9, delay: 0.5, ease: 'power3.out' });
  }

  /* ─────────────────────────────────────────────────────────
     INIT  — page router
  ───────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initMenu();
    initCookie();
    initFooter();

    if (PAGE === 'index') {
      initGrid();
      initLoader();
      // Note: hero reveal + scroll animations are chained inside loader timeline
    }

    if (PAGE === 'studio') {
      gsap.set('#loader', { autoAlpha: 0 });
      initLogoTextSubpage();
      initGrid();
      initLenis();
      initArchive();
    }

    if (PAGE === 'connect') {
      gsap.set('#loader', { autoAlpha: 0 });
      initLogoTextSubpage();
      initGrid();
      initLenis();
      initConnect();
    }

    // For index, Lenis starts after loader so scroll triggers don't fire prematurely
    if (PAGE === 'index') {
      // Lenis initialized inside revealHero → after loader exits (~3.8s)
      const loaderDuration = 3800;
      setTimeout(() => {
        initLenis();
        ScrollTrigger.refresh();
      }, loaderDuration);
    }
  });

})();

document.addEventListener('DOMContentLoaded', () => {
  // ── Hover Triggers Logic ──
  const triggers = document.querySelectorAll('.hover-trigger');
  const popup = document.getElementById('hoverPopup');
  const popupImg = document.getElementById('hoverPopupImg');

  if (popup && triggers.length > 0) {
    let activeTrigger = null;

    document.addEventListener('mousemove', (e) => {
      if (activeTrigger) {
        gsap.to(popup, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
    });

    triggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', (e) => {
        activeTrigger = trigger;
        const imgKey = trigger.getAttribute('data-hover');
        
        // Use placeholder media text mapping
        const imgMap = {
          'img-ambiciosas': 'Stadium Racing',
          'img-lanzan': 'Phone App',
          'img-crecen': 'Growth Chart',
          'img-lideran': 'Trophy'
        };
        popupImg.textContent = imgMap[imgKey] || 'Image';
        
        gsap.set(popup, { x: e.clientX, y: e.clientY });
        gsap.to(popup, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.5)'
        });
      });

      trigger.addEventListener('mouseleave', () => {
        activeTrigger = null;
        gsap.to(popup, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in'
        });
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const closeBtns = document.querySelectorAll('.menu-close-btn');
    const toggle = document.getElementById('menuToggle');
    if (closeBtns.length > 0 && toggle) {
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Trigger the menu toggle click programmatically to close it
                // Only if menu is open
                if (document.body.classList.contains('menu-open')) {
                    toggle.click();
                }
            });
        });
    }
});

// Hover Images for crystalline-text
document.addEventListener('DOMContentLoaded', () => {
  const crystalTexts = document.querySelectorAll('.crystalline-text');
  
  // Custom configuration for specific words
  const hoverConfigs = {
    "IA y el diseño": [
      { bg: "linear-gradient(135deg, #1a2a6c, #b21f1f)", bx: "-80px", by: "-100px", br: "-15deg", hx: "-100px", hy: "-120px", hr: "-8deg" },
      { bg: "linear-gradient(135deg, #22c1c3, #fdbb2d)", bx: "100px", by: "-30px", br: "15deg", hx: "130px", hy: "-50px", hr: "8deg" }
    ],
    "empresas más ambiciosas": [
      { bg: "linear-gradient(135deg, #8E2DE2, #4A00E0)", bx: "-50px", by: "-120px", br: "-10deg", hx: "-70px", hy: "-140px", hr: "-5deg" },
      { bg: "linear-gradient(135deg, #f12711, #f5af19)", bx: "120px", by: "40px", br: "20deg", hx: "150px", hy: "60px", hr: "12deg" },
      { bg: "linear-gradient(135deg, #00c6ff, #0072ff)", bx: "-120px", by: "20px", br: "-20deg", hx: "-150px", hy: "40px", hr: "-15deg" }
    ],
    "lanzan": [
      { bg: "linear-gradient(135deg, #ff9966, #ff5e62)", bx: "-60px", by: "-80px", br: "-12deg", hx: "-80px", hy: "-100px", hr: "-6deg" }
    ],
    "crecen": [
      { bg: "linear-gradient(135deg, #11998e, #38ef7d)", bx: "0px", by: "-100px", br: "5deg", hx: "0px", hy: "-130px", hr: "10deg" }
    ],
    "lideran": [
      { bg: "linear-gradient(135deg, #F09819, #EDDE5D)", bx: "80px", by: "-80px", br: "15deg", hx: "110px", hy: "-100px", hr: "20deg" }
    ],
    "QUÉ ES LO QUE HACEMOS": [
      { bg: "linear-gradient(135deg, #1a2a6c, #b21f1f)", bx: "-150px", by: "-50px", br: "-10deg", hx: "-180px", hy: "-60px", hr: "-5deg" },
      { bg: "linear-gradient(135deg, #22c1c3, #fdbb2d)", bx: "150px", by: "-50px", br: "10deg", hx: "180px", hy: "-60px", hr: "5deg" }
    ],
    "Discover": [
      { bg: "linear-gradient(135deg, #fc4a1a, #f7b733)", bx: "-60px", by: "-90px", br: "-15deg", hx: "-80px", hy: "-120px", hr: "-10deg" },
      { bg: "linear-gradient(135deg, #8E2DE2, #4A00E0)", bx: "60px", by: "-90px", br: "15deg", hx: "80px", hy: "-120px", hr: "10deg" }
    ]
  };

  // Default fallback if not defined
  const defaultConfig = [
    { bg: "linear-gradient(135deg, #333, #666)", bx: "-60px", by: "-80px", br: "-10deg", hx: "-80px", hy: "-100px", hr: "-5deg" }
  ];
  
  crystalTexts.forEach(el => {
    // Only apply if it doesn't already have images
    if(el.querySelector('.hover-imgs-wrapper')) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'hover-imgs-wrapper';
    
    const text = el.textContent.trim();
    const config = hoverConfigs[text] || defaultConfig;
    
    config.forEach((c) => {
      const img = document.createElement('div');
      img.className = 'hover-img';
      // Set CSS variables for positioning and rotation
      img.style.setProperty('--base-x', c.bx);
      img.style.setProperty('--base-y', c.by);
      img.style.setProperty('--base-r', c.br);
      img.style.setProperty('--hover-x', c.hx);
      img.style.setProperty('--hover-y', c.hy);
      img.style.setProperty('--hover-r', c.hr);
      
      img.innerHTML = `<div class="placeholder-media" style="background: ${c.bg}; border-radius: 2px;"></div>`;
      wrapper.appendChild(img);
    });
    
    // Ensure parent has position relative
    el.style.position = 'relative';
    el.style.display = 'inline-block';
    el.style.zIndex = '10';
    
    el.appendChild(wrapper);
  });
});

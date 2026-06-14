/* ============================================================
   atharva kokane — portfolio · shared behaviour
   GSAP + ScrollTrigger + Lenis. classic script (globals).
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarse = window.matchMedia('(pointer: coarse)').matches;
  var isSmall = window.innerWidth < 768;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  window.__heroProgress = 0;

  /* helper styles for word-split reveals */
  var st = document.createElement('style');
  st.textContent =
    '.wmask{display:inline-block;overflow:hidden;vertical-align:top;}' +
    '.winner{display:inline-block;will-change:transform;}';
  document.head.appendChild(st);

  /* ── Lenis smooth scroll ─────────────────────────────────── */
  var lenis = null;
  function initLenis() {
    if (reduced || isCoarse || !window.Lenis) return;
    lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4
    });
    window.lenis = lenis;
    if (ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ── anchor links via lenis ──────────────────────────────── */
  function wireAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -80 });
        else target.scrollIntoView();
      });
    });
  }

  /* ── nav: persistent, sliding active indicator ───────────── */
  function initNav() {
    var wrap = document.querySelector('.nav-links');
    if (!wrap) return;
    var ind = wrap.querySelector('.nav-indicator');
    var links = wrap.querySelectorAll('a');
    var active = wrap.querySelector('a.active') || links[0];
    function moveTo(el) {
      if (!ind || !el) return;
      var l = el.offsetLeft, w = el.offsetWidth;
      if (gsap && !reduced) gsap.to(ind, { x: l, width: w, duration: 0.45, ease: 'expo.out' });
      else { ind.style.transform = 'translateX(' + l + 'px)'; ind.style.width = w + 'px'; }
    }
    function reset() { moveTo(active); }
    links.forEach(function (a) { a.addEventListener('pointerenter', function () { moveTo(a); }); });
    wrap.addEventListener('pointerleave', reset);
    reset();
    setTimeout(reset, 350);          /* after webfont swap */
    window.addEventListener('load', reset);
    window.addEventListener('resize', reset);
  }

  /* ── back to top ─────────────────────────────────────────── */
  function initBackToTop() {
    document.querySelectorAll('[data-top]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* ── word splitter ───────────────────────────────────────── */
  function splitWords(el) {
    var text = el.textContent;
    el.textContent = '';
    text.split(/(\s+)/).forEach(function (tok) {
      if (tok === '') return;
      if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(tok)); return; }
      var mask = document.createElement('span'); mask.className = 'wmask';
      var inner = document.createElement('span'); inner.className = 'winner'; inner.textContent = tok;
      mask.appendChild(inner); el.appendChild(mask);
    });
    return el.querySelectorAll('.winner');
  }

  /* ── reveals ─────────────────────────────────────────────── */
  function initReveals() {
    if (reduced || !gsap || !ScrollTrigger) {
      document.querySelectorAll('[data-reveal],[data-split],[data-draw]').forEach(function (el) {
        el.style.opacity = 1; el.style.transform = 'none';
      });
      return;
    }

    /* word-split reveals */
    document.querySelectorAll('[data-split="words"]').forEach(function (el) {
      var words = splitWords(el);
      gsap.set(el, { opacity: 1 });
      gsap.set(words, { yPercent: 115 });
      gsap.to(words, {
        yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.05,
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    /* generic up / fade / line reveals */
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var kind = el.getAttribute('data-reveal');
      var delay = parseFloat(el.getAttribute('data-delay') || '0');
      if (kind === 'wipe') {
        gsap.fromTo(el,
          { opacity: 1, clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.out', delay: delay,
            scrollTrigger: { trigger: el, start: 'top 88%' } });
        return;
      }
      var fromVars = { opacity: 0 };
      if (kind === 'up' || kind === 'line') fromVars.y = kind === 'line' ? 16 : 28;
      gsap.fromTo(el, fromVars, {
        opacity: 1, y: 0, duration: 0.95, ease: 'expo.out', delay: delay,
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    /* line draws (horizontal rules scale in) */
    document.querySelectorAll('[data-draw]').forEach(function (el) {
      gsap.fromTo(el, { scaleX: 0 }, {
        scaleX: 1, duration: 1.1, ease: 'expo.out', transformOrigin: 'left center',
        scrollTrigger: { trigger: el, start: 'top 92%' }
      });
    });

    /* scrubbed parallax */
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-parallax')) || 40;
      gsap.fromTo(el, { y: -amt }, {
        y: amt, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ── pinned hero (drives 3D via window.__heroProgress) ───── */
  function initHeroScroll() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    if (reduced || !gsap || !ScrollTrigger) { window.__heroProgress = 0; return; }
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero, start: 'top top', end: isSmall ? '+=70%' : '+=145%',
        scrub: 0.5, pin: true, anticipatePin: 1,
        onUpdate: function (self) { window.__heroProgress = self.progress; }
      }
    });
    tl.to('.hero-name', { yPercent: -30, opacity: 0, ease: 'power1.in' }, 0)
      .to('.hero-id', { opacity: 0, y: -24, ease: 'none' }, 0)
      .to('.hero-bio', { opacity: 0, y: -24, ease: 'none' }, 0.04)
      .to('.hero-cue', { opacity: 0, ease: 'none' }, 0)
      .to('.reg', { opacity: 0, ease: 'none' }, 0);
  }

  /* ── manifesto: pinned scrubbed word reveal ──────────────── */
  function initManifesto() {
    var m = document.querySelector('.manifesto-text');
    if (!m) return;
    if (reduced || !gsap || !ScrollTrigger) { m.style.opacity = 1; return; }
    var words = splitWords(m);
    gsap.set(words, { opacity: 0.13 });
    gsap.to(words, {
      opacity: 1, ease: 'none', stagger: 0.4,
      scrollTrigger: {
        trigger: m.closest('.manifesto') || m,
        start: 'top top', end: isSmall ? '+=60%' : '+=130%', scrub: true, pin: true, anticipatePin: 1
      }
    });
  }

  /* ── scroll-velocity marquee ─────────────────────────────── */
  function initMarquee() {
    var track = document.querySelector('.marquee-track');
    if (!track || !gsap) return;
    if (reduced) return;
    var tween = gsap.to(track, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });
    var resetTO;
    function bump(v) {
      var ts = 1 + Math.min(Math.abs(v) / 6, 6);
      tween.timeScale(ts);
      clearTimeout(resetTO);
      resetTO = setTimeout(function () { gsap.to(tween, { timeScale: 1, duration: 0.8, overwrite: true }); }, 90);
    }
    if (lenis) lenis.on('scroll', function (e) { bump(e.velocity); });
    else {
      var ly = window.scrollY;
      window.addEventListener('scroll', function () { bump((window.scrollY - ly) * 0.5); ly = window.scrollY; });
    }
  }

  /* ── stack cloud scatter-in ──────────────────────────────── */
  function initStackCloud() {
    var chips = document.querySelectorAll('[data-stack]');
    if (!chips.length || !gsap) return;
    if (reduced) { gsap.set(chips, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }); return; }
    chips.forEach(function (c) {
      gsap.set(c, {
        opacity: 0, scale: 0.6,
        x: gsap.utils.random(-70, 70),
        y: gsap.utils.random(-50, 50),
        rotate: gsap.utils.random(-30, 30)
      });
    });
    gsap.to(chips, {
      opacity: 1, x: 0, y: 0, rotate: 0, scale: 1,
      duration: 0.7, ease: 'back.out(1.7)',
      stagger: { each: 0.025, from: 'random' },
      scrollTrigger: { trigger: '.stack-cloud', start: 'top 88%' }
    });
  }

  /* ── resume timeline draw ────────────────────────────────── */
  function initTimeline() {
    var line = document.querySelector('.tl-line');
    if (!line) return;
    if (reduced || !gsap || !ScrollTrigger) { line.style.transform = 'scaleY(1)'; return; }
    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1, ease: 'none', transformOrigin: 'top center',
      scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 80%', scrub: true }
    });
  }

  /* ── card pointer fx ─────────────────────────────────────── */
  function initCardFx() {
    document.querySelectorAll('[data-shine]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
    if (reduced) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointerenter', function () { card.style.transition = 'transform 0.08s linear, border-color 0.25s'; });
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(720px) rotateY(' + (x * 11) + 'deg) rotateX(' + (-y * 11) + 'deg) translateZ(6px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transition = 'transform 0.5s cubic-bezier(.22,1,.36,1), border-color 0.25s';
        card.style.transform = 'perspective(720px) rotateY(0) rotateX(0)';
      });
    });
  }

  /* ── magnetic ────────────────────────────────────────────── */
  function initMagnetic() {
    if (reduced || !gsap) return;
    document.querySelectorAll('[data-magnet]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.5, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* ── scroll progress (nav line + post bar) ───────────────── */
  function initProgress() {
    var bars = document.querySelectorAll('.nav-progress i, .progress-bar');
    if (!bars.length) return;
    function update(y) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (y / h) * 100 : 0;
      bars.forEach(function (b) { b.style.width = p + '%'; });
    }
    if (lenis) lenis.on('scroll', function (e) { update(e.scroll); });
    else window.addEventListener('scroll', function () { update(window.scrollY); });
    update(window.scrollY);
  }

  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ── hero name entrance ──────────────────────────────────── */
  function heroIntro() {
    var chars = document.querySelectorAll('.hero-name .ch');
    var tl = gsap.timeline();
    if (chars.length && !reduced) {
      gsap.set(chars, { yPercent: 115 });
      tl.to(chars, { yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.04 }, 0);
    }
    var bits = document.querySelectorAll('[data-hero-in]');
    if (bits.length) {
      if (reduced) { gsap.set(bits, { opacity: 1, y: 0 }); }
      else {
        gsap.set(bits, { opacity: 0, y: 18 });
        tl.to(bits, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12 }, 0.1);
      }
    }
    window.__heroRevealReady = true;
    window.dispatchEvent(new Event('hero:reveal'));
  }

  /* ── preloader ───────────────────────────────────────────── */
  var STATUS = ['initialising runtime', 'loading modules', 'compiling geometry', 'mounting interface', 'all systems go'];
  function runPreloader(done) {
    var pl = document.getElementById('preloader');
    if (!pl) { done(); return; }
    var seen = false;
    try { seen = sessionStorage.getItem('booted') === '1'; } catch (e) {}
    if (seen) {
      pl.style.display = 'none';
      document.querySelectorAll('.pl-curtain').forEach(function (c) { c.style.display = 'none'; });
      done();
      return;
    }
    try { sessionStorage.setItem('booted', '1'); } catch (e) {}
    if (reduced) { gsap.set(pl, { autoAlpha: 0, display: 'none' }); done(); return; }
    if (lenis) lenis.stop();
    var countEl = pl.querySelector('.pl-num');
    var statusEl = pl.querySelector('.pl-status b');
    var barEl = pl.querySelector('.pl-bar i');
    var counter = { v: 0 };
    var revealed = false;
    var finished = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      if (lenis) lenis.start();
      done();
    }
    function finish() {
      reveal();
      if (finished) return;
      finished = true;
      pl.style.display = 'none';
      document.querySelectorAll('.pl-curtain').forEach(function (c) { c.style.display = 'none'; });
      if (ScrollTrigger) ScrollTrigger.refresh();
    }
    setTimeout(finish, 3200); /* wall-clock safety if rAF throttled */

    var tl = gsap.timeline({
      onComplete: function () {
        var curtains = document.querySelectorAll('.pl-curtain');
        var out = gsap.timeline({ onComplete: finish });
        out.to(pl, { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, 0);
        if (curtains.length) out.fromTo(curtains, { yPercent: 100 }, { yPercent: -100, duration: 0.85, ease: 'expo.inOut', stagger: 0.04 }, 0);
        reveal(); /* start hero animation as soon as the curtains begin sliding away */
      }
    });
    tl.to(counter, {
      v: 100, duration: 0.6, ease: 'power2.inOut',
      onUpdate: function () {
        var n = Math.round(counter.v);
        if (countEl) countEl.textContent = ('00' + n).slice(-3);
        if (barEl) barEl.style.width = n + '%';
        var idx = Math.min(STATUS.length - 1, Math.floor(n / (100 / STATUS.length)));
        if (statusEl && statusEl.textContent !== STATUS[idx]) statusEl.textContent = STATUS[idx];
      }
    });
  }

  /* ── command palette (press / or ⌘K) ────────────────────── */
  function initCommandPalette() {
    var P = location.pathname.indexOf('/posts/') > -1 ? '../' : '';
    var go = function (u) { return function () { location.href = u; }; };
    var ext = function (u) { return function () { window.open(u, '_blank', 'noopener'); }; };
    var cmds = [
      { ic: '→', lb: 'home', hk: 'g h', run: go(P + 'index.html') },
      { ic: '→', lb: 'writing', hk: 'g w', run: go(P + 'blog.html') },
      { ic: '→', lb: 'resume', hk: 'g r', run: go(P + 'resume.html') },
      { ic: '→', lb: 'contact', hk: 'g c', run: go(P + 'contact.html') },
      { ic: '@', lb: 'email — atharvashashankk@vt.edu', hk: '', run: go('mailto:atharvashashankk@vt.edu') },
      { ic: '↗', lb: 'github', hk: '', run: ext('https://github.com/askokane') },
      { ic: '↗', lb: 'linkedin', hk: '', run: ext('https://www.linkedin.com/in/atharvakokane/') },
      { ic: '↑', lb: 'back to top', hk: '', run: function () { if (lenis) lenis.scrollTo(0, { duration: 1.2 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); } },
      { ic: '◐', lb: 'theme — toggle light / dark', hk: '', run: function () {
          document.documentElement.classList.toggle('light');
          try { localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark'); } catch (e) {}
          window.dispatchEvent(new Event('themechange'));
        } },
      { ic: '✦', lb: 'ask. — say hi', hk: '', run: go('mailto:atharvashashankk@vt.edu?subject=hi%20atharva') },
      { ic: '</>', lb: 'view source', hk: '', run: ext('https://github.com/askokane/askokane.github.io') }
    ];

    /* trigger badge */
    var trig = document.createElement('button');
    trig.className = 'cmdk-trigger'; trig.type = 'button';
    trig.innerHTML = '<kbd>/</kbd><span class="lbl">menu</span>';
    document.body.appendChild(trig);

    /* overlay */
    var ov = document.createElement('div');
    ov.className = 'cmdk-overlay';
    ov.innerHTML =
      '<div class="cmdk" role="dialog" aria-label="command menu">' +
        '<div class="cmdk-in"><span class="pr">&gt;</span><input type="text" placeholder="type a command — or just ask." aria-label="command input" /></div>' +
        '<div class="cmdk-list" data-lenis-prevent></div>' +
        '<div class="cmdk-foot"><span><b>↑↓</b> move</span><span><b>↵</b> run</span><span><b>esc</b> close</span></div>' +
      '</div>';
    document.body.appendChild(ov);
    var input = ov.querySelector('input');
    var list = ov.querySelector('.cmdk-list');
    var open = false, sel = 0, filtered = cmds.slice();

    function render() {
      list.innerHTML = '';
      if (!filtered.length) { list.innerHTML = '<div class="cmdk-empty">no match. try \u201cask\u201d.</div>'; return; }
      filtered.forEach(function (c, i) {
        var el = document.createElement('div');
        el.className = 'cmdk-item' + (i === sel ? ' sel' : '');
        el.innerHTML = '<span class="ic">' + c.ic + '</span><span class="lb">' + c.lb + '</span><span class="hk">' + (c.hk || '') + '</span>';
        el.addEventListener('mouseenter', function () { sel = i; paint(); });
        el.addEventListener('click', function () { runSel(); });
        list.appendChild(el);
      });
    }
    function paint() {
      [].forEach.call(list.children, function (el, i) { el.classList.toggle('sel', i === sel); });
    }
    function filter() {
      var q = input.value.trim().toLowerCase();
      filtered = q ? cmds.filter(function (c) { return c.lb.toLowerCase().indexOf(q) > -1; }) : cmds.slice();
      sel = 0; render();
    }
    function show() {
      open = true; ov.classList.add('open'); input.value = ''; filter();
      if (lenis) lenis.stop();
      setTimeout(function () { input.focus(); }, 30);
    }
    function hide() { open = false; ov.classList.remove('open'); if (lenis) lenis.start(); }
    function runSel() { var c = filtered[sel]; if (c) { hide(); c.run(); } }

    trig.addEventListener('click', show);
    ov.addEventListener('click', function (e) { if (e.target === ov) hide(); });
    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(filtered.length - 1, sel + 1); paint(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); paint(); }
      else if (e.key === 'Enter') { e.preventDefault(); runSel(); }
      else if (e.key === 'Escape') { hide(); }
    });

    /* global keys: "/", ⌘K, and "g _" chords */
    var gKey = 0;
    document.addEventListener('keydown', function (e) {
      var t = e.target, tag = t && t.tagName;
      var typing = tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable);
      if (open) return;
      if (typing) return;
      if (e.key === '/' ) { e.preventDefault(); show(); return; }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); show(); return; }
      if (e.key === 'g' || e.key === 'G') { gKey = Date.now(); return; }
      if (Date.now() - gKey < 800) {
        var map = { h: 0, w: 1, r: 2, c: 3 };
        var idx = map[e.key.toLowerCase()];
        if (idx != null) { e.preventDefault(); cmds[idx].run(); }
        gKey = 0;
      }
    });
  }

  /* ── boot ─────────────────────────────────────────────────── */
  function boot() {
    try {
      console.log('%c// atharva kokane', 'color:#fff;font:700 15px monospace');
      console.log('%cyou found the console. press %c/%c anywhere on the site for commands.\nor skip the formalities — atharvashashankk@vt.edu  ·  ask.',
        'color:#888;font:12px monospace', 'color:#fff;font:700 12px monospace', 'color:#888;font:12px monospace');
    } catch (e) {}
    initLenis();
    initNav();
    initBackToTop();
    initCommandPalette();
    wireAnchors();
    initCardFx();
    initMagnetic();
    initProgress();
    initYear();

    runPreloader(function () {
      heroIntro();
      initHeroScroll();
      initManifesto();
      initMarquee();
      initStackCloud();
      initTimeline();
      initReveals();
      if (ScrollTrigger) { ScrollTrigger.refresh(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

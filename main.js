/* ═══════════════════════════════════════
   VISHWARADYA — Portfolio Scripts
   ═══════════════════════════════════════ */

(function() {
  'use strict';

  /* ─── CURSOR ─── */
  const cur = document.getElementById('cur');
  const cur2 = document.getElementById('cur2');
  if (cur && cur2) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * .1;
      ry += (my - ry) * .1;
      cur2.style.left = rx + 'px';
      cur2.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.sk,.exp-card,.pcard,.chip,.edu-card,.ctr').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
    });
  }

  /* ─── CANVAS BACKGROUND ─── */
  const cvs = document.getElementById('cvs');
  if (cvs) {
    const ctx = cvs.getContext('2d');
    let W = cvs.width  = window.innerWidth;
    let H = cvs.height = window.innerHeight;
    window.addEventListener('resize', () => {
      W = cvs.width  = window.innerWidth;
      H = cvs.height = window.innerHeight;
    });

    const orbs = [
      { x: W*.15, y: H*.25, r: 550, c: 'rgba(245,200,66,',  vx: .16, vy: .08,  a: .06 },
      { x: W*.8,  y: H*.5,  r: 430, c: 'rgba(0,245,196,',   vx: -.1, vy: .14,  a: .045},
      { x: W*.5,  y: H*.9,  r: 370, c: 'rgba(162,89,255,',  vx: .08, vy: -.1,  a: .05 },
      { x: W*.95, y: H*.1,  r: 290, c: 'rgba(255,61,110,',  vx: -.07,vy: .09,  a: .035},
    ];
    const pts = Array.from({length: 55}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      r: Math.random() * 1.2 + .3, a: Math.random() * .45 + .1
    }));

    function frame() {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.c + o.a + ')');
        g.addColorStop(1, o.c + '0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
      });
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,200,66,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(245,200,66,${.06 * (1 - d / 90)})`;
            ctx.lineWidth = .6; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ─── SCROLL REVEAL ─── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: .08 });
  document.querySelectorAll('.rv').forEach(el => observer.observe(el));

  /* ─── COUNTER ANIMATION ─── */
  function animateCounter(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    let current = 0;
    const step = target / 70;
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = prefix + Math.floor(current) + suffix;
      if (current >= target) clearInterval(iv);
    }, 22);
  }

  const counterSec = document.querySelector('.counters-sec');
  if (counterSec) {
    let counted = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted) {
        counted = true;
        e.target.querySelectorAll('.ctr-num').forEach(animateCounter);
        e.target.classList.add('on');
      }
    }, { threshold: .25 }).observe(counterSec);
  }

  /* ─── 3D TILT ─── */
  document.querySelectorAll('.pcard,.sk,.exp-card,.edu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = -(e.clientY - r.top  - r.height / 2) / r.height * 8;
      const ry =  (e.clientX - r.left - r.width  / 2) / r.width  * 8;
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── DRAG SCROLL (projects) ─── */
  const ps = document.getElementById('projScroll');
  if (ps) {
    let isDown = false, startX, scrollLeft;
    ps.addEventListener('mousedown', e => {
      isDown = true; ps.style.cursor = 'grabbing';
      startX = e.pageX - ps.offsetLeft; scrollLeft = ps.scrollLeft;
    });
    ps.addEventListener('mouseleave', () => { isDown = false; ps.style.cursor = 'grab'; });
    ps.addEventListener('mouseup',    () => { isDown = false; ps.style.cursor = 'grab'; });
    ps.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - ps.offsetLeft;
      ps.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  /* ─── NAV ACTIVE STATE ─── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const ioNav = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: .4 });
  sections.forEach(s => ioNav.observe(s));

  /* ─── TYPED HERO SUBTITLE ─── */
  const tagline = document.querySelector('.hero-title-line');
  if (tagline) {
    const texts = [
      'Data Architect · Business Intelligence',
      'BI Engineer · Analytics Lead',
      'Power BI Expert · SQL Specialist'
    ];
    let ti = 0, ci = 0, deleting = false;
    function type() {
      const full = texts[ti];
      if (!deleting) {
        tagline.textContent = full.slice(0, ++ci);
        if (ci === full.length) { deleting = true; setTimeout(type, 2200); return; }
      } else {
        tagline.textContent = full.slice(0, --ci);
        if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; setTimeout(type, 400); return; }
      }
      setTimeout(type, deleting ? 40 : 70);
    }
    setTimeout(type, 1400);
  }

})();

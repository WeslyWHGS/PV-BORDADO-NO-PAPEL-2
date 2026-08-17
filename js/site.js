// The Paper Atelier — page interactions
// FAQ accordion, "who it's for" tabs, catalog carousel, countdown timer,
// and the scroll-reveal animation.

document.addEventListener('DOMContentLoaded', function () {

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });

  // Who it's for — tabs
  document.querySelectorAll('.who-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.dataset.target;

      document.querySelectorAll('.who-tab').forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.who-panel').forEach(function (p) { p.classList.remove('is-active'); });
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('is-active');
    });
  });

  // Catalog carousel — horizontal scroll with arrow controls
  (function () {
    var track = document.querySelector('.catalog-track');
    var prev = document.querySelector('.catalog-prev');
    var next = document.querySelector('.catalog-next');
    if (!track || !prev || !next) return;

    function scrollByCard(dir) {
      var card = track.querySelector('.catalog-card');
      if (!card) return;
      var cardWidth = card.getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).gap) || 24;
      track.scrollBy({ left: dir * (cardWidth + gap), behavior: 'smooth' });
    }
    prev.addEventListener('click', function () { scrollByCard(-1); });
    next.addEventListener('click', function () { scrollByCard(1); });

    function updateArrows() {
      var maxScroll = track.scrollWidth - track.clientWidth - 4;
      prev.toggleAttribute('disabled', track.scrollLeft <= 4);
      next.toggleAttribute('disabled', track.scrollLeft >= maxScroll);
    }
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  })();

  // Countdown — Hours : Minutes : Seconds (evergreen rolling cycle)
  (function () {
    var el = document.getElementById('megaCountdown');
    if (!el) return;
    var nums = {
      hours: el.querySelector('[data-cd="hours"]'),
      minutes: el.querySelector('[data-cd="minutes"]'),
      seconds: el.querySelector('[data-cd="seconds"]'),
    };
    // First visit starts the clock, persisted in localStorage so refreshes
    // don't reset it. When it hits 0, it resets to a fresh cycle.
    var STORAGE_KEY = 'pa_countdown_target';
    var CYCLE_MS = 15 * 60 * 60 * 1000; // 15 hours

    function getTarget() {
      var t = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
      var now = Date.now();
      if (!t || t <= now) {
        t = now + CYCLE_MS;
        try { localStorage.setItem(STORAGE_KEY, t); } catch (e) {}
      }
      return t;
    }
    var target = getTarget();

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        target = Date.now() + CYCLE_MS;
        try { localStorage.setItem(STORAGE_KEY, target); } catch (e) {}
        return;
      }
      var s = Math.floor(diff / 1000);
      if (nums.hours) nums.hours.textContent = pad(Math.floor(s / 3600));
      if (nums.minutes) nums.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      if (nums.seconds) nums.seconds.textContent = pad(s % 60);
    }
    tick();
    setInterval(tick, 1000);
  })();

  // Reveal on scroll (IntersectionObserver)
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

});

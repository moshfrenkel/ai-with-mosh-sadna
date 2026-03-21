(function() {
  'use strict';

  // ---- Early Bird Countdown ----
  var EARLY_BIRD_DEADLINE = new Date('2026-04-01T23:59:59+03:00');
  var EARLY_BIRD_PRICE = 390;
  var REGULAR_PRICE = 450;

  function updateCountdown() {
    var now = new Date();
    var diff = EARLY_BIRD_DEADLINE - now;
    var daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    var countdownEls = document.querySelectorAll('.countdown-days');
    var earlyBirdBadges = document.querySelectorAll('.early-bird-badge');
    var earlyBirdBoxes = document.querySelectorAll('.early-bird-box');
    var countdownWrappers = document.querySelectorAll('.countdown');

    if (diff <= 0) {
      // Early bird expired: hide early bird elements, revert to regular price
      earlyBirdBadges.forEach(function(el) { el.style.display = 'none'; });
      earlyBirdBoxes.forEach(function(el) { el.style.display = 'none'; });
      countdownWrappers.forEach(function(el) { el.style.display = 'none'; });

      // Update all prices back to regular
      document.querySelectorAll('.price-original').forEach(function(el) {
        el.style.display = 'none';
      });
      document.querySelectorAll('.price-current').forEach(function(el) {
        el.textContent = REGULAR_PRICE + ' \u20AA';
      });

      // Update sticky CTA
      var stickyBtn = document.querySelector('.sticky-cta__btn');
      if (stickyBtn) {
        stickyBtn.textContent = '\u05D0\u05E0\u05D9 \u05E0\u05E8\u05E9\u05DD/\u05EA | ' + REGULAR_PRICE + ' \u20AA';
      }
    } else {
      // Update countdown numbers
      countdownEls.forEach(function(el) {
        el.textContent = daysLeft;
      });
    }
  }

  updateCountdown();
  // Update once per hour (no need for more frequent updates when counting days)
  setInterval(updateCountdown, 3600000);

  // ---- Scroll Reveal (IntersectionObserver) ----
  var animElements = document.querySelectorAll('.anim-up');
  if (animElements.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    animElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ---- Sticky CTA (mobile) ----
  var stickyCta = document.getElementById('stickyCta');
  var heroSection = document.querySelector('.hero');

  if (stickyCta && heroSection && 'IntersectionObserver' in window) {
    var stickyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          stickyCta.classList.remove('visible');
        } else {
          stickyCta.classList.add('visible');
        }
      });
    }, { threshold: 0 });

    stickyObserver.observe(heroSection);
  }

  // ---- Form Validation ----
  var form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var valid = true;
      var nameInput = document.getElementById('regName');
      var phoneInput = document.getElementById('regPhone');

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(function(g) {
        g.classList.remove('has-error');
      });

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        valid = false;
      }

      // Validate phone
      var phoneVal = phoneInput.value.replace(/[\s\-()]/g, '');
      if (!phoneVal || phoneVal.length < 9) {
        phoneInput.closest('.form-group').classList.add('has-error');
        valid = false;
      }

      if (valid) {
        // Build WhatsApp message with form data (Early Bird aware)
        var name = nameInput.value.trim();
        var phone = phoneInput.value.trim();
        var email = document.getElementById('regEmail').value.trim();
        var now = new Date();
        var isEarlyBird = now < EARLY_BIRD_DEADLINE;
        var priceText = isEarlyBird ? '\u05DE\u05D7\u05D9\u05E8 \u05DE\u05D5\u05E7\u05D3\u05DD 390 \u05E9"\u05D7' : '450 \u05E9"\u05D7';

        var msg = '\u05D4\u05D9\u05D9 \u05DE\u05D5\u05E9, \u05D0\u05E0\u05D9 ' + name + ' \u05D5\u05D0\u05E9\u05DE\u05D7 \u05DC\u05D4\u05D9\u05E8\u05E9\u05DD \u05DC\u05E1\u05D3\u05E0\u05D4 "\u05DE\u05D4\u05DE\u05E1\u05DA \u05DC\u05DE\u05D2\u05E8\u05E9" (' + priceText + ').\n';
        msg += '\u05D8\u05DC\u05E4\u05D5\u05DF: ' + phone;
        if (email) msg += '\n\u05D0\u05D9\u05DE\u05D9\u05D9\u05DC: ' + email;

        var waUrl = 'https://wa.me/972523433795?text=' + encodeURIComponent(msg);
        window.open(waUrl, '_blank');
      }
    });

    // Clear error on input
    form.querySelectorAll('input').forEach(function(input) {
      input.addEventListener('input', function() {
        var group = this.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

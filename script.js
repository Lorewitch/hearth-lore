(() => {
  const loader = document.querySelector('.library-loader');
  if (loader) {
    const started = performance.now();
    let loaderDone = false;
    const hideLoader = () => {
      if (loaderDone) return;
      loaderDone = true;
      const elapsed = performance.now() - started;
      const remaining = Math.max(0, 1900 - elapsed);
      window.setTimeout(() => loader.classList.add('is-hidden'), remaining);
      window.setTimeout(() => loader.remove(), remaining + 900);
    };
    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader, { once: true });
    window.setTimeout(hideLoader, 2600);
  }


  const enableCustomCursor = () => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const stylesheet = document.querySelector('link[rel="stylesheet"]');
    const stylesheetUrl = stylesheet ? stylesheet.href : new URL('style.css', document.baseURI).href;
    const cursorUrl = new URL('assets/ui/quill-cursor.png', stylesheetUrl).href;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    const image = new Image();
    image.alt = '';
    image.decoding = 'async';

    const moveCursor = (event) => {
      cursor.style.transform = `translate3d(${event.clientX - 5}px, ${event.clientY - 4}px, 0)`;
      cursor.classList.add('is-visible');
    };

    const hideCursor = () => cursor.classList.remove('is-visible');

    image.addEventListener('load', () => {
      cursor.append(image);
      document.body.append(cursor);
      document.documentElement.classList.add('custom-cursor-ready');
      window.addEventListener('pointermove', moveCursor, { passive: true });
      window.addEventListener('mousemove', moveCursor, { passive: true });
      document.addEventListener('mouseleave', hideCursor);
      window.addEventListener('blur', hideCursor);
    }, { once: true });

    image.src = cursorUrl;
  };

  enableCustomCursor();


  const emberLayer = document.querySelector('.embers');
  if (emberLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const emberCount = 46;
    const randomBetween = (min, max) => min + Math.random() * (max - min);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < emberCount; i += 1) {
      const ember = document.createElement('span');
      ember.className = 'ember-particle';
      const size = randomBetween(3.2, i % 7 === 0 ? 10.5 : 7.2);
      ember.style.setProperty('--ember-left', `${randomBetween(-3, 103).toFixed(2)}%`);
      ember.style.setProperty('--ember-size', `${size.toFixed(2)}px`);
      ember.style.setProperty('--ember-duration', `${randomBetween(9, 24).toFixed(2)}s`);
      ember.style.setProperty('--ember-delay', `${randomBetween(-24, 0).toFixed(2)}s`);
      ember.style.setProperty('--ember-opacity', `${randomBetween(0.28, 0.82).toFixed(2)}`);
      ember.style.setProperty('--ember-blur', `${randomBetween(0, 1.15).toFixed(2)}px`);
      ember.style.setProperty('--ember-drift-a', `${randomBetween(-38, 38).toFixed(1)}px`);
      ember.style.setProperty('--ember-drift-b', `${randomBetween(-74, 74).toFixed(1)}px`);
      ember.style.setProperty('--ember-drift-c', `${randomBetween(-116, 116).toFixed(1)}px`);
      fragment.appendChild(ember);
    }

    emberLayer.appendChild(fragment);
  }

  const isHomePage = document.body.classList.contains('home-page');

  if (isHomePage) {
    const sheets = Array.from(document.querySelectorAll('[data-sheet]'));
    const sheetLinks = Array.from(document.querySelectorAll('[data-sheet-link]'));
    const hashToIndex = new Map([
      ['#top', 0],
      ['#contents', 0],
      ['#house', 1],
      ['#floors', 1],
      ['#residents', 2]
    ]);
    let currentSheet = hashToIndex.get(window.location.hash) ?? 0;
    let isLocked = false;

    const setSheet = (index, options = {}) => {
      if (!sheets.length) return;
      const next = Math.max(0, Math.min(index, sheets.length - 1));
      if (next === currentSheet && !options.force) return;
      currentSheet = next;

      sheets.forEach((sheet, sheetIndex) => {
        sheet.classList.toggle('is-active', sheetIndex === currentSheet);
        sheet.setAttribute('aria-hidden', String(sheetIndex !== currentSheet));
      });

      sheetLinks.forEach((link) => {
        const linkIndex = Number(link.dataset.sheetLink);
        link.classList.toggle('active', linkIndex === currentSheet);
      });

      const activeId = sheets[currentSheet]?.id;
      if (activeId && !options.silent) {
        history.replaceState(null, '', `#${activeId}`);
      }
    };

    const requestSheet = (direction) => {
      if (isLocked || !direction) return;
      const next = currentSheet + direction;
      if (next < 0 || next >= sheets.length) return;
      isLocked = true;
      setSheet(next);
      window.setTimeout(() => { isLocked = false; }, 850);
    };

    sheetLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        setSheet(Number(link.dataset.sheetLink));
      });
    });

    window.addEventListener('wheel', (event) => {
      if (document.body.classList.contains('plan-modal-open')) return;
      event.preventDefault();
      const direction = event.deltaY > 0 ? 1 : -1;
      requestSheet(direction);
    }, { passive: false });

    window.addEventListener('keydown', (event) => {
      if (document.body.classList.contains('plan-modal-open')) return;
      const nextKeys = ['ArrowDown', 'PageDown', 'Space'];
      const prevKeys = ['ArrowUp', 'PageUp'];
      if (nextKeys.includes(event.code)) {
        event.preventDefault();
        requestSheet(1);
      }
      if (prevKeys.includes(event.code)) {
        event.preventDefault();
        requestSheet(-1);
      }
    });

    window.addEventListener('hashchange', () => {
      if (hashToIndex.has(window.location.hash)) {
        setSheet(hashToIndex.get(window.location.hash), { silent: true });
      }
    });

    setSheet(currentSheet, { force: true, silent: true });
  } else {
    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => observer.observe(item));
      } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
      }
    }
  }

  const quizOptions = document.querySelectorAll('[data-points]');
  const quizResult = document.querySelector('#quiz-result');
  const quizReset = document.querySelector('#quiz-reset');

  const results = {
    1: {
      title: 'Угольность: тёплая искорка',
      text: 'Ты мягкий котик у края пледа. Греешь пространство присутствием и не любишь лишнюю драму.'
    },
    2: {
      title: 'Угольность: хранитель Очага',
      text: 'Ты уже проверяешь камин, свечи, чайник и эмоциональную безопасность комнаты. Надёжный угольный специалист.'
    },
    3: {
      title: 'Угольность: протокольный углекот',
      text: 'Ты не просто котик. Ты маленький тёмный администратор аномалий. Документы уже заняты, виновные уже диагностированы.'
    }
  };

  if (quizOptions.length && quizResult && quizReset) {
    quizOptions.forEach((button) => {
      button.addEventListener('click', () => {
        const result = results[button.dataset.points];
        if (!result) return;

        quizResult.hidden = false;
        quizReset.hidden = false;
        quizResult.replaceChildren();

        const title = document.createElement('strong');
        title.textContent = result.title;
        const text = document.createElement('span');
        text.textContent = result.text;
        quizResult.append(title, document.createElement('br'), text);

        quizOptions.forEach((item) => {
          item.disabled = true;
          item.style.opacity = item === button ? '1' : '0.55';
        });
      });
    });

    quizReset.addEventListener('click', () => {
      quizResult.hidden = true;
      quizReset.hidden = true;
      quizResult.replaceChildren();
      quizOptions.forEach((item) => {
        item.disabled = false;
        item.style.opacity = '1';
      });
    });
  }

  const floorCarousel = document.querySelector('[data-floor-carousel]');
  if (floorCarousel) {
    const slides = Array.from(floorCarousel.querySelectorAll('[data-floor-slide]'));
    const dots = Array.from(floorCarousel.querySelectorAll('[data-floor-dot]'));
    let currentFloor = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let floorTimer = null;

    const showFloor = (index) => {
      if (!slides.length) return;
      currentFloor = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === currentFloor);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === currentFloor);
        dot.setAttribute('aria-pressed', String(dotIndex === currentFloor));
      });
    };

    const startFloorAuto = () => {
      window.clearInterval(floorTimer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      floorTimer = window.setInterval(() => showFloor(currentFloor + 1), 5200);
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showFloor(index);
        startFloorAuto();
      });
    });

    floorCarousel.addEventListener('mouseenter', () => window.clearInterval(floorTimer));
    floorCarousel.addEventListener('mouseleave', startFloorAuto);
    showFloor(currentFloor);
    startFloorAuto();
  }

  const planModal = document.querySelector('#plan-modal');
  const planModalImage = document.querySelector('#plan-modal-image');
  const planModalClose = document.querySelector('.plan-modal-close');
  const planButtons = document.querySelectorAll('[data-plan]');
  let lastFocusedPlanButton = null;

  function closePlanModal() {
    if (!planModal || !planModalImage || planModal.hidden) return;
    planModal.hidden = true;
    planModalImage.removeAttribute('src');
    planModalImage.alt = '';
    document.body.classList.remove('plan-modal-open');
    if (lastFocusedPlanButton) lastFocusedPlanButton.focus({ preventScroll: true });
  }

  planButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!planModal || !planModalImage) return;
      lastFocusedPlanButton = button;
      planModalImage.src = button.dataset.plan;
      planModalImage.alt = button.dataset.title || 'Чертёж этажа';
      planModal.hidden = false;
      document.body.classList.add('plan-modal-open');
      if (planModalClose) planModalClose.focus({ preventScroll: true });
    });
  });

  if (planModal) {
    planModal.addEventListener('click', (event) => {
      if (event.target === planModal) closePlanModal();
    });
  }

  if (planModalImage) {
    planModalImage.addEventListener('click', closePlanModal);
  }

  if (planModalClose) {
    planModalClose.addEventListener('click', closePlanModal);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePlanModal();
  });
})();

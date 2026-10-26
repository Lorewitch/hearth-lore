(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sheetLayout = window.matchMedia('(min-width: 921px)');
  const loader = document.querySelector('.library-loader');
  if (loader) {
    // Do not hold a ready page behind an artificial loading delay.
    const hideLoader = () => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => loader.remove(), 250);
    };
    if (document.readyState === 'loading' && !reducedMotion.matches) {
      loader.classList.add('is-loading');
      document.addEventListener('DOMContentLoaded', hideLoader, { once: true });
      window.setTimeout(hideLoader, 1500);
    } else loader.remove();
  }

  const syncEffects = () => {
    document.body.classList.toggle('effects-paused', document.hidden ||
      document.body.classList.contains('plan-modal-open') || reducedMotion.matches);
  };
  document.addEventListener('visibilitychange', syncEffects);
  reducedMotion.addEventListener('change', syncEffects);
  syncEffects();

  const emberLayer = document.querySelector('.embers');
  if (emberLayer && !reducedMotion.matches) {
    const emberCount = sheetLayout.matches ? 28 : 16;
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
      ['#top', 0], ['#contents', 0], ['#house', 1], ['#floors', 1], ['#residents', 2]
    ]);
    let currentSheet = hashToIndex.get(window.location.hash) ?? 0;
    let lockedUntil = 0;

    const setSheet = (index, updateHash = true) => {
      if (!sheets.length) return;
      currentSheet = Math.max(0, Math.min(index, sheets.length - 1));
      sheets.forEach((sheet, sheetIndex) => {
        const active = sheetIndex === currentSheet;
        sheet.classList.toggle('is-active', active);
        sheet.setAttribute('aria-hidden', String(sheetLayout.matches && !active));
        sheet.inert = sheetLayout.matches && !active;
      });
      sheetLinks.forEach((link) => {
        const active = Number(link.dataset.sheetLink) === currentSheet;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      if (updateHash) history.replaceState(null, '', `#${sheets[currentSheet].id}`);
      document.dispatchEvent(new Event('hearth:sheet-change'));
    };

    const requestSheet = (direction) => {
      if (performance.now() < lockedUntil) return;
      const next = currentSheet + direction;
      if (next < 0 || next >= sheets.length) return;
      lockedUntil = performance.now() + (reducedMotion.matches ? 200 : 850);
      setSheet(next);
    };

    sheetLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        // On narrow screens links are ordinary anchors and all sections scroll.
        if (!sheetLayout.matches) return;
        event.preventDefault();
        setSheet(Number(link.dataset.sheetLink));
      });
    });

    window.addEventListener('wheel', (event) => {
      if (!sheetLayout.matches || event.ctrlKey || event.metaKey ||
          document.body.classList.contains('plan-modal-open') ||
          Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      requestSheet(Math.sign(event.deltaY));
    }, { passive: false });

    window.addEventListener('keydown', (event) => {
      if (!sheetLayout.matches || event.defaultPrevented || event.ctrlKey || event.metaKey ||
          event.altKey || document.body.classList.contains('plan-modal-open') ||
          event.target.closest('a, button, input, textarea, select, summary, [contenteditable]')) return;
      const nextKeys = ['ArrowDown', 'PageDown', 'Space'];
      const prevKeys = ['ArrowUp', 'PageUp'];
      if (nextKeys.includes(event.code) || prevKeys.includes(event.code)) {
        event.preventDefault();
        requestSheet(prevKeys.includes(event.code) || (event.code === 'Space' && event.shiftKey) ? -1 : 1);
      }
    });

    window.addEventListener('hashchange', () => {
      if (hashToIndex.has(window.location.hash)) setSheet(hashToIndex.get(window.location.hash), false);
    });
    sheetLayout.addEventListener('change', () => {
      setSheet(currentSheet, false);
      if (sheetLayout.matches) window.scrollTo({ top: 0, behavior: 'instant' });
    });
    setSheet(currentSheet, false);
  } else {
    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length && 'IntersectionObserver' in window && !reducedMotion.matches) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      revealItems.forEach((item) => observer.observe(item));
    } else revealItems.forEach((item) => item.classList.add('is-visible'));
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
    const sheet = floorCarousel.closest('[data-sheet]');
    let currentFloor = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let floorTimer;
    let inView = false;
    let hovered = false;

    const showFloor = (index) => {
      if (!slides.length) return;
      currentFloor = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentFloor;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentFloor;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-pressed', String(active));
      });
    };

    const scheduleFloor = () => {
      window.clearTimeout(floorTimer);
      if (!inView || document.hidden || reducedMotion.matches || hovered ||
          floorCarousel.contains(document.activeElement) ||
          document.body.classList.contains('plan-modal-open') ||
          (sheetLayout.matches && sheet && !sheet.classList.contains('is-active'))) return;
      floorTimer = window.setTimeout(() => {
        showFloor(currentFloor + 1);
        scheduleFloor();
      }, 5200);
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => { showFloor(index); scheduleFloor(); });
    });
    floorCarousel.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      hovered = true;
      scheduleFloor();
    });
    floorCarousel.addEventListener('pointerleave', () => { hovered = false; scheduleFloor(); });
    floorCarousel.addEventListener('focusin', scheduleFloor);
    floorCarousel.addEventListener('focusout', () => window.requestAnimationFrame(scheduleFloor));
    document.addEventListener('visibilitychange', scheduleFloor);
    document.addEventListener('hearth:sheet-change', scheduleFloor);
    document.addEventListener('hearth:viewer-change', scheduleFloor);
    reducedMotion.addEventListener('change', scheduleFloor);
    sheetLayout.addEventListener('change', scheduleFloor);
    showFloor(currentFloor);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        scheduleFloor();
      }).observe(floorCarousel);
    } else { inView = true; scheduleFloor(); }
  }

  const planModal = document.querySelector('#plan-modal');
  const planModalImage = document.querySelector('#plan-modal-image');
  if (planModal && planModalImage) {
    const closeButton = planModal.querySelector('.plan-modal-close');
    const originalLink = planModal.querySelector('.plan-modal-original');
    const status = planModal.querySelector('.plan-modal-status');
    let trigger = null;

    const viewerChanged = () => {
      syncEffects();
      document.dispatchEvent(new Event('hearth:viewer-change'));
    };
    document.querySelectorAll('[data-plan]').forEach((button) => {
      button.addEventListener('click', () => {
        trigger = button;
        const title = button.dataset.title || 'Изображение';
        status.textContent = 'Загружаем изображение…';
        status.hidden = false;
        planModalImage.hidden = true;
        planModalImage.alt = title;
        planModal.setAttribute('aria-label', title);
        originalLink.href = button.dataset.plan;
        planModalImage.src = button.dataset.plan;
        planModal.showModal();
        document.body.classList.add('plan-modal-open');
        closeButton.focus({ preventScroll: true });
        viewerChanged();
      });
    });
    planModalImage.addEventListener('load', () => {
      planModalImage.hidden = false;
      status.hidden = true;
    });
    planModalImage.addEventListener('error', () => {
      status.textContent = 'Не удалось загрузить изображение. Попробуйте открыть оригинал.';
      status.hidden = false;
    });
    closeButton.addEventListener('click', () => planModal.close());
    planModalImage.addEventListener('click', () => planModal.close());
    planModal.addEventListener('click', (event) => {
      if (event.target === planModal) planModal.close();
    });
    // Escape uses the dialog's built-in cancel/close behavior and focus trap.
    planModal.addEventListener('close', () => {
      document.body.classList.remove('plan-modal-open');
      planModalImage.removeAttribute('src');
      planModalImage.alt = '';
      originalLink.removeAttribute('href');
      status.hidden = true;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      viewerChanged();
    });
  }

  const dossierBlocks = document.querySelectorAll('[data-dossier-tabs]');
  dossierBlocks.forEach((block) => {
    const tabs = Array.from(block.querySelectorAll('[data-dossier-tab]'));
    const panels = Array.from(block.querySelectorAll('[data-dossier-panel]'));
    if (!tabs.length || !panels.length) return;

    const activatePanel = (panelId) => {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.dossierTab === panelId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });
      panels.forEach((panel) => {
        const isActive = panel.id === panelId;
        panel.hidden = !isActive;
        panel.classList.toggle('is-active', isActive);
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activatePanel(tab.dataset.dossierTab));
      tab.addEventListener('keydown', (event) => {
        const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        let next;
        if (direction) next = (index + direction + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        activatePanel(tabs[next].dataset.dossierTab);
        tabs[next].focus({ preventScroll: true });
      });
    });
    activatePanel((tabs.find((tab) => tab.classList.contains('is-active')) || tabs[0]).dataset.dossierTab);
  });
})();

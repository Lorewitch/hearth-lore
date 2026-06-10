(() => {
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

  const planModal = document.querySelector('#plan-modal');
  const planModalImage = document.querySelector('#plan-modal-image');
  const planModalClose = document.querySelector('.plan-modal-close');
  const planButtons = document.querySelectorAll('[data-plan]');
  let savedScrollY = 0;

  function lockPageScroll() {
    const leafScroll = document.querySelector('[data-leaf-scroll]');
    savedScrollY = leafScroll ? leafScroll.scrollTop : (window.scrollY || document.documentElement.scrollTop || 0);
    document.body.classList.add('plan-modal-open');
  }

  function unlockPageScroll() {
    const leafScroll = document.querySelector('[data-leaf-scroll]');
    document.body.classList.remove('plan-modal-open');
    requestAnimationFrame(() => {
      if (leafScroll) {
        leafScroll.scrollTo({ top: savedScrollY, behavior: 'instant' });
      } else {
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      }
    });
  }

  function closePlanModal() {
    if (!planModal || !planModalImage || planModal.hidden) return;
    planModal.hidden = true;
    planModalImage.removeAttribute('src');
    planModalImage.alt = '';
    unlockPageScroll();
  }

  planButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!planModal || !planModalImage) return;
      planModalImage.src = button.dataset.plan;
      planModalImage.alt = button.dataset.title || 'Чертёж этажа';
      planModal.hidden = false;
      lockPageScroll();
    });
  });

  if (planModal) {
    planModal.addEventListener('click', closePlanModal);
    planModal.addEventListener('wheel', (event) => event.preventDefault(), { passive: false });
    planModal.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });
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


  const leafScroller = document.querySelector('[data-leaf-scroll]');
  const leafLinks = Array.from(document.querySelectorAll('[data-leaf-link]'));
  const leafSections = leafScroller ? Array.from(leafScroller.querySelectorAll('[data-leaf]')) : [];

  if (leafScroller && leafSections.length && leafLinks.length) {
    const activateLeaf = (id) => {
      leafLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.leafLink === id);
      });
    };

    const currentLeaf = () => {
      const midpoint = leafScroller.scrollTop + leafScroller.clientHeight / 2;
      return leafSections.reduce((closest, section) => {
        const center = section.offsetTop + section.offsetHeight / 2;
        const distance = Math.abs(center - midpoint);
        return distance < closest.distance ? { id: section.id, distance } : closest;
      }, { id: leafSections[0].id, distance: Infinity }).id;
    };

    let ticking = false;
    leafScroller.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const id = currentLeaf();
        activateLeaf(id);
        if (window.location.hash !== `#${id}`) {
          history.replaceState(null, '', `#${id}`);
        }
        ticking = false;
      });
    }, { passive: true });

    leafLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.getElementById(link.dataset.leafLink);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${target.id}`);
        activateLeaf(target.id);
      });
    });

    const initialTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
    requestAnimationFrame(() => {
      if (initialTarget && leafScroller.contains(initialTarget)) {
        initialTarget.scrollIntoView({ behavior: 'instant', block: 'start' });
        activateLeaf(initialTarget.id);
      } else {
        activateLeaf(currentLeaf());
      }
    });
  }

  const carousel = document.querySelector('[data-resident-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.resident-track');
    const cards = Array.from(carousel.querySelectorAll('.resident-card'));
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let currentPage = 0;

    const cardsPerPage = () => {
      if (window.matchMedia('(max-width: 620px)').matches) return 1;
      if (window.matchMedia('(max-width: 1120px)').matches) return 2;
      return 3;
    };

    function renderDots(pageCount) {
      if (!dotsContainer) return;
      dotsContainer.replaceChildren();
      for (let index = 0; index < pageCount; index += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `carousel-dot${index === currentPage ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Обитатели ${index + 1}`);
        dot.addEventListener('click', () => showPage(index));
        dotsContainer.append(dot);
      }
    }

    function showPage(page) {
      if (!track || !cards.length) return;
      const perPage = cardsPerPage();
      const pageCount = Math.ceil(cards.length / perPage);
      currentPage = Math.max(0, Math.min(page, pageCount - 1));
      track.style.transform = `translateX(-${currentPage * 100}%)`;
      renderDots(pageCount);
    }

    window.addEventListener('resize', () => showPage(currentPage));
    showPage(0);
  }
})();

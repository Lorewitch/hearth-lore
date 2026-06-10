const quizOptions = document.querySelectorAll("[data-points]");
const quizResult = document.querySelector("#quiz-result");
const quizReset = document.querySelector("#quiz-reset");

const results = {
  1: {
    title: "Угольность: тёплая искорка",
    text: "Ты мягкий котик у края пледа. Греешь пространство присутствием и не любишь лишнюю драму."
  },
  2: {
    title: "Угольность: хранитель Очага",
    text: "Ты уже проверяешь камин, свечи, чайник и эмоциональную безопасность комнаты. Надёжный угольный специалист."
  },
  3: {
    title: "Угольность: протокольный углекот",
    text: "Ты не просто котик. Ты маленький тёмный администратор аномалий. Документы уже заняты, виновные уже диагностированы."
  }
};

if (quizOptions.length && quizResult && quizReset) {
  quizOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const points = Number(button.dataset.points);
      const result = results[points];

      quizResult.hidden = false;
      quizReset.hidden = false;
      quizResult.innerHTML = `<strong>${result.title}</strong><br>${result.text}`;

      quizOptions.forEach((item) => {
        item.disabled = true;
        item.style.opacity = item === button ? "1" : "0.55";
      });
    });
  });

  quizReset.addEventListener("click", () => {
    quizResult.hidden = true;
    quizReset.hidden = true;
    quizResult.innerHTML = "";

    quizOptions.forEach((item) => {
      item.disabled = false;
      item.style.opacity = "1";
    });
  });
}





// === v8: чертежи закрываются по фону и по картинке ===
const planModalV8 = document.querySelector("#plan-modal");
const planModalImageV8 = document.querySelector("#plan-modal-image");
const planModalCloseV8 = document.querySelector(".plan-modal-close");
const planButtonsV8 = document.querySelectorAll("[data-plan]");

function closePlanModalV8() {
  if (!planModalV8 || !planModalImageV8) return;
  planModalV8.hidden = true;
  planModalImageV8.src = "";
  planModalImageV8.alt = "";
}

planButtonsV8.forEach((button) => {
  button.addEventListener("click", () => {
    if (!planModalV8 || !planModalImageV8) return;
    planModalImageV8.src = button.dataset.plan;
    planModalImageV8.alt = button.dataset.title || "Чертёж этажа";
    planModalV8.hidden = false;
  });
});

if (planModalV8) {
  planModalV8.addEventListener("click", closePlanModalV8);
}

if (planModalImageV8) {
  planModalImageV8.addEventListener("click", closePlanModalV8);
}

if (planModalCloseV8) {
  planModalCloseV8.addEventListener("click", closePlanModalV8);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePlanModalV8();
  }
});

// === v9: рабочая карусель обитателей ===
const residentCarouselV9 = document.querySelector("[data-resident-carousel]");

if (residentCarouselV9) {
  const track = residentCarouselV9.querySelector(".resident-track");
  const dots = Array.from(residentCarouselV9.querySelectorAll(".carousel-dot"));
  const cards = Array.from(residentCarouselV9.querySelectorAll(".resident-card"));

  let currentSlide = 0;
  let timer = null;

  function getCardsPerSlide() {
    if (window.matchMedia("(max-width: 620px)").matches) return 1;
    if (window.matchMedia("(max-width: 1120px)").matches) return 2;
    return 3;
  }

  function getSlideCount() {
    return Math.max(1, Math.ceil(cards.length / getCardsPerSlide()));
  }

  function syncDots() {
    const slideCount = getSlideCount();
    dots.forEach((dot, index) => {
      dot.hidden = index >= slideCount;
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function goToSlide(index) {
    if (!track) return;

    const slideCount = getSlideCount();
    currentSlide = (index + slideCount) % slideCount;

    const cardsPerSlide = getCardsPerSlide();
    const card = cards[0];
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).gap || "0");
    const step = (card.getBoundingClientRect().width + gap) * cardsPerSlide;

    track.style.transform = `translateX(-${step * currentSlide}px)`;
    syncDots();
  }

  function stopAutoCarousel() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAutoCarousel() {
    stopAutoCarousel();
    timer = window.setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 4600);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startAutoCarousel();
    });
  });

  window.addEventListener("resize", () => {
    goToSlide(0);
  });

  residentCarouselV9.addEventListener("mouseenter", stopAutoCarousel);
  residentCarouselV9.addEventListener("mouseleave", startAutoCarousel);
  residentCarouselV9.addEventListener("focusin", stopAutoCarousel);
  residentCarouselV9.addEventListener("focusout", startAutoCarousel);

  syncDots();
  goToSlide(0);
  startAutoCarousel();
}

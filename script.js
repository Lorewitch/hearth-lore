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



// === v6: чистое увеличение чертежей и циклическая карусель ===
const planModalV6 = document.querySelector("#plan-modal");
const planModalImageV6 = document.querySelector("#plan-modal-image");
const planModalCloseV6 = document.querySelector(".plan-modal-close");
const planButtonsV6 = document.querySelectorAll("[data-plan]");

function closePlanModalV6() {
  if (!planModalV6 || !planModalImageV6) return;
  planModalV6.hidden = true;
  planModalImageV6.src = "";
  planModalImageV6.alt = "";
}

planButtonsV6.forEach((button) => {
  button.addEventListener("click", () => {
    if (!planModalV6 || !planModalImageV6) return;
    const planSrc = button.dataset.plan;
    const planTitle = button.dataset.title || "Чертёж";
    planModalImageV6.src = planSrc;
    planModalImageV6.alt = planTitle;
    planModalV6.hidden = false;
  });
});

if (planModalV6) {
  planModalV6.addEventListener("click", (event) => {
    if (event.target === planModalV6) {
      closePlanModalV6();
    }
  });
}

if (planModalCloseV6) {
  planModalCloseV6.addEventListener("click", closePlanModalV6);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePlanModalV6();
  }
});

const residentCarouselV6 = document.querySelector("[data-resident-carousel]");
if (residentCarouselV6) {
  const track = residentCarouselV6.querySelector(".resident-track");
  const dots = Array.from(residentCarouselV6.querySelectorAll(".carousel-dot"));
  const cards = Array.from(residentCarouselV6.querySelectorAll(".resident-card"));
  const cardsPerSlide = 3;
  const slideCount = Math.max(1, Math.ceil(cards.length / cardsPerSlide));
  let currentSlide = 0;
  let timer = null;

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function goToSlide(index) {
    if (!track) return;
    currentSlide = (index + slideCount) % slideCount;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
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

  residentCarouselV6.addEventListener("mouseenter", stopAutoCarousel);
  residentCarouselV6.addEventListener("mouseleave", startAutoCarousel);
  residentCarouselV6.addEventListener("focusin", stopAutoCarousel);
  residentCarouselV6.addEventListener("focusout", startAutoCarousel);

  goToSlide(0);
  startAutoCarousel();
}

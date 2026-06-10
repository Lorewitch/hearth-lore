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




// === v7: чертежи и карусель ===
const planModalV7 = document.querySelector("#plan-modal");
const planModalImageV7 = document.querySelector("#plan-modal-image");
const planModalCloseV7 = document.querySelector(".plan-modal-close");
const planButtonsV7 = document.querySelectorAll("[data-plan]");

function closePlanModalV7() {
  if (!planModalV7 || !planModalImageV7) return;
  planModalV7.hidden = true;
  planModalImageV7.src = "";
  planModalImageV7.alt = "";
}

planButtonsV7.forEach((button) => {
  button.addEventListener("click", () => {
    if (!planModalV7 || !planModalImageV7) return;
    planModalImageV7.src = button.dataset.plan;
    planModalImageV7.alt = button.dataset.title || "Чертёж этажа";
    planModalV7.hidden = false;
  });
});

if (planModalV7) {
  planModalV7.addEventListener("click", (event) => {
    // Закрывает только клик по пустому фону, не по самой картинке и не по кнопке.
    if (event.target === planModalV7) {
      closePlanModalV7();
    }
  });
}

if (planModalCloseV7) {
  planModalCloseV7.addEventListener("click", (event) => {
    event.stopPropagation();
    closePlanModalV7();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePlanModalV7();
  }
});

const residentCarouselV7 = document.querySelector("[data-resident-carousel]");
if (residentCarouselV7) {
  const track = residentCarouselV7.querySelector(".resident-track");
  const dots = Array.from(residentCarouselV7.querySelectorAll(".carousel-dot"));
  const cards = Array.from(residentCarouselV7.querySelectorAll(".resident-card"));
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

  residentCarouselV7.addEventListener("mouseenter", stopAutoCarousel);
  residentCarouselV7.addEventListener("mouseleave", startAutoCarousel);
  residentCarouselV7.addEventListener("focusin", stopAutoCarousel);
  residentCarouselV7.addEventListener("focusout", startAutoCarousel);

  goToSlide(0);
  startAutoCarousel();
}

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


// === v5: модальное окно чертежей и карусель обитателей ===
const planModal = document.querySelector("#plan-modal");
const planModalImage = document.querySelector("#plan-modal-image");
const planModalTitle = document.querySelector("#plan-modal-title");
const planModalClose = document.querySelector(".plan-modal-close");
const planButtons = document.querySelectorAll("[data-plan]");

function closePlanModal() {
  if (!planModal) return;
  planModal.hidden = true;
  if (planModalImage) {
    planModalImage.src = "";
    planModalImage.alt = "";
  }
}

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!planModal || !planModalImage || !planModalTitle) return;
    const planSrc = button.dataset.plan;
    const planTitle = button.dataset.title || "Чертёж";
    planModalImage.src = planSrc;
    planModalImage.alt = planTitle;
    planModalTitle.textContent = planTitle;
    planModal.hidden = false;
  });
});

if (planModal) {
  planModal.addEventListener("click", (event) => {
    if (event.target === planModal) {
      closePlanModal();
    }
  });
}

if (planModalClose) {
  planModalClose.addEventListener("click", closePlanModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePlanModal();
  }
});

const residentCarousel = document.querySelector("[data-resident-carousel]");
if (residentCarousel) {
  const viewport = residentCarousel.querySelector(".resident-viewport");
  const prev = residentCarousel.querySelector(".carousel-prev");
  const next = residentCarousel.querySelector(".carousel-next");

  function getStep() {
    const firstCard = viewport?.querySelector(".resident-card");
    if (!viewport || !firstCard) return 300;
    const gap = 14;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function scrollResidents(direction = 1) {
    if (!viewport) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const step = getStep() * direction;

    if (direction > 0 && viewport.scrollLeft >= maxScroll - 8) {
      viewport.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && viewport.scrollLeft <= 8) {
      viewport.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      viewport.scrollBy({ left: step, behavior: "smooth" });
    }
  }

  prev?.addEventListener("click", () => scrollResidents(-1));
  next?.addEventListener("click", () => scrollResidents(1));

  let carouselTimer = window.setInterval(() => scrollResidents(1), 4200);

  residentCarousel.addEventListener("mouseenter", () => {
    window.clearInterval(carouselTimer);
  });

  residentCarousel.addEventListener("mouseleave", () => {
    carouselTimer = window.setInterval(() => scrollResidents(1), 4200);
  });

  residentCarousel.addEventListener("focusin", () => {
    window.clearInterval(carouselTimer);
  });

  residentCarousel.addEventListener("focusout", () => {
    carouselTimer = window.setInterval(() => scrollResidents(1), 4200);
  });
}

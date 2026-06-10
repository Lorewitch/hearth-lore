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






// === v10: модальное окно чертежей поверх всей страницы ===
const planModalV10 = document.querySelector("#plan-modal");
const planModalImageV10 = document.querySelector("#plan-modal-image");
const planModalCloseV10 = document.querySelector(".plan-modal-close");
const planButtonsV10 = document.querySelectorAll("[data-plan]");

let savedScrollYV10 = 0;

function lockPageScrollV10() {
  savedScrollYV10 = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.classList.add("plan-modal-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollYV10}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockPageScrollV10() {
  document.body.classList.remove("plan-modal-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, savedScrollYV10);
}

function closePlanModalV10() {
  if (!planModalV10 || !planModalImageV10) return;
  planModalV10.hidden = true;
  planModalImageV10.src = "";
  planModalImageV10.alt = "";
  unlockPageScrollV10();
}

planButtonsV10.forEach((button) => {
  button.addEventListener("click", () => {
    if (!planModalV10 || !planModalImageV10) return;
    planModalImageV10.src = button.dataset.plan;
    planModalImageV10.alt = button.dataset.title || "Чертёж этажа";
    planModalV10.hidden = false;
    lockPageScrollV10();
  });
});

if (planModalV10) {
  planModalV10.addEventListener("click", closePlanModalV10);
  planModalV10.addEventListener("wheel", (event) => {
    event.preventDefault();
  }, { passive: false });
  planModalV10.addEventListener("touchmove", (event) => {
    event.preventDefault();
  }, { passive: false });
}

if (planModalImageV10) {
  planModalImageV10.addEventListener("click", closePlanModalV10);
}

if (planModalCloseV10) {
  planModalCloseV10.addEventListener("click", closePlanModalV10);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && planModalV10 && !planModalV10.hidden) {
    closePlanModalV10();
  }
});

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

const quizOptions = document.querySelectorAll("#quiz-options button");
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

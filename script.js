import { quizData } from "./data.js";

let questionNumber = 0;
const answer = new Array(quizData.length).fill(null);
const optionMap = ["a", "b", "c", "d"];
let attempts = 0;
let corrects = 0;
let incorrects = 0;

function createComponent(data) {
  const container = document.createElement("div");
  container.className = "quizContainer";

  // Question
  const question = document.createElement("h2");
  question.className = "question";
  question.textContent = `${questionNumber + 1}. ${data.question}`;

  // Options
  const options = document.createElement("div");
  options.className = "options";

  ["a", "b", "c", "d"].forEach((key, index) => {
    options.appendChild(createOption(index, data[key]));
  });

  // Buttons
  const btnWrapper = document.createElement("div");
  btnWrapper.className = "btnWrapper";

  ["Previous", "Submit", "Next"].forEach((name) => {
    btnWrapper.appendChild(createButtons(name));
  });

  container.append(question, options, btnWrapper);
  return container;
}

function createOption(i, text) {
  const wrapper = document.createElement("label");
  wrapper.className = "option";
  wrapper.setAttribute("for", `radio-${i}`);

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.id = `radio-${i}`;
  radio.name = "quizOption";
  radio.dataset.index = i;

  const span = document.createElement("span");
  span.textContent = text;

  wrapper.append(radio, span);
  return wrapper;
}

function createButtons(name) {
  const button = document.createElement("button");
  button.className = "button";
  button.id = name;
  button.textContent = name;
  return button;
}

function renderQuiz(data) {
  const quizCard = document.querySelector(".quizCard");
  quizCard.innerHTML = "";
  quizCard.appendChild(createComponent(data));

  restoreSelection();
}

function saveSelection() {
  const selected = document.querySelector("input[name='quizOption']:checked");
  if (selected) {
    answer[questionNumber] = Number(selected.dataset.index);
  }
}

function restoreSelection() {
  resetColor(); // clear all

  const saved = answer[questionNumber];
  if (saved !== null) {
    const target = document.querySelector(`#radio-${saved}`);
    if (target) {
      target.checked = true;
      target.parentNode.querySelector("span").classList.add("selected");
    }
  }
}

function resetColor() {
  document.querySelectorAll(".option span").forEach((span) => {
    span.classList.remove("selected");
  });
}

function computeResult() {
  let cntAttempts = 0;
  let cntCorrects = 0;
  let cntIncorrects = 0;
  answer.forEach((value, index) => {
    if (value !== null) {
      cntAttempts++;
      if (value !== null && optionMap[value] === quizData[index]["correct"]) {
        cntCorrects++;
      } else {
        cntIncorrects++;
      }
    }
  });
  attempts = cntAttempts;
  corrects = cntCorrects;
  incorrects = cntIncorrects;
}
function renderResult() {
  const outcomes = document.querySelectorAll(".outcomes");
  outcomes[0].textContent = `Attempts : ${attempts}/${quizData.length}`;
  outcomes[1].textContent = `Corrects : ${corrects}/${attempts}`;
  outcomes[2].textContent = `Incorrects : ${incorrects}/${attempts}`;
}

// GLOBAL EVENT LISTENERS

document.addEventListener("click", function (e) {
  if (e.target.type === "radio") {
    saveSelection();
    restoreSelection();
  }

  if (!e.target.classList.contains("button")) return;

  if (e.target.id === "Next") {
    questionNumber = (questionNumber + 1) % quizData.length;
    renderQuiz(quizData[questionNumber]);
  }

  if (e.target.id === "Previous") {
    questionNumber = (questionNumber - 1 + quizData.length) % quizData.length;
    renderQuiz(quizData[questionNumber]);
  }

  if (e.target.id === "Submit") {
    const quizes = document.querySelector(".quizes");
    const result = document.querySelector(".resultWrapper");
    computeResult();
    renderResult();

    quizes.classList.add("hidden");
    result.classList.remove("hidden");
  }
});

// Start button
const h1 = document.querySelector(".main>h1");
const start = document.querySelector(".start");
const startBtn = document.querySelector(".start button");
const quizes = document.querySelector(".quizes");
const reTest = document.querySelector(".reTest button");

startBtn.addEventListener("click", function () {
  h1.classList.toggle("hidden");
  start.classList.toggle("hidden");
  quizes.classList.toggle("hidden");
  renderQuiz(quizData[questionNumber]);
});

reTest.addEventListener("click", function () {
  const quizes = document.querySelector(".quizes");
  const result = document.querySelector(".resultWrapper");
  quizes.classList.toggle("hidden");
  result.classList.add("hidden");
  answer.fill(null);
  questionNumber = 0;
  attempts = 0;
  corrects = 0;
  incorrects = 0;
  renderQuiz(quizData[questionNumber]);
  computeResult();
  renderResult();
});

import "./styles/index.css";
import "./styles/overrides.css";

const root = document.querySelector("#root");
const phases = ["Вдих", "Пауза", "Видих", "Пауза"];
const state = { screen: "home", anchor: "СПОКІЙ", phase: 0, seconds: 4, cycles: 0, running: false, breathStartedAt: 0, breathElapsedMs: 0, done: [false, false, false, false], openAnchors: false };
let breathTimer;

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const stopBreathing = () => { if (state.running && state.breathStartedAt) state.breathElapsedMs += performance.now() - state.breathStartedAt; state.running = false; clearInterval(breathTimer); breathTimer = undefined; };
const go = (screen) => { if (screen !== "breathe") stopBreathing(); state.screen = screen; state.openAnchors = false; window.scrollTo({ top: 0, behavior: "smooth" }); render(); };

function render() {
  if (state.screen === "home") renderHome();
  if (state.screen === "prepare") renderPrepare();
  if (state.screen === "breathe") renderBreath();
  if (state.screen === "match") renderMatch();
  if (state.screen === "reset") renderReset();
}

function backButton(screen = "home") { return `<button class="back" data-action="go" data-screen="${screen}" aria-label="Назад">‹</button>`; }

function renderHome() { root.innerHTML = `<main class="screen home"><div class="top"><span>●</span> COURT CALM <button aria-label="Меню">⋯</button></div><div class="hero"><p class="eyebrow">ТВІЙ СПОКІЙНИЙ КОРТ</p><h1>Грай<br><em>у своєму ритмі.</em></h1><p>Маленька рутина для великої гри.</p></div><div class="court"><i></i><b>✦</b></div><div class="actions"><button class="primary" data-action="go" data-screen="prepare"><span>◌</span><div><small>15–20 ХВ ДО ГРИ</small>Підготовка до матчу</div><b>›</b></button><button class="secondary" data-action="go" data-screen="match"><span>✦</span><div><small>МІЖ РОЗІГРАШАМИ</small>Я вже на корті</div><b>›</b></button></div><p class="note">Твоя сила — у наступному м’ячі</p></main>`; }

function renderPrepare() { const rows = [["10 хв", "Розігрій тіло", "Легкий біг, суглоби, короткі спринти й звичні удари."], ["2 хв", "Обери 3 процес-цілі", "Бачу м’яч рано · Глибина · Слово-якір."], ["3–5 хв", "Уяви перші гейми", "Подача + перший удар. Прийом + глибокий крос."], ["2–3 хв", "Дихання", "4–4–4–4 — бути сміливою і спокійною."]]; root.innerHTML = `<main class="screen prepare">${backButton()}<p class="eyebrow">15–20 ХВ ДО МАТЧУ</p><h1>Ти вже<br><em>у грі.</em></h1><p class="muted">Йди по кроках без поспіху.</p><div class="list">${rows.map(([time, title, text], i) => `<button class="${state.done[i] ? "done" : ""}" data-action="${i === 3 ? "prepare-breath" : "toggle"}" data-index="${i}"><span>${state.done[i] ? "✓" : i + 1}</span><div><small>${time}</small><b>${title}</b><p>${text}</p></div></button>`).join("")}</div><button class="primary center" data-action="go" data-screen="breathe">Перейти до дихання&nbsp; ›</button></main>`; }

function renderBreath() { root.innerHTML = `<main class="screen breath">${backButton()}<div class="breath-content"><section class="breath-intro"><p class="eyebrow">ПЕРЕД МАТЧЕМ · 2–3 ХВ</p><h1>Знайди свій ритм</h1><p class="muted">${state.running ? "Рухайся разом із колом" : "4–4–4–4 · 4–6 спокійних циклів"}</p></section><div class="orbit ${state.running ? "active" : ""}"><div><b>${phases[state.phase]}</b><span>${state.seconds}</span></div></div><section class="breath-controls"><div class="phases">${phases.map((p, i) => `<span class="${i === state.phase ? "selected" : ""}">${p}</span>`).join("")}</div><p class="cycle">${state.cycles} циклів</p><button class="primary center" data-action="breath">${state.running ? "Пауза" : "Почати дихання"}</button><p class="mantra">«Спокійно дихаю — граю сміливо»</p></section></div></main>`; }

function renderMatch() { const steps = [["RESPOND", "Рівне, сильне тіло."], ["RECOVER", "Один повільний вдих і видих."], ["REFOCUS", `Скажи: «${esc(state.anchor)}»`], ["READY", "Звична стійка. Очі на м’яч."]]; root.innerHTML = `<main class="screen match">${backButton()}<p class="eyebrow">МІЖ РОЗІГРАШАМИ</p><h1>Наступний<br><em>м’яч.</em></h1><div class="anchor"><small>ТВОЄ СЛОВО-ЯКІР</small><button data-action="anchors">${esc(state.anchor)}<span>⌄</span></button>${state.openAnchors ? `<div>${["СПОКІЙ", "NEXT", "ГЛИБОКО"].map((x) => `<button data-action="anchor" data-value="${x}">${x}</button>`).join("")}</div>` : ""}</div><section class="routine">${steps.map(([label, text], i) => `<article><span>${i + 1}</span><div><small>${label}</small><b>${text}</b></div></article>`).join("")}</section><button class="reset" data-action="go" data-screen="reset">Потрібен reset? <b>→</b></button></main>`; }

function renderReset() { root.innerHTML = `<main class="screen reset-screen">${backButton("match")}<p class="eyebrow">ПАУЗА · ЗМІНА СТОРІН</p><h1>Повернись<br><em>до себе.</em></h1><div class="three">3 <span>повільні вдихи<br>та видихи</span></div><p class="quote">«Зараз складно — це нормально. Я зроблю прості речі добре.»</p><section class="goals"><small>НАСТУПНІ 2 ГЕЙМИ</small>${["Глибина + рух ніг", "Бачу м’яч рано", "Слово-якір перед поінтом"].map((x) => `<button>${x}<span>○</span></button>`).join("")}</section><button class="primary center" data-action="go" data-screen="match">Я готова до наступного м’яча</button></main>`; }

function updateBreathUI() {
  const phaseLabel = root.querySelector(".orbit b");
  const secondsLabel = root.querySelector(".orbit span");
  const phaseItems = root.querySelectorAll(".phases span");
  const cycleLabel = root.querySelector(".cycle");
  const actionButton = root.querySelector('[data-action="breath"]');
  const helper = root.querySelector(".breath .muted");
  if (phaseLabel) phaseLabel.textContent = phases[state.phase];
  if (secondsLabel) secondsLabel.textContent = String(state.seconds);
  phaseItems.forEach((item, index) => item.classList.toggle("selected", index === state.phase));
  if (cycleLabel) cycleLabel.textContent = `${state.cycles} циклів`;
  if (actionButton) actionButton.textContent = state.running ? "Пауза" : "Почати дихання";
  if (helper) helper.textContent = state.running ? "Рухайся разом із колом" : "4–4–4–4 · 4–6 спокійних циклів";
}

function startBreathing() {
  if (state.running) {
    stopBreathing();
    renderBreath();
    return;
  }
  state.running = true;
  state.breathStartedAt = performance.now() - state.breathElapsedMs;
  clearInterval(breathTimer);
  renderBreath();
  breathTimer = setInterval(() => {
    const elapsedSeconds = Math.floor((performance.now() - state.breathStartedAt) / 1000);
    state.phase = Math.floor(elapsedSeconds / 4) % 4;
    state.seconds = 4 - (elapsedSeconds % 4);
    state.cycles = Math.floor(elapsedSeconds / 16);
    updateBreathUI();
  }, 100);
}

root.addEventListener("click", (event) => { const target = event.target.closest("[data-action]"); if (!target) return; const action = target.dataset.action; if (action === "go") go(target.dataset.screen); if (action === "toggle") { const index = Number(target.dataset.index); state.done[index] = !state.done[index]; renderPrepare(); } if (action === "prepare-breath") { state.screen = "breathe"; renderBreath(); } if (action === "breath") startBreathing(); if (action === "anchors") { state.openAnchors = !state.openAnchors; renderMatch(); } if (action === "anchor") { state.anchor = target.dataset.value; state.openAnchors = false; renderMatch(); } });
render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));

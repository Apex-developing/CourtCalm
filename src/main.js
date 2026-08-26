import "./styles/index.css";
import "./styles/overrides.css";

const root = document.querySelector("#root");
const translations = {
  en: {
    phases: ["Inhale", "Hold", "Exhale", "Hold"],
    back: "Back",
    menu: "Menu",
    home: {
      eyebrow: "YOUR CALM COURT",
      title: "Play<br><em>at your own rhythm.</em>",
      subtitle: "A small routine for a big game.",
      primarySmall: "15–20 MIN BEFORE PLAY",
      primaryTitle: "Match prep",
      secondarySmall: "IN-BETWEEN POINTS",
      secondaryTitle: "I’m already on court",
      note: "Your strength is in the next point"
    },
    prepare: {
      eyebrow: "15–20 MIN BEFORE MATCH",
      title: "You are already<br><em>in the game.</em>",
      muted: "Move through the steps without rushing.",
      cta: "Go to breathing&nbsp; ›",
      rows: [
        ["10 min", "Warm up", "Light running, joints, short sprints, and familiar strokes."],
        ["2 min", "Choose 3 process goals", "See the ball early · Depth · Anchor word."],
        ["3–5 min", "Picture your first games", "Serve + first shot. Return + deep cross."],
        ["2–3 min", "Breathing", "4–4–4–4 — stay calm and confident."]
      ]
    },
    breath: {
      eyebrow: "BEFORE MATCH · 2–3 MIN",
      title: "Find your rhythm",
      helperRunning: "Move with the circle",
      helperIdle: "4–4–4–4 · 4–6 calm cycles",
      pause: "Pause",
      start: "Start breathing",
      mantra: "«I breathe calmly — I play boldly»"
    },
    match: {
      eyebrow: "IN-BETWEEN POINTS",
      title: "Next<br><em>point.</em>",
      anchorLabel: "YOUR ANCHOR WORD",
      resetText: "Need a reset?",
      steps: [
        ["RESPOND", "Balanced, strong body."],
        ["RECOVER", "One slow inhale and exhale."],
        ["REFOCUS", "Say: «${value}»"],
        ["READY", "Your usual stance. Eyes on the ball."]
      ],
      anchorOptions: ["CALM", "NEXT", "DEEP"]
    },
    reset: {
      eyebrow: "PAUSE · CHANGE OF SIDES",
      title: "Return<br><em>to yourself.</em>",
      threeText: "3 slow<br>breaths",
      quote: "«It feels hard right now — that is okay. I will do the simple things well.»",
      goalsTitle: "NEXT 2 GAMES",
      goals: ["Depth + foot movement", "See the ball early", "Anchor word before the point"],
      cta: "I’m ready for the next point"
    }
  },
  ua: {
    phases: ["Вдих", "Пауза", "Видих", "Пауза"],
    back: "Назад",
    menu: "Меню",
    home: {
      eyebrow: "ТВІЙ СПОКІЙНИЙ КОРТ",
      title: "Грай<br><em>у своєму ритмі.</em>",
      subtitle: "Маленька рутина для великої гри.",
      primarySmall: "15–20 ХВ ДО ГРИ",
      primaryTitle: "Підготовка до матчу",
      secondarySmall: "МІЖ РОЗІГРАШАМИ",
      secondaryTitle: "Я вже на корті",
      note: "Твоя сила — у наступному м’ячі"
    },
    prepare: {
      eyebrow: "15–20 ХВ ДО МАТЧУ",
      title: "Ти вже<br><em>у грі.</em>",
      muted: "Йди по кроках без поспіху.",
      cta: "Перейти до дихання&nbsp; ›",
      rows: [
        ["10 хв", "Розігрій тіло", "Легкий біг, суглоби, короткі спринти й звичні удари."],
        ["2 хв", "Обери 3 процес-цілі", "Бачу м’яч рано · Глибина · Слово-якір."],
        ["3–5 хв", "Уяви перші гейми", "Подача + перший удар. Прийом + глибокий крос."],
        ["2–3 хв", "Дихання", "4–4–4–4 — бути сміливою і спокійною."]
      ]
    },
    breath: {
      eyebrow: "ПЕРЕД МАТЧЕМ · 2–3 ХВ",
      title: "Знайди свій ритм",
      helperRunning: "Рухайся разом із колом",
      helperIdle: "4–4–4–4 · 4–6 спокійних циклів",
      pause: "Пауза",
      start: "Почати дихання",
      mantra: "«Спокійно дихаю — граю сміливо»"
    },
    match: {
      eyebrow: "МІЖ РОЗІГРАШАМИ",
      title: "Наступний<br><em>м’яч.</em>",
      anchorLabel: "ТВОЄ СЛОВО-ЯКІР",
      resetText: "Потрібен reset?",
      steps: [
        ["RESPOND", "Рівне, сильне тіло."],
        ["RECOVER", "Один повільний вдих і видих."],
        ["REFOCUS", "Скажи: «${value}»"],
        ["READY", "Звична стійка. Очі на м’яч."]
      ],
      anchorOptions: ["СПОКІЙ", "NEXT", "ГЛИБОКО"]
    },
    reset: {
      eyebrow: "ПАУЗА · ЗМІНА СТОРІН",
      title: "Повернись<br><em>до себе.</em>",
      threeText: "3 <span>повільні вдихи<br>та видихи</span>",
      quote: "«Зараз складно — це нормально. Я зроблю прості речі добре.»",
      goalsTitle: "НАСТУПНІ 2 ГЕЙМИ",
      goals: ["Глибина + рух ніг", "Бачу м’яч рано", "Слово-якір перед поінтом"],
      cta: "Я готова до наступного м’яча"
    }
  }
};

const state = { screen: "home", language: "en", anchor: "CALM", phase: 0, seconds: 4, cycles: 0, running: false, breathStartedAt: 0, breathElapsedMs: 0, done: [false, false, false, false], openAnchors: false };
let breathTimer;

const ui = () => translations[state.language];
const getPhases = () => ui().phases;
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const stopBreathing = () => { if (state.running && state.breathStartedAt) state.breathElapsedMs += performance.now() - state.breathStartedAt; state.running = false; clearInterval(breathTimer); breathTimer = undefined; };
const go = (screen) => { if (screen !== "breathe") stopBreathing(); state.screen = screen; state.openAnchors = false; window.scrollTo({ top: 0, behavior: "smooth" }); render(); };

function render() {
  document.documentElement.lang = state.language === "ua" ? "uk" : "en";
  if (state.screen === "home") renderHome();
  if (state.screen === "prepare") renderPrepare();
  if (state.screen === "breathe") renderBreath();
  if (state.screen === "match") renderMatch();
  if (state.screen === "reset") renderReset();
}

function backButton(screen = "home") { return `<button class="back" data-action="go" data-screen="${screen}" aria-label="${ui().back}">‹</button>`; }

function renderHome() {
  const t = ui().home;
  root.innerHTML = `<main class="screen home"><div class="top"><span>●</span> COURT CALM<div class="lang-switch" aria-label="Language switch"><button class="lang-btn ${state.language === "ua" ? "active" : ""}" data-action="set-language" data-language="ua">UA</button><button class="lang-btn ${state.language === "en" ? "active" : ""}" data-action="set-language" data-language="en">EN</button></div></div><div class="hero"><p class="eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p>${t.subtitle}</p></div><div class="court"><i></i><b>✦</b></div><div class="actions"><button class="primary" data-action="go" data-screen="prepare"><span>◌</span><div><small>${t.primarySmall}</small>${t.primaryTitle}</div><b>›</b></button><button class="secondary" data-action="go" data-screen="match"><span>✦</span><div><small>${t.secondarySmall}</small>${t.secondaryTitle}</div><b>›</b></button></div><p class="note">${t.note}</p></main>`;
}

function renderPrepare() {
  const t = ui().prepare;
  const rows = t.rows;
  root.innerHTML = `<main class="screen prepare">${backButton()}<p class="eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p class="muted">${t.muted}</p><div class="list">${rows.map(([time, title, text], i) => `<button class="${state.done[i] ? "done" : ""}" data-action="${i === 3 ? "prepare-breath" : "toggle"}" data-index="${i}"><span>${state.done[i] ? "✓" : i + 1}</span><div><small>${time}</small><b>${title}</b><p>${text}</p></div></button>`).join("")}</div><button class="primary center" data-action="go" data-screen="breathe">${t.cta}</button></main>`;
}

function renderBreath() {
  const t = ui().breath;
  const phases = getPhases();
  root.innerHTML = `<main class="screen breath">${backButton()}<div class="breath-content"><section class="breath-intro"><p class="eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p class="muted">${state.running ? t.helperRunning : t.helperIdle}</p></section><div class="orbit ${state.running ? "active" : ""}"><div><b>${phases[state.phase]}</b><span>${state.seconds}</span></div></div><section class="breath-controls"><div class="phases">${phases.map((p, i) => `<span class="${i === state.phase ? "selected" : ""}">${p}</span>`).join("")}</div><p class="cycle">${state.cycles} ${state.language === "ua" ? "циклів" : "cycles"}</p><button class="primary center" data-action="breath">${state.running ? t.pause : t.start}</button><p class="mantra">${t.mantra}</p></section></div></main>`;
}

function renderMatch() {
  const t = ui().match;
  const stepText = t.steps.map(([label, text], i) => [label, text.replace("${value}", esc(state.anchor))]);
  root.innerHTML = `<main class="screen match">${backButton()}<p class="eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><div class="anchor"><small>${t.anchorLabel}</small><button data-action="anchors">${esc(state.anchor)}<span>⌄</span></button>${state.openAnchors ? `<div>${t.anchorOptions.map((x) => `<button data-action="anchor" data-value="${x}">${x}</button>`).join("")}</div>` : ""}</div><section class="routine">${stepText.map(([label, text], i) => `<article><span>${i + 1}</span><div><small>${label}</small><b>${text}</b></div></article>`).join("")}</section><button class="reset" data-action="go" data-screen="reset">${t.resetText} <b>→</b></button></main>`;
}

function renderReset() {
  const t = ui().reset;
  root.innerHTML = `<main class="screen reset-screen">${backButton("match")}<p class="eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><div class="three">3 ${t.threeText}</div><p class="quote">${t.quote}</p><section class="goals"><small>${t.goalsTitle}</small>${t.goals.map((x) => `<button>${x}<span>○</span></button>`).join("")}</section><button class="primary center" data-action="go" data-screen="match">${t.cta}</button></main>`;
}

function updateBreathUI() {
  const phaseLabel = root.querySelector(".orbit b");
  const secondsLabel = root.querySelector(".orbit span");
  const phaseItems = root.querySelectorAll(".phases span");
  const cycleLabel = root.querySelector(".cycle");
  const actionButton = root.querySelector('[data-action="breath"]');
  const helper = root.querySelector(".breath .muted");
  const phases = getPhases();
  if (phaseLabel) phaseLabel.textContent = phases[state.phase];
  if (secondsLabel) secondsLabel.textContent = String(state.seconds);
  phaseItems.forEach((item, index) => item.classList.toggle("selected", index === state.phase));
  if (cycleLabel) cycleLabel.textContent = `${state.cycles} ${state.language === "ua" ? "циклів" : "cycles"}`;
  if (actionButton) actionButton.textContent = state.running ? ui().breath.pause : ui().breath.start;
  if (helper) helper.textContent = state.running ? ui().breath.helperRunning : ui().breath.helperIdle;
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

root.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "go") go(target.dataset.screen);
  if (action === "toggle") {
    const index = Number(target.dataset.index);
    state.done[index] = !state.done[index];
    renderPrepare();
  }
  if (action === "prepare-breath") {
    state.screen = "breathe";
    renderBreath();
  }
  if (action === "breath") startBreathing();
  if (action === "anchors") {
    state.openAnchors = !state.openAnchors;
    renderMatch();
  }
  if (action === "anchor") {
    state.anchor = target.dataset.value;
    state.openAnchors = false;
    renderMatch();
  }
  if (action === "set-language") {
    state.language = target.dataset.language;
    render();
  }
});
render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));

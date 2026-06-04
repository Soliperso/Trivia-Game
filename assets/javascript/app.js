/* =====================================================================
   Trivia Weird Laws (USA) — application logic (vanilla ES6, no deps)
   ===================================================================== */
(function () {
  "use strict";

  const QUESTIONS = window.TRIVIA_QUESTIONS || [];

  // ---- Persistence keys ----
  const LS_SETTINGS = "wlt_settings";
  const LS_BEST = "wlt_best";

  // ---- Scoring constants ----
  const BASE_POINTS = 100; // per correct answer
  const SPEED_POINTS = 10; // per remaining second
  const STREAK_BONUS = 25; // extra per consecutive correct (after the first)
  const FEEDBACK_DELAY = 2200; // ms before auto-advancing

  // ---- DOM helpers ----
  const $ = (sel) => document.querySelector(sel);
  const el = {
    screens: document.querySelectorAll(".screen"),
    typewriter: $("#typewriter"),
    homeBest: $("#homeBest"),
    homeBestScore: $("#homeBestScore"),
    themeToggle: $("#themeToggle"),
    themeIcon: $(".theme-icon"),

    startBtn: $("#startBtn"),
    settingsBtn: $("#settingsBtn"),

    setCategory: $("#setCategory"),
    setDifficulty: $("#setDifficulty"),
    setCount: $("#setCount"),
    setCountVal: $("#setCountVal"),
    setTimer: $("#setTimer"),
    setTimerVal: $("#setTimerVal"),
    setShuffle: $("#setShuffle"),
    poolNote: $("#poolNote"),
    settingsBackBtn: $("#settingsBackBtn"),
    settingsStartBtn: $("#settingsStartBtn"),

    questionCounter: $("#questionCounter"),
    liveScore: $("#liveScore"),
    streakPill: $("#streakPill"),
    streakCount: $("#streakCount"),
    progressBar: $("#progressBar"),
    timerBar: $("#timerBar"),
    timerText: $("#timerText"),
    qTopic: $("#qTopic"),
    quizQuestion: $("#quiz-question"),
    answers: $("#answers"),
    feedback: $("#feedback"),
    feedbackMsg: $("#feedbackMsg"),
    feedbackCorrect: $("#feedbackCorrect"),
    feedbackEmblem: $("#feedbackEmblem"),
    feedbackRegion: $("#feedbackRegion"),
    nextBtn: $("#nextBtn"),
    quitBtn: $("#quitBtn"),

    newBestBadge: $("#newBestBadge"),
    verdict: $("#verdict"),
    rankLine: $("#rankLine"),
    statQuestions: $("#statQuestions"),
    scoreRing: $("#scoreRing"),
    ringProgress: $("#ringProgress"),
    finalScore: $("#finalScore"),
    accuracyLine: $("#accuracyLine"),
    statCorrect: $("#statCorrect"),
    statIncorrect: $("#statIncorrect"),
    statUnanswered: $("#statUnanswered"),
    bestLine: $("#bestLine"),
    reviewBtn: $("#reviewBtn"),
    playAgainBtn: $("#playAgainBtn"),
    homeBtn: $("#homeBtn"),

    reviewList: $("#reviewList"),
    reviewBackBtn: $("#reviewBackBtn"),
    reviewPlayBtn: $("#reviewPlayBtn"),
  };

  // ---- Settings ----
  const DEFAULT_SETTINGS = {
    category: "all",
    difficulty: "all",
    count: 10,
    timer: 15,
    shuffle: true,
    theme: null, // null => follow system on first load
  };

  let settings = loadSettings();

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_SETTINGS)) || {};
      return Object.assign({}, DEFAULT_SETTINGS, saved);
    } catch (e) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      /* ignore quota / private-mode errors */
    }
  }

  // ---- Best score ----
  function loadBest() {
    try {
      return JSON.parse(localStorage.getItem(LS_BEST)) || null;
    } catch (e) {
      return null;
    }
  }

  function saveBest(best) {
    try {
      localStorage.setItem(LS_BEST, JSON.stringify(best));
    } catch (e) {
      /* ignore */
    }
  }

  // ---- Theme ----
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    el.themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
  }

  function initTheme() {
    let theme = settings.theme;
    if (!theme) {
      const prefersDark =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      theme = prefersDark ? "dark" : "light";
    }
    applyTheme(theme);
  }

  el.themeToggle.addEventListener("click", function () {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    settings.theme = next;
    saveSettings();
    applyTheme(next);
  });

  // ---- Screen routing ----
  function show(id) {
    el.screens.forEach((s) => s.classList.toggle("is-active", s.id === id));
    const active = document.getElementById(id);
    // Move focus to the screen's heading/first control for accessibility.
    const focusTarget = active.querySelector("h1, h2, .btn-primary");
    if (focusTarget) {
      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: false });
    }
  }

  // ---- Typewriter (home tagline) ----
  function typeWriter(text, target, speed) {
    let i = 0;
    target.textContent = "";
    (function tick() {
      if (i < text.length) {
        target.textContent += text.charAt(i++);
        setTimeout(tick, speed);
      }
    })();
  }

  // ---- Utilities ----
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function filteredPool() {
    return QUESTIONS.filter(
      (q) =>
        (settings.category === "all" || q.category === settings.category) &&
        (settings.difficulty === "all" || q.level === settings.difficulty)
    );
  }

  // Animate a number from current displayed value to `to`.
  function animateNumber(node, to, duration) {
    const from = parseInt(node.textContent, 10) || 0;
    if (from === to) {
      node.textContent = String(to);
      return;
    }
    const start = performance.now();
    (function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = String(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }

  // ---- Confetti (lightweight, self-contained, patriotic) ----
  const confetti = (function () {
    const canvas = document.getElementById("confetti");
    const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    const COLORS = ["#b22234", "#ffffff", "#3c5aa6", "#e0b341", "#5c97f6"];
    let particles = [];
    let raf = null;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);

    function fire() {
      if (!ctx) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      resize();
      const n = 140;
      for (let i = 0; i < n; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: canvas.height / 3,
          vx: (Math.random() - 0.5) * 11,
          vy: Math.random() * -13 - 4,
          g: 0.32 + Math.random() * 0.12,
          size: 5 + Math.random() * 6,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          life: 0,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      particles = particles.filter((p) => p.y < canvas.height + 30 && p.life < 180);
      if (particles.length) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raf = null;
      }
    }

    return { fire: fire };
  })();

  // ---- Game state ----
  let game = null;
  let timerId = null;

  function buildGame() {
    let pool = filteredPool();
    if (pool.length === 0) pool = QUESTIONS.slice(); // safety net
    let list = settings.shuffle ? shuffle(pool) : pool.slice();
    list = list.slice(0, Math.min(settings.count, list.length));

    // Pre-shuffle answer options per question (tracking the correct index).
    const prepared = list.map((q) => {
      let optionOrder = q.options.map((text, idx) => ({ text, idx }));
      if (settings.shuffle) optionOrder = shuffle(optionOrder);
      const answerIndex = optionOrder.findIndex((o) => o.idx === q.answer);
      return {
        ref: q,
        options: optionOrder.map((o) => o.text),
        answer: answerIndex,
      };
    });

    game = {
      questions: prepared,
      index: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      results: [], // { question, options, answer, picked (index|null), timedOut }
    };
  }

  function startGame() {
    buildGame();
    el.liveScore.textContent = "0";
    updateStreakPill();
    show("screen-quiz");
    renderQuestion();
  }

  function updateStreakPill() {
    if (game.streak >= 2) {
      el.streakPill.hidden = false;
      el.streakCount.textContent = String(game.streak);
    } else {
      el.streakPill.hidden = true;
    }
  }

  // ---- Question rendering ----
  function renderQuestion() {
    const total = game.questions.length;
    const q = game.questions[game.index];

    el.feedback.hidden = true;
    el.questionCounter.textContent = "Question " + (game.index + 1) + " / " + total;
    el.progressBar.style.width = (game.index / total) * 100 + "%";
    el.qTopic.textContent = q.ref.category;
    el.quizQuestion.textContent = q.ref.question;

    // Build answer buttons.
    el.answers.innerHTML = "";
    const letters = ["A", "B", "C", "D", "E"];
    q.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer";
      btn.dataset.index = String(i);
      btn.innerHTML =
        '<span class="answer-key" aria-hidden="true">' +
        letters[i] +
        "</span><span>" +
        escapeHtml(text) +
        "</span>";
      btn.addEventListener("click", () => handleAnswer(i));
      el.answers.appendChild(btn);
    });

    startTimer();
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  // Inline, animated SVG outcome emblem — scales perfectly at any size.
  function emblemSvg(outcome) {
    const marks = {
      correct: '<path class="emblem-mark" d="M24 41 l11 11 l21 -23" />',
      incorrect:
        '<path class="emblem-mark" d="M29 29 l22 22" /><path class="emblem-mark" d="M51 29 l-22 22" />',
      timeout:
        '<path class="emblem-mark" d="M40 22 v18 l12 8" /><circle class="emblem-dot" cx="40" cy="40" r="2" />',
    };
    return (
      '<svg viewBox="0 0 80 80" class="emblem-svg ' +
      outcome +
      '" role="img"><circle class="emblem-ring" cx="40" cy="40" r="35" />' +
      (marks[outcome] || "") +
      "</svg>"
    );
  }

  // ---- Timer ----
  function startTimer() {
    const total = settings.timer;
    let remaining = total;
    el.timerText.textContent = remaining + "s";
    el.timerBar.classList.remove("is-low");
    // Reset bar to full instantly, then let it drain.
    el.timerBar.style.transition = "none";
    el.timerBar.style.transform = "scaleX(1)";
    // Force reflow so the next transition applies.
    void el.timerBar.offsetWidth;
    el.timerBar.style.transition = "transform 1s linear, background 0.4s ease";

    const drain = () => {
      el.timerBar.style.transform = "scaleX(" + remaining / total + ")";
    };
    drain();

    timerId = setInterval(() => {
      remaining--;
      el.timerText.textContent = Math.max(remaining, 0) + "s";
      drain();
      if (remaining <= Math.ceil(total * 0.33)) el.timerBar.classList.add("is-low");
      if (remaining <= 0) {
        clearInterval(timerId);
        timerId = null;
        handleTimeout();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function remainingSeconds() {
    // Derive from the bar scale so speed bonus matches what the player saw.
    const scale = parseFloat(
      (el.timerBar.style.transform.match(/scaleX\(([\d.]+)\)/) || [])[1]
    );
    return isNaN(scale) ? 0 : Math.round(scale * settings.timer);
  }

  // ---- Answer handling ----
  function handleAnswer(picked) {
    stopTimer();
    const q = game.questions[game.index];
    const isCorrect = picked === q.answer;
    const secsLeft = remainingSeconds();

    if (isCorrect) {
      game.streak++;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.correct++;
      const streakBonus = Math.max(0, game.streak - 1) * STREAK_BONUS;
      const gained = BASE_POINTS + secsLeft * SPEED_POINTS + streakBonus;
      game.score += gained;
      animateNumber(el.liveScore, game.score, 500);
    } else {
      game.streak = 0;
      game.incorrect++;
    }
    updateStreakPill();

    game.results.push({
      question: q.ref.question,
      options: q.options,
      answer: q.answer,
      picked: picked,
      timedOut: false,
    });

    revealAnswer(picked, isCorrect ? "correct" : "incorrect");
  }

  function handleTimeout() {
    const q = game.questions[game.index];
    game.streak = 0;
    game.unanswered++;
    updateStreakPill();
    game.results.push({
      question: q.ref.question,
      options: q.options,
      answer: q.answer,
      picked: null,
      timedOut: true,
    });
    revealAnswer(null, "timeout");
  }

  function revealAnswer(picked, outcome) {
    const q = game.questions[game.index];

    // Disable + color the answer buttons.
    Array.from(el.answers.children).forEach((btn) => {
      const idx = parseInt(btn.dataset.index, 10);
      btn.disabled = true;
      if (idx === q.answer) btn.classList.add("is-correct");
      else if (idx === picked) btn.classList.add("is-wrong");
    });

    // Feedback text.
    const msgMap = {
      correct: { text: "Correct! 🎉", cls: "good" },
      incorrect: { text: "Not quite.", cls: "bad" },
      timeout: { text: "Time's up!", cls: "time" },
    };
    const m = msgMap[outcome];
    el.feedbackMsg.textContent = m.text;
    el.feedbackMsg.className = "feedback-msg " + m.cls;

    if (outcome === "correct") {
      el.feedbackCorrect.textContent = "";
    } else {
      el.feedbackCorrect.textContent = "Correct answer: " + q.options[q.answer];
    }

    // Crisp, theme-aware vector emblem (replaces the old low-res gifs).
    el.feedbackEmblem.innerHTML = emblemSvg(outcome);
    el.feedbackRegion.textContent = q.ref.category + " · " + capitalize(q.ref.level);

    el.feedback.hidden = false;
    el.nextBtn.focus();

    // Auto-advance, but allow manual Next.
    game._advanceTimer = setTimeout(advance, FEEDBACK_DELAY);
  }

  function advance() {
    // Idempotent: Enter can fire both the keydown handler and the focused
    // Next button's click. Once feedback is hidden we've already advanced.
    if (el.feedback.hidden) return;
    el.feedback.hidden = true;
    clearTimeout(game._advanceTimer);
    game._advanceTimer = null;
    if (game.index < game.questions.length - 1) {
      game.index++;
      renderQuestion();
    } else {
      finish();
    }
  }

  el.nextBtn.addEventListener("click", advance);

  // ---- Finish / results ----
  function finish() {
    stopTimer();
    show("screen-results");

    const total = game.questions.length;
    const accuracy = total ? Math.round((game.correct / total) * 100) : 0;
    const passed = accuracy >= 60; // USCIS civics test: 60% to pass

    // Pass / fail verdict (the official passing mark is 60%).
    el.verdict.textContent = passed
      ? "✓ Passing score — you'd pass the civics test!"
      : "Not yet — you need 60% to pass.";
    el.verdict.className = "verdict " + (passed ? "pass" : "fail");

    // A little "citizen rank" flavor based on accuracy.
    el.rankLine.innerHTML = "Rank: <strong>" + citizenRank(accuracy) + "</strong>";

    animateNumber(el.finalScore, game.score, 900);
    el.accuracyLine.textContent =
      "You scored " + accuracy + "% accuracy" +
      (game.bestStreak >= 2 ? " · best streak " + game.bestStreak + " 🔥" : "") + ".";
    el.statCorrect.textContent = String(game.correct);
    el.statIncorrect.textContent = String(game.incorrect);
    el.statUnanswered.textContent = String(game.unanswered);

    // Ring fill by accuracy (SVG stroke-dashoffset).
    const CIRC = 339.29; // 2 * PI * 54
    el.ringProgress.style.strokeDashoffset = String(CIRC); // reset, then animate
    requestAnimationFrame(() => {
      el.ringProgress.style.strokeDashoffset = String(CIRC * (1 - accuracy / 100));
    });

    // Best score handling.
    const prevBest = loadBest();
    const isNewBest = !prevBest || game.score > prevBest.score;
    if (isNewBest) {
      saveBest({ score: game.score, date: new Date().toISOString() });
      el.newBestBadge.hidden = false;
      el.bestLine.textContent = "That's a new personal best!";
    } else {
      el.newBestBadge.hidden = true;
      el.bestLine.textContent = "Personal best: " + prevBest.score + " points.";
    }
    refreshHomeBest();

    // Celebrate a passing score (or a new best).
    if (passed || isNewBest) confetti.fire();
  }

  function citizenRank(accuracy) {
    if (accuracy >= 95) return "Constitutional Scholar 🏛️";
    if (accuracy >= 80) return "Civics Champion 🦅";
    if (accuracy >= 60) return "Future Citizen 🇺🇸";
    if (accuracy >= 40) return "Promising Patriot 📚";
    return "Keep Studying 💪";
  }

  // ---- Review ----
  function renderReview() {
    el.reviewList.innerHTML = "";
    game.results.forEach((r, i) => {
      const li = document.createElement("li");
      const correctTxt = r.options[r.answer];
      let cls, status;
      if (r.timedOut) {
        cls = "skip";
        status =
          '<p class="review-a wrong"><span class="yours">No answer (timed out)</span></p>' +
          '<p class="review-a wrong"><span class="right">Correct: ' +
          escapeHtml(correctTxt) +
          "</span></p>";
      } else if (r.picked === r.answer) {
        cls = "ok";
        status =
          '<p class="review-a correct"><span class="right">✓ ' +
          escapeHtml(correctTxt) +
          "</span></p>";
      } else {
        cls = "no";
        status =
          '<p class="review-a wrong"><span class="yours">Your answer: ' +
          escapeHtml(r.options[r.picked]) +
          "</span></p>" +
          '<p class="review-a wrong"><span class="right">Correct: ' +
          escapeHtml(correctTxt) +
          "</span></p>";
      }
      li.className = "review-item " + cls;
      li.innerHTML =
        '<p class="review-q">' + (i + 1) + ". " + escapeHtml(r.question) + "</p>" + status;
      el.reviewList.appendChild(li);
    });
  }

  // ---- Home best banner ----
  function refreshHomeBest() {
    const best = loadBest();
    if (best && best.score > 0) {
      el.homeBest.hidden = false;
      el.homeBestScore.textContent = String(best.score);
    } else {
      el.homeBest.hidden = true;
    }
  }

  // ---- Settings UI ----
  function syncSettingsUI() {
    el.setCategory.value = settings.category;
    el.setDifficulty.value = settings.difficulty;
    el.setCount.value = settings.count;
    el.setCountVal.textContent = settings.count;
    el.setTimer.value = settings.timer;
    el.setTimerVal.textContent = settings.timer;
    el.setShuffle.checked = settings.shuffle;
    updatePoolNote();
  }

  function updatePoolNote() {
    const available = filteredPool().length;
    const willUse = Math.min(settings.count, available);
    if (available === 0) {
      el.poolNote.textContent =
        "No questions match this filter — all questions will be used instead.";
    } else if (available < settings.count) {
      el.poolNote.textContent =
        "Only " + available + " questions match — the quiz will use all " + available + ".";
    } else {
      el.poolNote.textContent = willUse + " questions ready with the current filters.";
    }
  }

  el.setCategory.addEventListener("change", () => {
    settings.category = el.setCategory.value;
    saveSettings();
    updatePoolNote();
  });
  el.setDifficulty.addEventListener("change", () => {
    settings.difficulty = el.setDifficulty.value;
    saveSettings();
    updatePoolNote();
  });
  el.setCount.addEventListener("input", () => {
    settings.count = parseInt(el.setCount.value, 10);
    el.setCountVal.textContent = settings.count;
    saveSettings();
    updatePoolNote();
  });
  el.setTimer.addEventListener("input", () => {
    settings.timer = parseInt(el.setTimer.value, 10);
    el.setTimerVal.textContent = settings.timer;
    saveSettings();
  });
  el.setShuffle.addEventListener("change", () => {
    settings.shuffle = el.setShuffle.checked;
    saveSettings();
  });

  // ---- Navigation wiring ----
  el.startBtn.addEventListener("click", startGame);
  el.settingsBtn.addEventListener("click", () => {
    syncSettingsUI();
    show("screen-settings");
  });
  el.settingsBackBtn.addEventListener("click", () => show("screen-home"));
  el.settingsStartBtn.addEventListener("click", startGame);

  el.quitBtn.addEventListener("click", () => {
    stopTimer();
    if (game && game._advanceTimer) clearTimeout(game._advanceTimer);
    show("screen-home");
  });

  el.reviewBtn.addEventListener("click", () => {
    renderReview();
    show("screen-review");
  });
  el.playAgainBtn.addEventListener("click", startGame);
  el.homeBtn.addEventListener("click", () => show("screen-home"));
  el.reviewBackBtn.addEventListener("click", () => show("screen-results"));
  el.reviewPlayBtn.addEventListener("click", startGame);

  // ---- Keyboard shortcuts (during quiz) ----
  document.addEventListener("keydown", (e) => {
    const quizActive = document.getElementById("screen-quiz").classList.contains("is-active");
    if (!quizActive) return;

    // Advance with Enter when feedback is visible.
    if (!el.feedback.hidden) {
      if (e.key === "Enter") {
        e.preventDefault();
        advance();
      }
      return;
    }

    // Answer with 1-4 or A-D.
    let idx = -1;
    if (/^[1-9]$/.test(e.key)) idx = parseInt(e.key, 10) - 1;
    else if (/^[a-dA-D]$/.test(e.key)) idx = e.key.toLowerCase().charCodeAt(0) - 97;

    if (idx >= 0 && idx < el.answers.children.length) {
      e.preventDefault();
      const btn = el.answers.children[idx];
      if (!btn.disabled) handleAnswer(idx);
    }
  });

  // ---- Boot ----
  initTheme();
  if (el.statQuestions) el.statQuestions.textContent = String(QUESTIONS.length);
  refreshHomeBest();
  typeWriter("Study. Practice. Become a citizen.", el.typewriter, 55);
})();

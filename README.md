# 🇺🇸 U.S. Citizenship Civics Test 2026 — Practice Quiz

A fast, clean, multiple-choice study tool for the **USCIS naturalization civics test**.
Practice the official civics questions, track your score, and review your answers.

🔗 **Live demo:** _added after deploy_

![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-f7df1e) ![No build step](https://img.shields.io/badge/build-none-success) ![Responsive](https://img.shields.io/badge/responsive-yes-blue)

> ℹ️ This is an independent study tool and is **not affiliated with or endorsed by USCIS**.
> Questions are adapted into multiple-choice form for practice. Current-officeholder
> answers (President, Vice President, Speaker, Chief Justice) are accurate as of early 2026 —
> update them in `assets/javascript/questions.js` when officials change. Questions whose
> official answer varies by location (your senators, representative, governor, state capital)
> are intentionally omitted from this fixed quiz.

---

## ✨ Features

- **66 official-style questions** across the three test sections: American Government,
  American History, and Integrated Civics (geography, symbols, holidays).
- **Topic & difficulty filters** — focus on a section or an easy/medium/hard level.
- **Speed & streak scoring** with an animated score counter.
- **Per-question timer** and a quiz **progress bar**.
- **End-of-test review** — every question with your answer vs. the correct one.
- **Personal best** saved locally (localStorage).
- **Light / dark theme** — follows your system preference, then remembers your choice.
- **Fully responsive** and **accessible**: real buttons, keyboard play
  (`1`–`4` / `A`–`D`, `Enter` to advance), focus management, ARIA live regions,
  and reduced-motion support.

## 🎮 How to use

1. Press **Start Quiz**, or open **Settings** to pick a topic, difficulty, number of
   questions (5–20), and timer length.
2. Answer before the timer runs out — faster answers and streaks score more.
3. At the end, view your score and a full answer review.

## 🛠️ Tech

Pure **HTML + CSS + JavaScript** — no frameworks, no build step, no dependencies.

```
index.html
assets/
  css/styles.css          # theming, layout, responsive design
  javascript/
    questions.js          # civics question bank (data)
    app.js                # quiz logic & state machine
  images/bg.svg           # patriotic background (stars + flag wash)
```

## ▶️ Run locally

Serve over HTTP (the page loads local scripts):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## 🚀 Deploy

**Netlify** — drag-and-drop the project folder at https://app.netlify.com/drop, or connect
the GitHub repo (no build command; publish directory = project root).

**GitHub Pages** — Settings → Pages → Deploy from branch `main`, folder `/ (root)`.

---

Study, practice, and pass. Good luck on your citizenship journey! 🇺🇸

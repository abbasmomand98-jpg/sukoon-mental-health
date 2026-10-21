# Sukoon — Mental Health Counselor Finder (UX Concept)

Finding the right counselor shouldn't be the hardest step.

Sukoon is a UX concept for Pakistan: a directory of **verified** mental-health counselors with **upfront PKR fees**, **anonymous booking** (stigma is the biggest barrier), a gentle **self-check**, a private **journal**, and one-tap **crisis support** with a guided 4-7-8 breathing tool. Timed for exam season, when student stress peaks.

**Live demo:** https://abbasmomand98-jpg.github.io/sukoon-mental-health/

## How it works

- **Home** — a warm greeting plus a 5-state mood check-in (saved on your device) and calm, exam-season "Learn" articles.
- **Counselors** — search and filter 10 sample counselors across 6 Pakistani cities (Lahore, Karachi, Islamabad, Peshawar, Rawalpindi, Multan) by city, fee range (Rs 2,500–8,000), language (Urdu, English, Pashto, Saraiki), and verification status; sort by rating or lowest fee. Every profile shows credentials, specializations, languages, sessions done, and the exact fee per 50-minute session.
- **Booking flow** — tap a counselor → pick a day/time slot → toggle "Book anonymously" → confirm → get a digital receipt (`SK-2026-XXXX`) saved in localStorage.
- **Self-check** — a PHQ-2-style two-question check-in with honest, non-diagnostic scoring bands (low / moderate / high) and guidance.
- **Journal** — private entries stored only in the browser's localStorage.
- **Crisis** — big calm "Need to talk now?" card, helpline cards (clearly marked sample), and an animated 4-7-8 breathing circle that grows, holds, and shrinks.

All state (mood, journal, bookings) lives in `localStorage` — nothing leaves your device. No frameworks, no build step: `data.js` holds the sample data, `logic.js` holds the pure functions, `app.js` renders the UI, and `test.js` proves the logic works.

## What you can learn from this project

- **Separating pure logic from the DOM**: every calculation in `logic.js` (search/filter, fee math, PHQ-2 scoring, breathing-timer phases) takes plain inputs and returns plain outputs — no `document`, no `localStorage`. That single habit makes the whole app testable in Node with zero dependencies; read `test.js` to see how 60+ assertions cover a full booking and screening flow.
- **Building a filter pipeline**: `applyFilters()` composes small single-purpose filters (city → fee → language → query → sort). Each is trivial alone; composed, they power the whole directory. This pattern works for any listing app — jobs, rentals, courses.
- **State in localStorage**: journal entries, bookings, and mood check-ins persist across visits with three tiny `loadJSON`/`saveJSON` helpers and key namespaced constants. Try opening the demo in two tabs.
- **A timer-driven breathing animation**: `breathingPhase()` maps elapsed seconds to inhale/hold/exhale phases of a 19-second 4-7-8 cycle, and `app.js` turns that into a smooth CSS scale animation with `setInterval`. The same phase-machine pattern drives countdowns, quizzes, and Pomodoro timers.
- **Honest sample-data design**: every invented counselor and helpline is labeled "sample" in the data, the UI, and the README — because a health-adjacent demo must never look like real medical advice.

**Fork it and make it yours**: swap the sample counselors for real, verified professionals in *your* city, plug in real helpline numbers, translate the UI into Urdu — and you have a mental-health access tool your own community can actually use.

## Sample-data honesty note

Everything on the demo is invented for the concept: the 10 counselors, their credentials, fees, ratings, and slots are fictional; helpline names and numbers (1XXX, 2XXX, 3XXX) are placeholders clearly labeled "sample". The self-check is a sample well-being questionnaire, not a medical diagnosis. Do not treat anything here as real medical advice or real professional listings.

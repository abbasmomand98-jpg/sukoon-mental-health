// ============================================================
// logic.js — pure functions for the Sukoon demo.
// No DOM, no localStorage here: every function is a plain
// input -> output, which makes it easy to test (see test.js).
// ============================================================

// Normalize text for searching: lowercase + trimmed.
function norm(s) {
  return String(s || "").toLowerCase().trim();
}

// True if a counselor matches a free-text query against
// name, city, credentials, or any specialization.
function matchesQuery(c, query) {
  var q = norm(query);
  if (!q) return true;
  var hay = [c.name, c.city, c.credentials]
    .concat(c.specializations, c.languages)
    .map(norm)
    .join(" ");
  return hay.indexOf(q) !== -1;
}

// Search counselors by free text (case-insensitive).
function searchCounselors(list, query) {
  return list.filter(function (c) { return matchesQuery(c, query); });
}

// Keep only counselors in the given city ("" = all cities).
function filterByCity(list, city) {
  if (!city) return list.slice();
  return list.filter(function (c) { return c.city === city; });
}

// Keep only counselors whose fee sits inside [minFee, maxFee].
function filterByFee(list, minFee, maxFee) {
  return list.filter(function (c) { return c.fee >= minFee && c.fee <= maxFee; });
}

// Keep only counselors who speak the given language.
function filterByLanguage(list, lang) {
  if (!lang) return list.slice();
  return list.filter(function (c) { return c.languages.indexOf(lang) !== -1; });
}

// Keep only verified counselors (credential check passed).
function verifiedOnly(list) {
  return list.filter(function (c) { return c.verified === true; });
}

// Sort by rating, highest first. Returns a new array.
function sortByRating(list) {
  return list.slice().sort(function (a, b) { return b.rating - a.rating; });
}

// Sort by fee, lowest first. Returns a new array.
function sortByFee(list) {
  return list.slice().sort(function (a, b) { return a.fee - b.fee; });
}

// One combined filter the UI calls: applies every filter at once.
function applyFilters(list, opts) {
  var out = list;
  if (opts.verifiedOnly) out = verifiedOnly(out);
  out = filterByCity(out, opts.city || "");
  out = filterByFee(out, opts.minFee || 0, opts.maxFee || Infinity);
  out = filterByLanguage(out, opts.language || "");
  out = searchCounselors(out, opts.query || "");
  if (opts.sort === "fee") out = sortByFee(out);
  else out = sortByRating(out);
  return out;
}

// "Rs 3,500" — thousands separator, no decimals.
function formatFee(n) {
  return "Rs " + Number(n).toLocaleString("en-PK");
}

// Total cost of n sessions at fee per session.
function bookingCost(fee, sessions) {
  return Number(fee) * Number(sessions);
}

// Booking receipt id, e.g. "SK-2026-4821".
// The 4-digit part is passed in so tests stay deterministic.
function receiptId(digits) {
  return "SK-2026-" + String(digits);
}

// PHQ-2 style self-check scoring (sample, NOT a diagnosis).
// answers: [0..3, 0..3]. Returns { score, band, advice }.
function selfCheckScore(a1, a2) {
  var score = Number(a1) + Number(a2);
  var band, advice;
  if (score <= 2) {
    band = "low";
    advice = "Your answers suggest low distress right now. Keep checking in with yourself.";
  } else if (score <= 4) {
    band = "moderate";
    advice = "Your answers suggest some distress. Consider talking to someone you trust, or a counselor.";
  } else {
    band = "high";
    advice = "Your answers suggest significant distress. Please consider booking a session with a verified counselor.";
  }
  return { score: score, band: band, advice: advice };
}

// 4-7-8 breathing timer: 4s in, 7s hold, 8s out = 19s cycle.
// elapsedSeconds counts from 0. Returns { phase, phaseSecond, cycleSecond }.
function breathingPhase(elapsedSeconds) {
  var t = Number(elapsedSeconds) % 19;
  var phase, phaseSecond;
  if (t < 4) { phase = "inhale"; phaseSecond = t; }
  else if (t < 11) { phase = "hold"; phaseSecond = t - 4; }
  else { phase = "exhale"; phaseSecond = t - 11; }
  return { phase: phase, phaseSecond: phaseSecond, cycleSecond: t };
}

// Human label for the breathing phase.
function breathingLabel(phase) {
  if (phase === "inhale") return "Breathe in";
  if (phase === "hold") return "Hold";
  return "Breathe out";
}

// Journal helpers — pure (storage happens in app.js).
function makeJournalEntry(text, mood) {
  return { id: Date.now(), text: String(text), mood: mood || null, at: new Date().toISOString() };
}
function addJournalEntry(entries, entry) {
  return [entry].concat(entries);
}

// Mood check-in values: 1 (rough) .. 5 (great).
var MOODS = [
  { value: 1, label: "Rough" },
  { value: 2, label: "Low" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Great" }
];
function moodLabel(v) {
  for (var i = 0; i < MOODS.length; i++) {
    if (MOODS[i].value === v) return MOODS[i].label;
  }
  return "Unknown";
}

var LOGIC = {
  norm: norm,
  matchesQuery: matchesQuery,
  searchCounselors: searchCounselors,
  filterByCity: filterByCity,
  filterByFee: filterByFee,
  filterByLanguage: filterByLanguage,
  verifiedOnly: verifiedOnly,
  sortByRating: sortByRating,
  sortByFee: sortByFee,
  applyFilters: applyFilters,
  formatFee: formatFee,
  bookingCost: bookingCost,
  receiptId: receiptId,
  selfCheckScore: selfCheckScore,
  breathingPhase: breathingPhase,
  breathingLabel: breathingLabel,
  makeJournalEntry: makeJournalEntry,
  addJournalEntry: addJournalEntry,
  MOODS: MOODS,
  moodLabel: moodLabel
};

if (typeof module !== "undefined") module.exports = LOGIC;

// ============================================================
// test.js — plain node assert, no npm packages.
// Deterministic: data.js contains no Math.random; every value
// is written out explicitly.
// Run: node test.js
// ============================================================

var assert = require("assert");
var DATA = require("./data.js");
var L = require("./logic.js");

var n = 0;
function eq(actual, expected, msg) {
  n++;
  assert.strictEqual(actual, expected, msg);
}
function ok(value, msg) {
  n++;
  assert.ok(value, msg);
}

// ---------------- search ----------------
eq(L.searchCounselors(DATA.COUNSELORS, "").length, 10, "empty query returns all");
eq(L.searchCounselors(DATA.COUNSELORS, "sana").length, 1, "name search");
eq(L.searchCounselors(DATA.COUNSELORS, "SANA").length, 1, "search is case-insensitive");
eq(L.searchCounselors(DATA.COUNSELORS, "exam anxiety").length, 3, "specialization search");
eq(L.searchCounselors(DATA.COUNSELORS, "lahore").length, 3, "city search");
eq(L.searchCounselors(DATA.COUNSELORS, "pashto").length, 1, "language search");
eq(L.searchCounselors(DATA.COUNSELORS, "zzz-no-match").length, 0, "no match");

// ---------------- city / fee / language / verified ----------------
eq(L.filterByCity(DATA.COUNSELORS, "Karachi").length, 2, "karachi count");
eq(L.filterByCity(DATA.COUNSELORS, "").length, 10, "all cities");
eq(L.filterByFee(DATA.COUNSELORS, 2500, 3000).length, 4, "fee band 2500-3000");
eq(L.filterByFee(DATA.COUNSELORS, 0, 2499).length, 0, "nothing under 2500");
eq(L.filterByLanguage(DATA.COUNSELORS, "Pashto").length, 1, "pashto speakers");
eq(L.filterByLanguage(DATA.COUNSELORS, "Urdu").length, 10, "all speak urdu");
eq(L.verifiedOnly(DATA.COUNSELORS).length, 9, "one unverified counselor");
eq(L.sortByRating(DATA.COUNSELORS)[0].rating, 4.9, "top rating first");
eq(L.sortByFee(DATA.COUNSELORS)[0].fee, 2500, "cheapest first");

// ---------------- combined filters ----------------
var f1 = L.applyFilters(DATA.COUNSELORS, { verifiedOnly: true, city: "Lahore", sort: "fee" });
eq(f1.length, 2, "lahore verified sorted by fee");
eq(f1[0].fee <= f1[1].fee, true, "fee ascending");
var f2 = L.applyFilters(DATA.COUNSELORS, { language: "Saraiki" });
eq(f2.length, 1, "saraiki filter");
eq(f2[0].name, "Dr. Nadia Iqbal", "saraiki speaker is Nadia");

// ---------------- fee + booking math ----------------
eq(L.formatFee(3500), "Rs 3,500", "fee formatting");
eq(L.formatFee(2500), "Rs 2,500", "fee formatting 2");
eq(L.bookingCost(3500, 4), 14000, "4 sessions at 3500");
eq(L.bookingCost(2800, 1), 2800, "single session");
eq(L.receiptId("4821"), "SK-2026-4821", "receipt format");

// ---------------- self-check scoring ----------------
var s1 = L.selfCheckScore(0, 0);
eq(s1.score, 0, "min score");
eq(s1.band, "low", "0 -> low");
var s2 = L.selfCheckScore(1, 2);
eq(s2.score, 3, "score 3");
eq(s2.band, "moderate", "3 -> moderate");
var s3 = L.selfCheckScore(3, 3);
eq(s3.score, 6, "max score");
eq(s3.band, "high", "6 -> high");
var s4 = L.selfCheckScore(2, 2);
eq(s4.band, "moderate", "4 -> moderate");
var s5 = L.selfCheckScore(2, 3);
eq(s5.band, "high", "5 -> high");
ok(s1.advice.length > 10, "advice text present");

// ---------------- breathing timer ----------------
var b1 = L.breathingPhase(0);
eq(b1.phase, "inhale", "t=0 inhale");
eq(L.breathingPhase(3.9).phase, "inhale", "t=3.9 inhale");
var b2 = L.breathingPhase(4);
eq(b2.phase, "hold", "t=4 hold");
eq(b2.phaseSecond, 0, "hold starts at 0");
eq(L.breathingPhase(10.9).phase, "hold", "t=10.9 hold");
var b3 = L.breathingPhase(11);
eq(b3.phase, "exhale", "t=11 exhale");
eq(L.breathingPhase(18.9).phase, "exhale", "t=18.9 exhale");
var b4 = L.breathingPhase(19);
eq(b4.phase, "inhale", "cycle wraps at 19");
eq(b4.cycleSecond, 0, "cycle restarts");
eq(L.breathingLabel("inhale"), "Breathe in", "inhale label");
eq(L.breathingLabel("hold"), "Hold", "hold label");
eq(L.breathingLabel("exhale"), "Breathe out", "exhale label");

// ---------------- journal ----------------
var e = L.makeJournalEntry("Exam week is heavy.", 2);
ok(e.text === "Exam week is heavy.", "entry text");
eq(e.mood, 2, "entry mood");
var list = L.addJournalEntry([], e);
eq(list.length, 1, "entry added");
eq(list[0], e, "newest first");

// ---------------- moods ----------------
eq(L.moodLabel(1), "Rough", "mood 1");
eq(L.moodLabel(5), "Great", "mood 5");
eq(L.moodLabel(99), "Unknown", "mood unknown");

// ---------------- data sanity ----------------
eq(DATA.CITIES.length, 6, "six cities");
eq(DATA.COUNSELORS.length, 10, "ten counselors");
eq(DATA.ARTICLES.length, 6, "six articles");
eq(DATA.HELPLINES.length, 3, "three helplines");
ok(DATA.HELPLINES.every(function (h) { return h.sample === true; }), "all helplines marked sample");
ok(DATA.COUNSELORS.every(function (c) { return c.fee >= 2500 && c.fee <= 8000; }), "fees in 2500-8000 range");
ok(DATA.SELFCHECK_QUESTIONS.length === 2, "two self-check questions");

console.log("PASS: " + n + "/" + n + " assertions");

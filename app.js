// ============================================================
// app.js — renders the Sukoon demo UI and wires up interactions.
// DATA (data.js) and LOGIC (logic.js) are plain script globals.
// localStorage holds journal entries, bookings, and today's mood.
// ============================================================

(function () {
  "use strict";

  // ---------- tiny helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  // ---------- tabs ----------
  var TABS = ["home", "counselors", "selfcheck", "journal", "crisis"];
  function showTab(name) {
    TABS.forEach(function (t) {
      $("tab-" + t).classList.toggle("active", t === name);
      $("panel-" + t).classList.toggle("active", t === name);
    });
    if (name === "crisis") stopBreathing();
  }

  // ---------- home: mood check-in + learn articles ----------
  function renderMoods() {
    var saved = loadJSON(DATA.MOOD_KEY, null);
    var row = $("mood-row");
    row.innerHTML = "";
    LOGIC.MOODS.forEach(function (m) {
      var b = document.createElement("button");
      b.className = "mood" + (saved && saved.value === m.value ? " selected" : "");
      b.innerHTML = '<span class="mood-face" data-mood="' + m.value + '"></span>' +
                    '<span class="mood-label">' + m.label + "</span>";
      b.onclick = function () {
        saveJSON(DATA.MOOD_KEY, { value: m.value, at: new Date().toISOString() });
        renderMoods();
        $("mood-msg").textContent = "Noted — " + LOGIC.moodLabel(m.value).toLowerCase() +
          ". Be kind to yourself today.";
      };
      row.appendChild(b);
    });
    // draw simple faces via CSS class hook
    row.querySelectorAll(".mood-face").forEach(function (el) {
      el.setAttribute("data-face", el.getAttribute("data-mood"));
    });
  }

  function renderArticles() {
    var box = $("articles");
    box.innerHTML = "";
    DATA.ARTICLES.forEach(function (a) {
      var d = document.createElement("article");
      d.className = "card article";
      d.innerHTML = "<h3>" + esc(a.title) + "</h3>" +
        "<p>" + esc(a.summary) + "</p>" +
        '<span class="meta">' + a.minutes + " min read</span>";
      box.appendChild(d);
    });
  }

  // ---------- counselors: list + filters + modal + booking ----------
  function counselorCard(c) {
    var badge = c.verified
      ? '<span class="verified">\u2713 Verified</span>'
      : '<span class="unverified">Unverified</span>';
    return '<div class="card counselor" data-id="' + c.id + '">' +
      '<div class="c-top"><div class="avatar">' + esc(initials(c.name)) + "</div>" +
      '<div><h3>' + esc(c.name) + "</h3>" +
      '<p class="muted">' + esc(c.city) + " \u00b7 " + esc(c.credentials) + "</p>" +
      '<p class="muted">' + c.specializations.map(esc).join(" \u00b7 ") + "</p></div></div>" +
      '<div class="c-bottom"><span class="stars">\u2605 ' + c.rating.toFixed(1) + "</span> " + badge +
      '<span class="fee">' + LOGIC.formatFee(c.fee) + "/session</span>" +
      '<span class="langs">' + c.languages.map(esc).join(" / ") + "</span></div></div>";
  }

  function initials(name) {
    return name.replace(/^Dr\.\s*/, "").split(/\s+/).slice(0, 2)
      .map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  function renderCounselors() {
    var opts = {
      verifiedOnly: $("f-verified").checked,
      city: $("f-city").value,
      minFee: 0,
      maxFee: parseInt($("f-maxfee").value, 10) || Infinity,
      language: $("f-lang").value,
      query: $("f-search").value,
      sort: $("f-sort").value
    };
    var list = LOGIC.applyFilters(DATA.COUNSELORS, opts);
    var box = $("counselor-list");
    box.innerHTML = list.length
      ? list.map(counselorCard).join("")
      : '<p class="empty">No counselors match these filters. Try widening the fee range.</p>';
    box.querySelectorAll(".counselor").forEach(function (el) {
      el.onclick = function () { openProfile(el.getAttribute("data-id")); };
    });
    $("result-count").textContent = list.length + " counselor" + (list.length === 1 ? "" : "s");
  }

  function fillFilterOptions() {
    var city = $("f-city"), lang = $("f-lang");
    DATA.CITIES.forEach(function (c) {
      city.add(new Option(c, c));
    });
    ["Urdu", "English", "Pashto", "Saraiki"].forEach(function (l) {
      lang.add(new Option(l, l));
    });
  }

  // ----- counselor detail modal + booking flow -----
  var booking = null; // { counselor, day, time, anonymous }

  function openProfile(id) {
    var c = DATA.COUNSELORS.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    booking = { counselor: c, day: null, time: null, anonymous: true };
    renderBookingStep();
    $("modal").classList.add("open");
  }
  function closeModal() {
    $("modal").classList.remove("open");
    booking = null;
  }

  function renderBookingStep() {
    var c = booking.counselor;
    var days = Object.keys(c.slots);
    var slotHtml = days.map(function (day) {
      var btns = c.slots[day].map(function (t) {
        var sel = booking.day === day && booking.time === t ? " selected" : "";
        return '<button class="slot' + sel + '" data-day="' + esc(day) +
          '" data-time="' + esc(t) + '">' + esc(t) + "</button>";
      }).join("");
      return '<div class="slot-day"><span class="day">' + esc(day) + "</span>" + btns + "</div>";
    }).join("");

    $("modal-body").innerHTML =
      '<h2>' + esc(c.name) + "</h2>" +
      '<p class="muted">' + esc(c.credentials) + " \u00b7 " + c.experienceYears + " years \u00b7 " + esc(c.city) + "</p>" +
      '<p class="fee-big">' + LOGIC.formatFee(c.fee) + "/session \u00b7 50 minutes</p>" +
      '<h3>Pick a slot</h3><div class="slots">' + slotHtml + "</div>" +
      '<label class="toggle"><input type="checkbox" id="b-anon" ' +
        (booking.anonymous ? "checked" : "") + "> Book anonymously (name stays hidden)</label>" +
      '<p class="total">Total: <strong>' + LOGIC.formatFee(LOGIC.bookingCost(c.fee, 1)) + "</strong></p>" +
      '<button id="b-confirm" class="btn" ' + (booking.time ? "" : "disabled") + ">Confirm booking</button>" +
      '<p class="muted small">Sample booking — no payment is taken in this concept demo.</p>';

    $("modal-body").querySelectorAll(".slot").forEach(function (el) {
      el.onclick = function () {
        booking.day = el.getAttribute("data-day");
        booking.time = el.getAttribute("data-time");
        renderBookingStep();
      };
    });
    $("b-anon").onchange = function (e) { booking.anonymous = e.target.checked; };
    $("b-confirm").onclick = confirmBooking;
  }

  function confirmBooking() {
    var c = booking.counselor;
    // 4-digit receipt code; random here is fine (receipts are not test logic).
    var digits = String(Math.floor(1000 + Math.random() * 9000));
    var receipt = {
      id: LOGIC.receiptId(digits),
      counselor: c.name,
      day: booking.day,
      time: booking.time,
      fee: c.fee,
      anonymous: booking.anonymous,
      at: new Date().toISOString()
    };
    var all = loadJSON(DATA.BOOKINGS_KEY, []);
    all.unshift(receipt);
    saveJSON(DATA.BOOKINGS_KEY, all);

    $("modal-body").innerHTML =
      '<div class="receipt"><h2>Booking confirmed</h2>' +
      '<p class="receipt-id">' + esc(receipt.id) + "</p>" +
      '<p><strong>' + esc(c.name) + "</strong> \u00b7 " + esc(receipt.day) + " at " + esc(receipt.time) + "</p>" +
      '<p>' + LOGIC.formatFee(receipt.fee) + " \u00b7 " + (receipt.anonymous ? "Anonymous booking" : "Named booking") + "</p>" +
      '<p class="muted small">Saved on this device. Show this receipt code at the session.</p>' +
      '<button id="b-done" class="btn">Done</button></div>';
    $("b-done").onclick = closeModal;
  }

  // ---------- self-check ----------
  function renderSelfCheck() {
    var form = $("selfcheck-form");
    form.innerHTML = "";
    DATA.SELFCHECK_QUESTIONS.forEach(function (q, qi) {
      var wrap = document.createElement("div");
      wrap.className = "card";
      wrap.innerHTML = "<p><strong>Q" + (qi + 1) + ".</strong> " + esc(q) + "</p>";
      DATA.SELFCHECK_OPTIONS.forEach(function (o) {
        var lab = document.createElement("label");
        lab.className = "radio";
        lab.innerHTML = '<input type="radio" name="q' + qi + '" value="' + o.value + '"> ' + esc(o.label);
        wrap.appendChild(lab);
      });
      form.appendChild(wrap);
    });
    var btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "See my result";
    btn.onclick = scoreSelfCheck;
    form.appendChild(btn);
  }

  function scoreSelfCheck() {
    var vals = [0, 1].map(function (qi) {
      var sel = document.querySelector('input[name="q' + qi + '"]:checked');
      return sel ? parseInt(sel.value, 10) : 0;
    });
    var r = LOGIC.selfCheckScore(vals[0], vals[1]);
    $("selfcheck-result").innerHTML =
      '<div class="card result"><h3>Your check-in: ' + r.score + " / 6 \u2014 " + r.band + "</h3>" +
      "<p>" + esc(r.advice) + "</p>" +
      '<p class="muted small">This is a sample well-being check, not a medical diagnosis. ' +
      "If you are struggling, please talk to a verified counselor.</p></div>";
  }

  // ---------- journal ----------
  function renderJournal() {
    var entries = loadJSON(DATA.JOURNAL_KEY, []);
    var box = $("journal-list");
    box.innerHTML = entries.length
      ? entries.map(function (e) {
          var mood = e.mood ? " \u00b7 mood: " + LOGIC.moodLabel(e.mood) : "";
          return '<div class="card"><p>' + esc(e.text) + "</p>" +
            '<span class="meta">' + esc(e.at.slice(0, 10)) + esc(mood) + "</span></div>";
        }).join("")
      : '<p class="empty">Nothing written yet. Your journal stays on this device.</p>';
  }

  function saveJournal() {
    var text = $("journal-text").value.trim();
    if (!text) return;
    var saved = loadJSON(DATA.MOOD_KEY, null);
    var entry = LOGIC.makeJournalEntry(text, saved ? saved.value : null);
    var entries = loadJSON(DATA.JOURNAL_KEY, []);
    saveJSON(DATA.JOURNAL_KEY, LOGIC.addJournalEntry(entries, entry));
    $("journal-text").value = "";
    renderJournal();
  }

  // ---------- crisis: helplines + breathing timer ----------
  function renderHelplines() {
    var box = $("helplines");
    box.innerHTML = "";
    DATA.HELPLINES.forEach(function (h) {
      var d = document.createElement("div");
      d.className = "card helpline";
      d.innerHTML = "<div><h3>" + esc(h.name) + "</h3>" +
        '<p class="muted">' + esc(h.hours) + "</p></div>" +
        '<span class="call">' + esc(h.number) + "</span>";
      box.appendChild(d);
    });
  }

  var breathTimer = null, breathStart = 0;
  function startBreathing() {
    stopBreathing();
    breathStart = Date.now();
    var circle = $("breath-circle"), label = $("breath-label");
    $("breath-start").textContent = "Restart";
    breathTimer = setInterval(function () {
      var elapsed = (Date.now() - breathStart) / 1000;
      var p = LOGIC.breathingPhase(elapsed);
      label.textContent = LOGIC.breathingLabel(p.phase);
      // scale 1.0 -> 1.35 on inhale, hold at peak, shrink on exhale
      var k = p.phase === "inhale" ? p.phaseSecond / 4
            : p.phase === "hold" ? 1
            : 1 - p.phaseSecond / 8;
      circle.style.transform = "scale(" + (1 + 0.35 * k).toFixed(3) + ")";
    }, 100);
  }
  function stopBreathing() {
    if (breathTimer) { clearInterval(breathTimer); breathTimer = null; }
  }

  // ---------- init ----------
  function init() {
    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.onclick = function () { showTab(btn.getAttribute("data-tab")); };
    });
    fillFilterOptions();
    ["f-verified", "f-city", "f-maxfee", "f-lang", "f-search", "f-sort"].forEach(function (id) {
      $(id).addEventListener("input", renderCounselors);
      $(id).addEventListener("change", renderCounselors);
    });
    $("modal-close").onclick = closeModal;
    $("modal").addEventListener("click", function (e) {
      if (e.target === $("modal")) closeModal();
    });
    $("journal-save").onclick = saveJournal;
    $("breath-start").onclick = startBreathing;
    renderMoods();
    renderArticles();
    renderCounselors();
    renderSelfCheck();
    renderJournal();
    renderHelplines();
    showTab("home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

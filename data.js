// ============================================================
// SAMPLE DATA — invented for this UX concept.
// Every counselor, fee, rating, helpline, and article below is
// made up for the demo. These are NOT real professionals or
// real helpline numbers. (Helpline numbers are placeholders:
// 1XXX, 2XXX, 3XXX.)
// ============================================================

var SAMPLE_NOTE = "Sample data — invented for this UX concept. Counselors and helplines are not real.";

var CITIES = ["Lahore", "Karachi", "Islamabad", "Peshawar", "Rawalpindi", "Multan"];

var WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 10 sample counselors across 6 Pakistani cities.
// fee: PKR per 50-minute session. verified: credential check passed.
var COUNSELORS = [
  {
    id: "sana-tariq",
    name: "Dr. Sana Tariq",
    city: "Lahore",
    credentials: "MSc Clinical Psychology, PU Lahore",
    experienceYears: 8,
    specializations: ["Exam anxiety", "Stress", "Sleep issues"],
    languages: ["Urdu", "English"],
    fee: 3500,
    rating: 4.9,
    sessions: 212,
    verified: true,
    slots: { Wed: ["10:00 AM", "2:00 PM", "6:00 PM"], Thu: ["11:00 AM", "4:00 PM"], Fri: ["10:00 AM", "7:00 PM"] }
  },
  {
    id: "ahmed-raza",
    name: "Ahmed Raza",
    city: "Lahore",
    credentials: "MA Psychology, GC University Lahore",
    experienceYears: 5,
    specializations: ["Depression", "Grief"],
    languages: ["Urdu"],
    fee: 2800,
    rating: 4.8,
    sessions: 140,
    verified: true,
    slots: { Mon: ["9:00 AM", "1:00 PM"], Wed: ["3:00 PM", "8:00 PM"], Sat: ["10:00 AM"] }
  },
  {
    id: "hira-aslam",
    name: "Dr. Hira Aslam",
    city: "Karachi",
    credentials: "PhD Clinical Psychology, University of Karachi",
    experienceYears: 12,
    specializations: ["Family", "Relationships", "Marital issues"],
    languages: ["Urdu", "English"],
    fee: 5000,
    rating: 4.9,
    sessions: 380,
    verified: true,
    slots: { Tue: ["10:00 AM", "5:00 PM"], Thu: ["2:00 PM", "6:00 PM"], Sat: ["11:00 AM", "4:00 PM"] }
  },
  {
    id: "bilal-ahmed",
    name: "Bilal Ahmed",
    city: "Karachi",
    credentials: "MSc Applied Psychology, IBA Karachi",
    experienceYears: 4,
    specializations: ["Stress", "Burnout", "Work pressure"],
    languages: ["Urdu", "English"],
    fee: 3000,
    rating: 4.7,
    sessions: 96,
    verified: true,
    slots: { Mon: ["6:00 PM", "8:00 PM"], Fri: ["5:00 PM", "7:00 PM"] }
  },
  {
    id: "ayesha-khan",
    name: "Dr. Ayesha Khan",
    city: "Islamabad",
    credentials: "MS Clinical Psychology, NUST",
    experienceYears: 10,
    specializations: ["Anxiety", "OCD", "Panic attacks"],
    languages: ["English", "Urdu"],
    fee: 6000,
    rating: 4.9,
    sessions: 310,
    verified: true,
    slots: { Tue: ["11:00 AM", "3:00 PM"], Wed: ["10:00 AM"], Thu: ["5:00 PM", "8:00 PM"] }
  },
  {
    id: "usman-tariq",
    name: "Usman Tariq",
    city: "Islamabad",
    credentials: "Diploma in Counseling, Preston University",
    experienceYears: 3,
    specializations: ["Career stress", "Exam anxiety"],
    languages: ["Urdu"],
    fee: 2500,
    rating: 4.6,
    sessions: 58,
    verified: true,
    slots: { Mon: ["10:00 AM", "2:00 PM"], Sat: ["12:00 PM", "5:00 PM"] }
  },
  {
    id: "fatima-noor",
    name: "Dr. Fatima Noor",
    city: "Peshawar",
    credentials: "MSc Psychology, University of Peshawar",
    experienceYears: 9,
    specializations: ["Trauma", "Grief", "Anxiety"],
    languages: ["Urdu", "Pashto"],
    fee: 3200,
    rating: 4.8,
    sessions: 175,
    verified: true,
    slots: { Wed: ["9:00 AM", "4:00 PM"], Fri: ["10:00 AM", "3:00 PM"] }
  },
  {
    id: "kamran-shah",
    name: "Kamran Shah",
    city: "Rawalpindi",
    credentials: "MS Counseling Psychology, Bahria University",
    experienceYears: 6,
    specializations: ["Depression", "Sleep issues", "Self-esteem"],
    languages: ["Urdu", "English"],
    fee: 4000,
    rating: 4.7,
    sessions: 122,
    verified: true,
    slots: { Tue: ["7:00 PM", "9:00 PM"], Thu: ["7:00 PM"], Sat: ["10:00 AM", "1:00 PM"] }
  },
  {
    id: "nadia-iqbal",
    name: "Dr. Nadia Iqbal",
    city: "Multan",
    credentials: "PhD Psychology, BZU Multan",
    experienceYears: 11,
    specializations: ["Family", "Marital issues", "Parenting"],
    languages: ["Urdu", "Saraiki"],
    fee: 4500,
    rating: 4.8,
    sessions: 240,
    verified: true,
    slots: { Mon: ["11:00 AM"], Wed: ["2:00 PM", "6:00 PM"], Fri: ["9:00 AM", "12:00 PM"] }
  },
  {
    id: "saad-mehmood",
    name: "Saad Mehmood",
    city: "Lahore",
    credentials: "BS Psychology, certified CBT practitioner",
    experienceYears: 2,
    specializations: ["Exam anxiety", "Self-esteem"],
    languages: ["Urdu", "English"],
    fee: 2600,
    rating: 4.5,
    sessions: 34,
    verified: false,
    slots: { Tue: ["4:00 PM"], Thu: ["4:00 PM", "6:00 PM"] }
  }
];

// 6 sample "Learn" articles — calm, exam-season relevant reading.
var ARTICLES = [
  { id: "exam-stress", title: "Exam stress is real. Here is how to carry it.", minutes: 4,
    summary: "Why exam season spikes anxiety, and three small routines that bring it down." },
  { id: "sleep", title: "Sleep is not laziness", minutes: 3,
    summary: "How late-night cramming wrecks memory — and a gentler night routine." },
  { id: "stigma", title: "Asking for help is not weakness", minutes: 5,
    summary: "Untangling the stigma around therapy in Pakistani families." },
  { id: "breathing", title: "The 4-7-8 breath, explained", minutes: 2,
    summary: "A two-minute calming technique you can use before walking into an exam hall." },
  { id: "family-talk", title: "Talking to your family about therapy", minutes: 6,
    summary: "Gentle scripts for the hardest conversation: telling your parents you want help." },
  { id: "when-help", title: "When to talk to a professional", minutes: 4,
    summary: "Clear, judgment-free signs that it is time to book a session." }
];

// Crisis helplines — SAMPLE ONLY. Placeholder numbers, clearly labeled.
// A real app would list verified, currently-operating helplines.
var HELPLINES = [
  { name: "TalkLine (sample)", hours: "24/7 \u00b7 Urdu + English", number: "1XXX", sample: true },
  { name: "Raat Bhar Saathi (sample)", hours: "8 PM \u2013 2 AM \u00b7 Urdu", number: "2XXX", sample: true },
  { name: "Student Calm Line (sample)", hours: "Exam season \u00b7 Urdu", number: "3XXX", sample: true }
];

// PHQ-2 style self-check — SAMPLE screening, not a diagnosis.
// Two questions, each scored 0-3.
var SELFCHECK_QUESTIONS = [
  "Over the last 2 weeks, how often have you had little interest or pleasure in doing things?",
  "Over the last 2 weeks, how often have you felt down, depressed, or hopeless?"
];
var SELFCHECK_OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
];

// localStorage keys
var JOURNAL_KEY = "sukoon_journal_v1";
var BOOKINGS_KEY = "sukoon_bookings_v1";
var MOOD_KEY = "sukoon_mood_v1";

var DATA = {
  SAMPLE_NOTE: SAMPLE_NOTE,
  CITIES: CITIES,
  WEEKDAYS: WEEKDAYS,
  COUNSELORS: COUNSELORS,
  ARTICLES: ARTICLES,
  HELPLINES: HELPLINES,
  SELFCHECK_QUESTIONS: SELFCHECK_QUESTIONS,
  SELFCHECK_OPTIONS: SELFCHECK_OPTIONS,
  JOURNAL_KEY: JOURNAL_KEY,
  BOOKINGS_KEY: BOOKINGS_KEY,
  MOOD_KEY: MOOD_KEY
};

if (typeof module !== "undefined") module.exports = DATA;

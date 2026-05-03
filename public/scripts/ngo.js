/* ngo.js — caribbean.countdowns.co */

// ─── Language ───────────────────────────────────────────────────────────────

var LANGS = ["en", "fr", "kr", "es"];
var lang = localStorage.getItem("lang") || "en";

function applyLang() {
  LANGS.forEach(function(l) {
    document.querySelectorAll(".t-" + l).forEach(function(el) {
      el.style.display = l === lang ? "" : "none";
    });
  });
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

window.setLang = function(l) {
  lang = l;
  localStorage.setItem("lang", lang);
  applyLang();
  renderQuizQuestion(); // re-render current question in new lang
};

document.querySelectorAll(".lang-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    window.setLang(btn.getAttribute("data-lang"));
  });
});

applyLang();

// ─── Config ──────────────────────────────────────────────────────────────────

var _cfg = document.getElementById("ngo-config");
var PERIOD_START = new Date(_cfg.dataset.periodStart).getTime();
var PERIOD_END   = new Date(_cfg.dataset.periodEnd).getTime();

var STATS_URL = "/api/ngo-stats";

// Fallback values used while the Worker responds or if it fails
var communityProgress = 0;
var communityContributors = 0;

var MAX_USER_TOTAL   = 25;   // max % a single user can contribute in total
var MAX_PER_SESSION  = 5;    // max % per quiz session (perfect score)

// ─── Gauge ───────────────────────────────────────────────────────────────────

function getUserContribution() {
  return Math.min(parseFloat(localStorage.getItem("ngo_contribution") || "0"), MAX_USER_TOTAL);
}

function addUserContribution(pct) {
  var current = getUserContribution();
  var next = Math.min(current + pct, MAX_USER_TOTAL);
  localStorage.setItem("ngo_contribution", next.toFixed(2));
  return next - current;
}

function getTotalProgress() {
  return Math.min(communityProgress + getUserContribution(), 100);
}

function renderGauge(pct, contributors) {
  var fill = document.getElementById("gauge-fill");
  var label = document.getElementById("gauge-pct");
  var contribEl = document.getElementById("contributors-count");
  if (!fill || !label) return;

  var rounded = Math.min(Math.round(pct * 10) / 10, 100);
  fill.style.width = rounded + "%";
  label.textContent = rounded + "%";

  if (contributors !== undefined) {
    var c = contributors;
    var contribTexts = c > 0
      ? {
          en: c.toLocaleString() + " contributors",
          fr: c.toLocaleString() + " contributeurs",
          kr: c.toLocaleString() + " kontribistè",
          es: c.toLocaleString() + " contribuyentes"
        }
      : {
          en: "Be the first to contribute!",
          fr: "Soyez le premier à contribuer !",
          kr: "Se premye pou kontribyé !",
          es: "¡Sé el primero en contribuir!"
        };
    contribEl.textContent = contribTexts[lang] || contribTexts.en;
  }

  if (pct >= 100) {
    showMissionAccomplished();
  }
}

function animateGaugeTo(targetPct, contributors) {
  var startPct = parseFloat(document.getElementById("gauge-fill").style.width) || 0;
  var current = startPct;
  var step = function() {
    current = Math.min(current + (targetPct - current) * 0.08 + 0.2, targetPct);
    renderGauge(current, contributors);
    if (current < targetPct - 0.1) {
      requestAnimationFrame(step);
    } else {
      renderGauge(targetPct, contributors);
    }
  };
  requestAnimationFrame(step);
}

// ─── Worker API ──────────────────────────────────────────────────────────────

function fetchStats() {
  fetch(STATS_URL)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      communityProgress = data.communityProgress != null ? data.communityProgress : communityProgress;
      communityContributors = data.contributors != null ? data.contributors : communityContributors;
      animateGaugeTo(getTotalProgress(), communityContributors);
    })
    .catch(function() {
      // Worker unreachable — keep fallback values already displayed
    });
}

function postContribution(pct) {
  return fetch(STATS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contribution: pct })
  })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      communityProgress = data.communityProgress != null ? data.communityProgress : communityProgress;
      communityContributors = data.contributors != null ? data.contributors : communityContributors;
    })
    .catch(function() {
      // Worker unreachable — local state still updated
    });
}


// ─── Countdown ───────────────────────────────────────────────────────────────

function pad(n) { return n < 10 ? "0" + n : "" + n; }

function updateCountdown() {
  var diff = PERIOD_END - Date.now();
  var el = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs")
  };
  if (!el.d) return;

  if (diff <= 0) {
    el.d.textContent = "00";
    el.h.textContent = "00";
    el.m.textContent = "00";
    el.s.textContent = "00";
    return;
  }

  var total = Math.floor(diff / 1000);
  var d = Math.floor(total / 86400);
  var h = Math.floor((total % 86400) / 3600);
  var m = Math.floor((total % 3600) / 60);
  var s = total % 60;

  el.d.textContent = d;
  el.h.textContent = pad(h);
  el.m.textContent = pad(m);
  el.s.textContent = pad(s);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ─── Quiz data ───────────────────────────────────────────────────────────────
// Edit questions in src/data/quiz-questions.json — no JS changes needed.

var QUESTIONS = JSON.parse(document.getElementById("quiz-data").getAttribute("data-questions"));

// ─── Quiz state ───────────────────────────────────────────────────────────────

var quizState = {
  current: 0,
  score: 0,
  answered: false,
  active: false
};

function startQuiz() {
  quizState.current = 0;
  quizState.score = 0;
  quizState.answered = false;
  quizState.active = true;

  document.getElementById("quiz-section").classList.add("visible");
  document.getElementById("quiz-result").classList.remove("visible");
  document.getElementById("mission-accomplished").classList.remove("visible");
  document.getElementById("btn-start-quiz").disabled = true;

  buildDots();
  renderQuizQuestion();
  document.getElementById("quiz-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildDots() {
  var container = document.getElementById("quiz-dots");
  container.innerHTML = "";
  QUESTIONS.forEach(function(_, i) {
    var dot = document.createElement("div");
    dot.className = "quiz-dot" + (i === 0 ? " active" : "");
    dot.id = "dot-" + i;
    container.appendChild(dot);
  });
}

function updateDots() {
  QUESTIONS.forEach(function(_, i) {
    var dot = document.getElementById("dot-" + i);
    if (!dot) return;
    dot.className = "quiz-dot" +
      (i < quizState.current ? " done" : "") +
      (i === quizState.current ? " active" : "");
  });
}

function renderQuizQuestion() {
  if (!quizState.active) return;
  var idx = quizState.current;
  if (idx >= QUESTIONS.length) return;

  var q = QUESTIONS[idx];
  var data = q[lang] || q.en;

  var stepLabel = document.getElementById("quiz-step-label");
  var stepTexts = {
    en: "Question " + (idx + 1) + " of " + QUESTIONS.length,
    fr: "Question " + (idx + 1) + " sur " + QUESTIONS.length,
    kr: "Kèstyon " + (idx + 1) + " sou " + QUESTIONS.length,
    es: "Pregunta " + (idx + 1) + " de " + QUESTIONS.length
  };
  stepLabel.textContent = stepTexts[lang] || stepTexts.en;

  document.getElementById("quiz-question").textContent = data.q;

  var optContainer = document.getElementById("quiz-options");
  optContainer.innerHTML = "";
  var letters = ["A", "B", "C", "D"];
  data.opts.forEach(function(opt, i) {
    var btn = document.createElement("button");
    btn.className = "quiz-option";

    var letterSpan = document.createElement("span");
    letterSpan.className = "opt-letter";
    letterSpan.textContent = letters[i];

    var textSpan = document.createElement("span");
    textSpan.className = "opt-text";
    textSpan.textContent = opt;

    btn.appendChild(letterSpan);
    btn.appendChild(textSpan);

    btn.addEventListener("click", function() {
      if (quizState.answered) return;
      selectAnswer(i);
    });
    optContainer.appendChild(btn);
  });

  var feedback = document.getElementById("quiz-feedback");
  feedback.textContent = "";
  feedback.className = "quiz-feedback";

  var nextBtn = document.getElementById("quiz-next");
  nextBtn.className = "quiz-next";

  updateDots();
}

function selectAnswer(chosen) {
  quizState.answered = true;
  var idx = quizState.current;
  var q = QUESTIONS[idx];
  var data = q[lang] || q.en;
  var correct = q.answer;
  var isCorrect = chosen === correct;

  if (isCorrect) quizState.score++;

  // Style options
  var opts = document.querySelectorAll(".quiz-option");
  opts.forEach(function(btn, i) {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    else if (i === chosen && !isCorrect) btn.classList.add("wrong");
  });

  // Feedback
  var feedback = document.getElementById("quiz-feedback");
  var correctTexts = {
    en: "Correct! ",
    fr: "Correct ! ",
    kr: "Korrèk ! ",
    es: "¡Correcto! "
  };
  var wrongTexts = {
    en: "Not quite. ",
    fr: "Pas tout à fait. ",
    kr: "Pa tout a fè. ",
    es: "No del todo. "
  };
  var prefix = isCorrect ? (correctTexts[lang] || correctTexts.en) : (wrongTexts[lang] || wrongTexts.en);
  feedback.textContent = prefix + (data.explain || "");
  feedback.className = "quiz-feedback visible" + (isCorrect ? "" : " wrong-fb");

  // Show next button
  var nextBtn = document.getElementById("quiz-next");
  var isLast = (idx === QUESTIONS.length - 1);
  var finishTexts = {
    en: "See my results →",
    fr: "Voir mes résultats →",
    kr: "Wè rezilta mwen →",
    es: "Ver mis resultados →"
  };
  nextBtn.innerHTML = isLast
    ? '<span class="t-en">See my results →</span><span class="t-fr">Voir mes résultats →</span><span class="t-kr">Wè rezilta mwen →</span><span class="t-es">Ver mis resultados →</span>'
    : '<span class="t-en">Next →</span><span class="t-fr">Suivant →</span><span class="t-kr">Swivan →</span><span class="t-es">Siguiente →</span>';
  nextBtn.className = "quiz-next visible";
  applyLang();
}

function nextQuestion() {
  quizState.answered = false;
  quizState.current++;

  if (quizState.current >= QUESTIONS.length) {
    showResult();
    return;
  }

  renderQuizQuestion();
}

function showResult() {
  quizState.active = false;
  document.getElementById("quiz-section").classList.remove("visible");
  document.getElementById("quiz-result").classList.add("visible");
  document.getElementById("quiz-next").className = "quiz-next";

  var score = quizState.score;
  var total = QUESTIONS.length;
  var pct = Math.round((score / total) * MAX_PER_SESSION * 10) / 10;

  addUserContribution(pct);

  document.getElementById("result-score").textContent = score + "/" + total;

  var resultTexts = {
    en: score >= 7 ? "Excellent! You really know your Caribbean marine ecosystems." :
        score >= 5 ? "Good job! Every question answered helps the mission." :
                     "Thanks for playing — keep learning to do better next time!",
    fr: score >= 7 ? "Excellent ! Vous connaissez vraiment les écosystèmes marins de la Caraïbe." :
        score >= 5 ? "Bon travail ! Chaque réponse aide la mission." :
                     "Merci de jouer — continuez à apprendre pour faire mieux la prochaine fois !",
    kr: score >= 7 ? "Ekselan ! Ou vrèman konnen ekosistèm maren Karayib la." :
        score >= 5 ? "Bon travay ! Chak repons édé misyon an." :
                     "Mèsi pou jwe — kontinye aprann pou fè miyò pwochen fwa !",
    es: score >= 7 ? "¡Excelente! Realmente conoces los ecosistemas marinos del Caribe." :
        score >= 5 ? "¡Buen trabajo! Cada respuesta ayuda a la misión." :
                     "¡Gracias por jugar — sigue aprendiendo para hacerlo mejor la próxima vez!"
  };
  document.getElementById("result-label").textContent = resultTexts[lang] || resultTexts.en;

  postContribution(pct).then(function() {
    var newTotal = getTotalProgress();
    var contributionTexts = {
      en: "+" + pct.toFixed(1) + "% added to the community gauge → now at " + newTotal.toFixed(1) + "%",
      fr: "+" + pct.toFixed(1) + "% ajoutés à la jauge collective → maintenant à " + newTotal.toFixed(1) + "%",
      kr: "+" + pct.toFixed(1) + "% ajoute nan jwaj kominotè a → kounye a " + newTotal.toFixed(1) + "%",
      es: "+" + pct.toFixed(1) + "% añadidos al marcador colectivo → ahora en " + newTotal.toFixed(1) + "%"
    };
    document.getElementById("result-contribution").textContent = contributionTexts[lang] || contributionTexts.en;
    animateGaugeTo(newTotal, communityContributors);
  });

  applyLang();

  document.getElementById("quiz-result").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showMissionAccomplished() {
  document.getElementById("quiz-result").classList.remove("visible");
  document.getElementById("quiz-section").classList.remove("visible");
  document.getElementById("mission-accomplished").classList.add("visible");
  document.getElementById("btn-start-quiz").disabled = true;
  document.getElementById("btn-start-quiz").innerHTML =
    '<span class="t-en">🎉 Mission complete!</span>' +
    '<span class="t-fr">🎉 Mission accomplie !</span>' +
    '<span class="t-kr">🎉 Misyon akonpli !</span>' +
    '<span class="t-es">🎉 ¡Misión cumplida!</span>';
  applyLang();
}

// ─── Event listeners ──────────────────────────────────────────────────────────

document.getElementById("btn-start-quiz").addEventListener("click", function() {
  startQuiz();
});

document.getElementById("quiz-next").addEventListener("click", function() {
  nextQuestion();
});

document.getElementById("btn-replay").addEventListener("click", function() {
  document.getElementById("quiz-result").classList.remove("visible");
  document.getElementById("btn-start-quiz").disabled = false;
  startQuiz();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

// Show local estimate immediately, then update with real Worker data
setTimeout(function() {
  animateGaugeTo(getTotalProgress(), communityContributors);
  fetchStats();
}, 400);

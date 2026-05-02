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
    var contribTexts = {
      en: c.toLocaleString() + " contributors",
      fr: c.toLocaleString() + " contributeurs",
      kr: c.toLocaleString() + " kontribistè",
      es: c.toLocaleString() + " contribuyentes"
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
      communityProgress = data.communityProgress || communityProgress;
      communityContributors = data.contributors || communityContributors;
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
      communityProgress = data.communityProgress || communityProgress;
      communityContributors = data.contributors || communityContributors;
    })
    .catch(function() {
      // Worker unreachable — local state still updated
    });
}

function animateGaugeTo(target) {
  var current = 0;
  var step = function() {
    current = Math.min(current + (target - current) * 0.08 + 0.2, target);
    renderGauge(current);
    if (current < target - 0.1) {
      requestAnimationFrame(step);
    } else {
      renderGauge(target);
    }
  };
  requestAnimationFrame(step);
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

var QUESTIONS = [
  {
    en: {
      q: "What percentage of all marine species depend on coral reefs, even though reefs cover less than 1% of the ocean floor?",
      opts: ["5%", "10%", "25%", "50%"],
      explain: "Coral reefs are often called the 'rainforests of the sea' — they cover under 1% of the ocean but support 25% of all marine species."
    },
    fr: {
      q: "Quel pourcentage des espèces marines dépend des récifs coralliens, qui couvrent moins de 1 % du fond marin ?",
      opts: ["5%", "10%", "25%", "50%"],
      explain: "Les récifs coralliens sont souvent appelés les 'forêts tropicales de la mer' — ils couvrent moins de 1 % de l'océan mais soutiennent 25 % de toutes les espèces marines."
    },
    kr: {
      q: "Ki pousan espès maren ki depann sou rekif koray, ki kouvri mwens pase 1% fon lanmè a ?",
      opts: ["5%", "10%", "25%", "50%"],
      explain: "Rekif koray yo rele souvan 'forè twopikal lanmè a' — yo kouvri mwens pase 1% losean an men yo sipòté 25% tout espès maren yo."
    },
    es: {
      q: "¿Qué porcentaje de las especies marinas depende de los arrecifes de coral, que cubren menos del 1% del fondo oceánico?",
      opts: ["5%", "10%", "25%", "50%"],
      explain: "Los arrecifes de coral se llaman a menudo las 'selvas tropicales del mar' — cubren menos del 1% del océano pero sostienen el 25% de todas las especies marinas."
    },
    answer: 2
  },
  {
    en: {
      q: "What is the primary cause of coral bleaching in the Caribbean?",
      opts: ["Plastic pollution", "Rising ocean temperatures", "Overfishing", "Freshwater runoff"],
      explain: "When ocean temperatures rise even 1–2°C above normal for several weeks, corals expel their symbiotic algae and turn white. Without the algae, they slowly starve."
    },
    fr: {
      q: "Quelle est la principale cause du blanchissement des coraux dans la Caraïbe ?",
      opts: ["La pollution plastique", "La hausse des températures océaniques", "La surpêche", "Les eaux de ruissellement"],
      explain: "Lorsque les températures de l'océan augmentent de 1 à 2 °C au-dessus de la normale pendant plusieurs semaines, les coraux expulsent leurs algues symbiotiques et blanchissent. Sans algues, ils meurent lentement."
    },
    kr: {
      q: "Ki prensipal koz blanchisman koray nan Karayib la ?",
      opts: ["Pòlisyon plastik", "Ogmantasyon tanperati losean", "Lapèch anpil", "Dlo lapli koule"],
      explain: "Lè tanperati lanmè a monte 1-2°C anwo nòmal pou plizyè semèn, koray yo jete alg sinbiyotik yo épi tounen blan. San alg, yo mouri dousman."
    },
    es: {
      q: "¿Cuál es la causa principal del blanqueamiento de corales en el Caribe?",
      opts: ["Contaminación plástica", "Aumento de temperaturas oceánicas", "Pesca excesiva", "Escorrentía de agua dulce"],
      explain: "Cuando las temperaturas oceánicas suben 1-2°C por encima de lo normal durante varias semanas, los corales expulsan sus algas simbióticas y se vuelven blancos. Sin las algas, mueren lentamente."
    },
    answer: 1
  },
  {
    en: {
      q: "What critical role do mangroves play in Caribbean marine ecosystems?",
      opts: ["They produce oxygen for deep-sea creatures", "They serve as nurseries for fish and protect coasts from storms", "They filter saltwater into drinking water", "They regulate ocean currents"],
      explain: "Mangroves are vital nurseries where juvenile fish grow before moving to reefs. Their dense roots also buffer coastlines against hurricane damage."
    },
    fr: {
      q: "Quel rôle essentiel jouent les mangroves dans les écosystèmes marins caribéens ?",
      opts: ["Elles produisent de l'oxygène pour les créatures des grands fonds", "Elles servent de nurseries aux poissons et protègent les côtes des tempêtes", "Elles filtrent l'eau de mer en eau potable", "Elles régulent les courants océaniques"],
      explain: "Les mangroves sont des nurseries essentielles où les jeunes poissons grandissent avant de rejoindre les récifs. Leurs racines denses protègent aussi les côtes contre les ouragans."
    },
    kr: {
      q: "Ki wòl kritik pàletivyé jwe nan ekosistèm maren Karayib la ?",
      opts: ["Yo pwodwi oksijèn pou kreyati nan fon lanmè", "Yo sèvi kòm pépinyè pou pwason épi pwotèjé kòt kont tanpèt", "Yo filtre dlo lanmè an dlo pòtab", "Yo règle kouran losean"],
      explain: "Pàletivyé se pépinyè esansyèl kote ti pwason grandi avan yo ale sou rekif. Rasin yo pwotèjé tou kòt kont dommaj ouragan."
    },
    es: {
      q: "¿Qué papel fundamental juegan los manglares en los ecosistemas marinos del Caribe?",
      opts: ["Producen oxígeno para criaturas de aguas profundas", "Sirven como criaderos de peces y protegen las costas de tormentas", "Filtran el agua de mar en agua potable", "Regulan las corrientes oceánicas"],
      explain: "Los manglares son criaderos vitales donde los peces jóvenes crecen antes de moverse a los arrecifes. Sus densas raíces también protegen las costas del daño de huracanes."
    },
    answer: 1
  },
  {
    en: {
      q: "Sea turtles are considered 'keystone species'. What does this mean?",
      opts: ["They are the largest animals in the ocean", "Their presence or absence significantly affects the entire ecosystem", "They have been around since the dinosaurs", "They can live for over 200 years"],
      explain: "Sea turtles maintain healthy seagrass beds by grazing, and nourish beach ecosystems with their eggs. Removing them creates a ripple effect across the entire marine environment."
    },
    fr: {
      q: "Les tortues marines sont des 'espèces clés de voûte'. Qu'est-ce que cela signifie ?",
      opts: ["Ce sont les plus grands animaux de l'océan", "Leur présence ou absence affecte l'ensemble de l'écosystème", "Elles existent depuis les dinosaures", "Elles peuvent vivre plus de 200 ans"],
      explain: "Les tortues marines entretiennent les herbiers en les broutant et nourrissent les écosystèmes côtiers avec leurs œufs. Leur disparition crée un effet domino dans tout l'environnement marin."
    },
    kr: {
      q: "Tòti maren yo konsidéré 'espès pivi'. Kisa sa vlé di ?",
      opts: ["Se yo ki pi gwo bèt nan lanmè a", "Prezans oswa absans yo afèkte tout ekosistèm nan", "Yo ekziste depi tan dinozò yo", "Yo ka viv plis pase 200 an"],
      explain: "Tòti maren yo antretni zèb maren yo nan manjé yo, épi nouri ekosistèm plaj yo ak ze yo. Disparisyon yo kréye yon efè domino nan tout anviwonman maren an."
    },
    es: {
      q: "Las tortugas marinas son 'especies clave'. ¿Qué significa esto?",
      opts: ["Son los animales más grandes del océano", "Su presencia o ausencia afecta significativamente todo el ecosistema", "Han existido desde los dinosaurios", "Pueden vivir más de 200 años"],
      explain: "Las tortugas marinas mantienen saludables las praderas de pastos marinos pastando, y nutren los ecosistemas de playa con sus huevos. Su desaparición crea un efecto cascada en todo el entorno marino."
    },
    answer: 1
  },
  {
    en: {
      q: "Approximately what percentage of Earth's oxygen is produced by ocean plants and phytoplankton?",
      opts: ["20%", "35%", "50%", "70%"],
      explain: "About 50% of Earth's oxygen comes from microscopic ocean plants called phytoplankton. A healthy ocean is literally essential for every breath we take."
    },
    fr: {
      q: "Quel pourcentage environ de l'oxygène terrestre est produit par les plantes océaniques et le phytoplancton ?",
      opts: ["20%", "35%", "50%", "70%"],
      explain: "Environ 50 % de l'oxygène terrestre provient de microscopiques plantes océaniques appelées phytoplancton. Un océan sain est littéralement essentiel à chaque souffle que nous prenons."
    },
    kr: {
      q: "Anviwon ki pousan oksijèn latè a pwodwi pa plant losean épi fitoplankton ?",
      opts: ["20%", "35%", "50%", "70%"],
      explain: "Anviwon 50% oksijèn latè a sòti nan ti plant losean yo rele fitoplankton. On losean an bòn santé se literalman esansyèl pou chak souf nou pran."
    },
    es: {
      q: "¿Aproximadamente qué porcentaje del oxígeno de la Tierra es producido por plantas oceánicas y fitoplancton?",
      opts: ["20%", "35%", "50%", "70%"],
      explain: "Aproximadamente el 50% del oxígeno de la Tierra proviene de microscópicas plantas oceánicas llamadas fitoplancton. Un océano saludable es literalmente esencial para cada respiración que tomamos."
    },
    answer: 2
  },
  {
    en: {
      q: "How much plastic waste enters the world's oceans every year?",
      opts: ["1 million tonnes", "8 million tonnes", "20 million tonnes", "50 million tonnes"],
      explain: "Around 8 million tonnes of plastic enter our oceans annually. Caribbean islands, as small landmasses surrounded by ocean, are disproportionately affected."
    },
    fr: {
      q: "Quelle quantité de plastique pénètre dans les océans chaque année ?",
      opts: ["1 million de tonnes", "8 millions de tonnes", "20 millions de tonnes", "50 millions de tonnes"],
      explain: "Environ 8 millions de tonnes de plastique entrent dans nos océans chaque année. Les îles caribéennes, petites terres entourées d'océan, sont touchées de manière disproportionnée."
    },
    kr: {
      q: "Konbyen plastik ki antre nan losean chak ané ?",
      opts: ["1 milyon tòn", "8 milyon tòn", "20 milyon tòn", "50 milyon tòn"],
      explain: "Anviwon 8 milyon tòn plastik antre nan losean nou yo chak ané. Zile Karayib yo, ti tè ki antoure pa losean, afèkte plis ki lòt kote."
    },
    es: {
      q: "¿Cuántos residuos plásticos entran en los océanos del mundo cada año?",
      opts: ["1 millón de toneladas", "8 millones de toneladas", "20 millones de toneladas", "50 millones de toneladas"],
      explain: "Alrededor de 8 millones de toneladas de plástico entran en nuestros océanos anualmente. Las islas caribeñas, como pequeñas masas de tierra rodeadas de océano, se ven afectadas desproporcionadamente."
    },
    answer: 1
  },
  {
    en: {
      q: "Which of these is NOT currently a threat to Caribbean marine biodiversity?",
      opts: ["Climate change and ocean warming", "Responsible ecotourism with trained guides", "Agricultural runoff and coastal pollution", "Invasive species like the lionfish"],
      explain: "Responsible, regulated ecotourism actually supports conservation by generating funds for NGOs and creating economic incentives to protect the environment. The others are real threats."
    },
    fr: {
      q: "Lequel de ces éléments ne constitue PAS actuellement une menace pour la biodiversité marine caribéenne ?",
      opts: ["Le changement climatique et le réchauffement de l'océan", "L'écotourisme responsable avec des guides formés", "Les rejets agricoles et la pollution côtière", "Les espèces invasives comme le poisson-lion"],
      explain: "L'écotourisme responsable et réglementé soutient en fait la conservation en générant des fonds pour les ONG et en créant des incitations économiques à protéger l'environnement. Les autres sont de vraies menaces."
    },
    kr: {
      q: "Ki nan sa yo pa yon menas aktyèl pou biodivèsité maren Karayib la ?",
      opts: ["Chanjman klimatik épi rechofman losean", "Ekotourism responsab avèk gid fòmé", "Dechaj agrikòl épi pòlisyon kòtal", "Espès envazif tankou pwason lion"],
      explain: "Ekotourism responsab épi règlemante an reyalité sipòté konsèvasyon nan jenere fon pou ONG yo épi kréye ensitasyon ekonomik pou pwotèjé anviwonman an. Lòt yo se vrè menas."
    },
    es: {
      q: "¿Cuál de estos NO es actualmente una amenaza para la biodiversidad marina del Caribe?",
      opts: ["El cambio climático y el calentamiento oceánico", "El ecoturismo responsable con guías capacitados", "La escorrentía agrícola y la contaminación costera", "Especies invasoras como el pez león"],
      explain: "El ecoturismo responsable y regulado en realidad apoya la conservación al generar fondos para las ONG y crear incentivos económicos para proteger el medio ambiente. Los demás son amenazas reales."
    },
    answer: 1
  },
  {
    en: {
      q: "What is a Marine Protected Area (MPA)?",
      opts: ["A zone where all fishing is banned permanently", "A designated ocean area with rules to protect marine life and habitats", "A beach resort certified for environmental practices", "An underwater research facility"],
      explain: "MPAs are designated areas where human activity is regulated to protect ecosystems. They range from fully no-take zones to areas with managed sustainable fishing. The Caribbean needs more of them."
    },
    fr: {
      q: "Qu'est-ce qu'une Aire Marine Protégée (AMP) ?",
      opts: ["Une zone où toute pêche est définitivement interdite", "Une zone océanique désignée avec des règles pour protéger la vie marine et les habitats", "Une station balnéaire certifiée pour ses pratiques environnementales", "Une installation de recherche sous-marine"],
      explain: "Les AMP sont des zones désignées où l'activité humaine est réglementée pour protéger les écosystèmes. Elles vont des zones totalement interdites à la pêche à celles avec une pêche durable gérée. La Caraïbe en a besoin de plus."
    },
    kr: {
      q: "Kisa on Zòn Maren Pwotèjé (AMP) ye ?",
      opts: ["On zòn kote tout lapèch entèdi definitivamente", "On zòn losean désigné avèk règ pou pwotèjé vi maren épi abita", "On resort plaj sètifye pou pratik anviwonmantal li", "On fasilité rechèch anba lanmè"],
      explain: "AMP yo se zòn désigné kote aktivité imen règlemante pou pwotèjé ekosistèm yo. Yo ale de zòn entèdiksyon total pou lapèch a zòn avèk lapèch dirab jere. Karayib la bezwen plis yo."
    },
    es: {
      q: "¿Qué es un Área Marina Protegida (AMP)?",
      opts: ["Una zona donde toda la pesca está permanentemente prohibida", "Un área oceánica designada con reglas para proteger la vida marina y los hábitats", "Un complejo turístico certificado por prácticas medioambientales", "Una instalación de investigación submarina"],
      explain: "Las AMP son áreas designadas donde la actividad humana está regulada para proteger los ecosistemas. Van desde zonas completamente vedadas a la pesca hasta áreas con pesca sostenible gestionada. El Caribe necesita más de ellas."
    },
    answer: 1
  }
];

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
  data.opts.forEach(function(opt, i) {
    var btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;
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

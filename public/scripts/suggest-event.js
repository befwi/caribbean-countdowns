/* suggest-event.js — caribbean.countdowns.co */
var LANGS = ["en", "fr", "kr", "es"];
var lang  = localStorage.getItem("lang") || "en";

var TZ_MAP = {
  "Martinique":             "America/Martinique",
  "Guadeloupe":             "America/Guadeloupe",
  "Marie-Galante":          "America/Guadeloupe",
  "Saint-Lucia":            "America/St_Lucia",
  "French-Guyana":          "America/Cayenne",
  "Sint-Maarten":           "America/Lower_Princes",
  "Saint-Barthélemy":       "America/St_Barthelemy",
  "Barbados":               "America/Barbados",
  "Dominica":               "America/Dominica",
  "British Virgin Islands": "America/Tortola",
};
var COUNTRIES = Object.keys(TZ_MAP);

var DETAILS = ["rap","afro","dancehall","shatta","zouk","kompa","jazz","blues","soul","reggae","calypso","steelpan","soca","bouyon","roots","electro","trail","running","triathlon","cycling","swimming","competition","team sport","water sport"];

var TICKET_PLATFORMS = [
  { name: "Website",           placeholder: "https://..." },
  { name: "Bizouk",            placeholder: "https://www.bizouk.com/events/..." },
  { name: "Kiwol",             placeholder: "https://www.kiwol.com/..." },
  { name: "Billetweb",         placeholder: "https://www.billetweb.fr/..." },
  { name: "4 Circles Tickets", placeholder: "https://4circlestickets.com/..." },
  { name: "Sabouj",            placeholder: "https://sabouj.fr/..." },
  { name: "Other",             placeholder: "https://..." },
];

var LABELS = {
  back:        { en: "← Back",            fr: "← Retour",                    kr: "← Retounen",       es: "← Volver" },
  next:        { en: "Next →",            fr: "Suivant →",                    kr: "Swivan →",          es: "Siguiente →" },
  skip:        { en: "Skip →",            fr: "Passer →",                     kr: "Pase →",            es: "Omitir →" },
  send:        { en: "✉ Send by email",   fr: "✉ Envoyer par email",          kr: "✉ Voye pa imèl",   es: "✉ Enviar por correo" },
  copy:        { en: "Copy JSON",         fr: "Copier JSON",                  kr: "Kopye JSON",        es: "Copiar JSON" },
  copied:      { en: "Copied ✓",          fr: "Copié ✓",                      kr: "Kopye ✓",           es: "Copiado ✓" },
  done:        { en: "✓ All done!",       fr: "✓ C'est fait !",               kr: "✓ Fini !",          es: "✓ ¡Listo!" },
  doneHint:    { en: "Click to send by email, or copy the JSON below if you're adding it directly.",
                 fr: "Cliquez pour envoyer par email, ou copiez le JSON si vous l'ajoutez directement.",
                 kr: "Klikye pou voye pa imèl, oswa kopye JSON an si w ap ajoute l dirèkteman.",
                 es: "Haz clic para enviar, o copia el JSON si lo estás añadiendo directamente." },
  jsonLabel:   { en: "JSON — copy to paste into festivals-2026.json",
                 fr: "JSON — copier pour coller dans festivals-2026.json",
                 kr: "JSON — kopye pou kole nan festivals-2026.json",
                 es: "JSON — copia para pegar en festivals-2026.json" },
  mailFallback:{ en: "If your mail client didn't open, copy below:",
                 fr: "Si votre client mail ne s'est pas ouvert, copiez ci-dessous :",
                 kr: "Si kliyan imèl ou pa ouvè, kopye anba a :",
                 es: "Si tu cliente de correo no se abrió, copia abajo:" },
};

var STEPS = [
  { id:"name",        required:true,  type:"text",
    question:{ en:"What's the name of the event?",        fr:"Quel est le nom de l'événement ?",       kr:"Ki jan yo rele évènman an ?",        es:"¿Cuál es el nombre del evento?" },
    hint:    { en:"e.g. ADI Music Festival",              fr:"ex. ADI Music Festival",                  kr:"egz. ADI Music Festival",             es:"ej. ADI Music Festival" } },
  { id:"website",     required:false, type:"url",
    question:{ en:"What's the website URL?",              fr:"Quelle est l'URL du site web ?",          kr:"Ki URL sit web la ?",                 es:"¿Cuál es la URL del sitio web?" },
    hint:    { en:"Leave blank if none",                  fr:"Laissez vide si aucun",                   kr:"Kite vid si pa gen youn",             es:"Dejar en blanco si no hay" } },
  { id:"description", required:false, type:"textarea",
    question:{ en:"Describe the event in one sentence.",  fr:"Décrivez l'événement en une phrase.",     kr:"Dekri évènman an an yon fraz.",        es:"Describe el evento en una frase." },
    hint:    { en:"Keep it short — one sentence",        fr:"Court et précis — une phrase",             kr:"Kout — yon fraz",                     es:"Breve — una frase" } },
  { id:"dates",       required:true,  type:"date-range",
    question:{ en:"When does it take place?",             fr:"Quand se déroule-t-il ?",                 kr:"Ki lè li fèt ?",                      es:"¿Cuándo tiene lugar?" },
    hint:    { en:"Same date for both if it's a single day", fr:"Même date si c'est un seul jour",     kr:"Menm dat si se yon sèl jou",          es:"La misma fecha si es un solo día" } },
  { id:"country",     required:true,  type:"select",      options:COUNTRIES,
    question:{ en:"Where does it take place?",            fr:"Où se déroule-t-il ?",                    kr:"Kote li fèt ?",                       es:"¿Dónde tiene lugar?" },
    hint:    { en:"Timezone is set automatically",        fr:"Le fuseau horaire est défini automatiquement", kr:"Fizo orè a regle otomatikman",   es:"La zona horaria se establece automáticamente" } },
  { id:"city",        required:false, type:"text",
    question:{ en:"Which city or area?",                  fr:"Quelle ville ou zone ?",                  kr:"Ki vil oswa zòn ?",                   es:"¿Qué ciudad o zona?" },
    hint:    { en:"e.g. Le Moule (blank if island-wide)", fr:"ex. Le Moule (vide si à l'échelle de l'île)", kr:"egz. Le Moule (kite vid si nan tout zile a)", es:"ej. Le Moule (en blanco si es en toda la isla)" } },
  { id:"type",        required:true,  type:"select",
    options:["music festival","carnival","regatta","art","sport","other"],
    optionLabels:{
      "music festival":{ en:"Music festival", fr:"Festival de musique", kr:"Fèstival mizik", es:"Festival de música" },
      "carnival":      { en:"Carnival",       fr:"Carnaval",            kr:"Kanaval",        es:"Carnaval" },
      "regatta":       { en:"Regatta",        fr:"Régate",              kr:"Kous bato",      es:"Regata" },
      "art":           { en:"Art",            fr:"Art",                 kr:"Atizay",         es:"Arte" },
      "sport":         { en:"Sport",          fr:"Sport",               kr:"Spo",            es:"Deporte" },
      "other":         { en:"Other",          fr:"Autre",               kr:"Le restan",      es:"Otro" },
    },
    question:{ en:"What type of event is it?",            fr:"Quel type d'événement est-ce ?",          kr:"Ki kalité évènman li ye ?",            es:"¿Qué tipo de evento es?" },
    hint:    { en:"",                                     fr:"",                                        kr:"",                                    es:"" } },
  { id:"details",     required:false, type:"multiselect", options:DETAILS,
    question:{ en:"Event details (genres, activities...)",   fr:"Détails de l'événement (genres, activités...)", kr:"Détay évènman an (jan mizik, aktivite...)", es:"Detalles del evento (géneros, actividades...)" },
    hint:    { en:"Select all that apply",                fr:"Sélectionnez tout ce qui s'applique",     kr:"Chwazi tout sa ki aplike",            es:"Selecciona todos los que apliquen" } },
  { id:"image",       required:false, type:"url",
    question:{ en:"Do you have an image URL?",            fr:"Avez-vous une URL d'image ?",             kr:"Eske ou gen yon URL imaj ?",           es:"¿Tienes una URL de imagen?" },
    hint:    { en:"Link to a photo (blank if none)",      fr:"Lien vers une photo (vide si aucune)",    kr:"Lyen nan foto a (kite vid si pa gen)", es:"Enlace a una foto (en blanco si no hay)" } },
  { id:"tickets",     required:false, type:"tickets",
    question:{ en:"Where can people buy tickets?",        fr:"Où peut-on acheter des billets ?",        kr:"Ki kote moun ka achte tikè ?",         es:"¿Dónde puede la gente comprar entradas?" },
    hint:    { en:"Select platforms and paste the URL. Leave all blank if free.", fr:"Sélectionnez les plateformes et collez l'URL. Tout vide = gratuit.", kr:"Chwazi platfòm yo epi kole URL. Tout vide = gratis.", es:"Selecciona plataformas y pega la URL. Todo vacío = gratuito." } },
  { id:"notes",       required:false, type:"textarea",
    question:{ en:"Anything else to tell us?",            fr:"Autre chose à nous dire ?",               kr:"Eske gen lòt bagay ou vle di nou ?",   es:"¿Algo más que quieras decirnos?" },
    hint:    { en:"Edition number, contact, special details... (not included in the listing)", fr:"Numéro d'édition, contact, détails... (non inclus dans la fiche)", kr:"Nimewo edisyon, contact, detay... (pa enkli nan lis la)", es:"Número de edición, contacto, detalles... (no se incluye en el listado)" } },
];

var currentStep = 0;
var state = { details: [], tickets: [] };

/* ── Lang ── */
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
  if (currentStep < STEPS.length) { renderStep(currentStep); } else { renderFinal(); }
};

/* ── Helpers ── */
function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function updateProgress() {
  var bar = document.getElementById("wizardProgress");
  if (!bar) return;
  bar.textContent = "";
  var total = STEPS.length + 1;
  for (var i = 0; i < total; i++) {
    var seg = document.createElement("div");
    seg.className = "progress-seg" + (i <= currentStep ? " filled" : "");
    bar.appendChild(seg);
  }
}

function isStepValid(n) {
  var step = STEPS[n];
  if (!step.required) return true;
  if (step.type === "date-range") return !!(state.startDate && state.endDate);
  if (step.type === "select")     return !!(state[step.id]);
  var input = document.getElementById("stepInput");
  return !!(input && input.value.trim());
}

function hasValue(n) {
  var step = STEPS[n];
  if (step.type === "date-range")  return !!(state.startDate || state.endDate);
  if (step.type === "multiselect") return state.details.length > 0;
  if (step.type === "tickets")     return state.tickets.length > 0;
  return !!(state[step.id]);
}

function updateNav(n) {
  var btnNext = document.getElementById("btnNext");
  var btnBack = document.getElementById("btnBack");
  if (!btnNext) return;
  var step = STEPS[n];
  btnNext.disabled = step.required && !isStepValid(n);
  btnNext.textContent = (!step.required && !hasValue(n))
    ? (LABELS.skip[lang] || LABELS.skip.en)
    : (LABELS.next[lang] || LABELS.next.en);
  if (btnBack) {
    btnBack.style.display = n === 0 ? "none" : "";
    btnBack.textContent = LABELS.back[lang] || LABELS.back.en;
  }
}

/* ── renderStep ── */
function renderStep(n) {
  var step      = STEPS[n];
  var container = document.getElementById("wizardStep");
  if (!container) return;
  var q    = step.question[lang] || step.question.en;
  var hint = step.hint ? (step.hint[lang] || step.hint.en) : "";

  var html = '<div class="step-num">' + (n + 1) + ' / ' + (STEPS.length + 1) + '</div>'
           + '<div class="step-question">' + escHtml(q) + '</div>'
           + (hint ? '<div class="step-hint">' + escHtml(hint) + '</div>' : '');

  if (step.type === "text" || step.type === "url") {
    html += '<input type="' + (step.type === "url" ? "url" : "text") + '" id="stepInput" class="step-input" value="' + escHtml(state[step.id] || "") + '" autocomplete="off" />';
  } else if (step.type === "textarea") {
    html += '<textarea id="stepInput" class="step-input step-textarea">' + escHtml(state[step.id] || "") + '</textarea>';
  } else if (step.type === "date-range") {
    var sd = state.startDate || "", ed = state.endDate || "";
    html += '<div class="date-row">'
          + '<div><div class="date-label t-en">Start date</div><div class="date-label t-fr">Date de début</div><div class="date-label t-kr">Dat kòmansman</div><div class="date-label t-es">Fecha de inicio</div>'
          + '<input type="date" id="startDate" class="step-input" value="' + escHtml(sd) + '" /></div>'
          + '<div><div class="date-label t-en">End date</div><div class="date-label t-fr">Date de fin</div><div class="date-label t-kr">Dat lafen</div><div class="date-label t-es">Fecha de fin</div>'
          + '<input type="date" id="endDate" class="step-input" value="' + escHtml(ed) + '" /></div>'
          + '</div>';
  } else if (step.type === "select") {
    var current = state[step.id] || "";
    html += '<select id="stepInput" class="step-input"><option value="">—</option>';
    step.options.forEach(function(opt) {
      var label = step.optionLabels ? (step.optionLabels[opt][lang] || step.optionLabels[opt].en) : opt;
      html += '<option value="' + escHtml(opt) + '"' + (current === opt ? " selected" : "") + '>' + escHtml(label) + '</option>';
    });
    html += '</select>';
    if (step.id === "country" && state.timezone) {
      html += '<div class="tz-note">→ ' + escHtml(state.timezone) + '</div>';
    }
  } else if (step.type === "multiselect") {
    html += '<div class="details-grid" id="detailsGrid">';
    step.options.forEach(function(opt) {
      var sel = state.details.indexOf(opt) !== -1;
      html += '<button class="detail-option' + (sel ? " selected" : "") + '" data-detail="' + escHtml(opt) + '" type="button">' + escHtml(opt) + '</button>';
    });
    html += '</div>';
  } else if (step.type === "tickets") {
    html += '<div id="ticketPlatforms">';
    TICKET_PLATFORMS.forEach(function(p) {
      var existing = state.tickets.find(function(t) { return t.name === p.name; });
      var sel = !!existing;
      html += '<div class="ticket-row">'
            + '<button class="detail-option' + (sel ? " selected" : "") + '" data-platform="' + escHtml(p.name) + '" type="button">' + escHtml(p.name) + '</button>'
            + '<input type="url" class="platform-url step-input' + (sel ? " visible" : "") + '" data-platform="' + escHtml(p.name) + '" placeholder="' + escHtml(p.placeholder) + '" value="' + escHtml(existing ? existing.url : "") + '" />'
            + '</div>';
    });
    html += '</div>';
  }

  container.innerHTML = html;
  applyLang();

  if (step.type === "date-range") {
    var sdEl = container.querySelector("#startDate");
    var edEl = container.querySelector("#endDate");
    if (sdEl) sdEl.addEventListener("change", function() { state.startDate = sdEl.value; updateNav(n); });
    if (edEl) edEl.addEventListener("change", function() { state.endDate   = edEl.value; updateNav(n); });
  } else if (step.type === "select") {
    var selEl = container.querySelector("#stepInput");
    if (selEl) {
      selEl.addEventListener("change", function() {
        state[step.id] = selEl.value;
        if (step.id === "country") {
          state.timezone = TZ_MAP[selEl.value] || "";
          var note = container.querySelector(".tz-note");
          if (!note) { note = document.createElement("div"); note.className = "tz-note"; selEl.parentNode.insertBefore(note, selEl.nextSibling); }
          note.textContent = state.timezone ? ("→ " + state.timezone) : "";
        }
        updateNav(n);
      });
    }
  } else if (step.type === "multiselect") {
    container.querySelectorAll(".detail-option").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var v = btn.getAttribute("data-detail"), idx = state.details.indexOf(v);
        if (idx === -1) { state.details.push(v); btn.classList.add("selected"); }
        else            { state.details.splice(idx, 1); btn.classList.remove("selected"); }
        updateNav(n);
      });
    });
  } else if (step.type === "tickets") {
    container.querySelectorAll("button[data-platform]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var pName = btn.getAttribute("data-platform");
        var urlInput = container.querySelector('input[data-platform="' + pName + '"]');
        if (btn.classList.contains("selected")) {
          btn.classList.remove("selected"); urlInput.classList.remove("visible"); urlInput.value = "";
          state.tickets = state.tickets.filter(function(t) { return t.name !== pName; });
        } else {
          btn.classList.add("selected"); urlInput.classList.add("visible");
          if (pName === "Website" && state.website) urlInput.value = state.website;
          state.tickets.push({ name: pName, url: urlInput.value });
          urlInput.focus();
        }
        updateNav(n);
      });
    });
    container.querySelectorAll("input[data-platform]").forEach(function(urlInput) {
      urlInput.addEventListener("input", function() {
        var pName    = urlInput.getAttribute("data-platform");
        var existing = state.tickets.find(function(t) { return t.name === pName; });
        if (existing) existing.url = urlInput.value.trim();
      });
    });
  } else {
    var input = container.querySelector("#stepInput");
    if (input) {
      input.addEventListener("input", function() { updateNav(n); });
      setTimeout(function() { input.focus(); }, 50);
    }
  }
  updateNav(n);
}

/* ── saveStep ── */
function saveStep(n) {
  var step = STEPS[n];
  if (step.type === "text" || step.type === "url" || step.type === "textarea") {
    var input = document.getElementById("stepInput");
    if (input) state[step.id] = input.value.trim();
  } else if (step.type === "select") {
    var input = document.getElementById("stepInput");
    if (input) { state[step.id] = input.value; if (step.id === "country") state.timezone = TZ_MAP[input.value] || ""; }
  } else if (step.type === "date-range") {
    var sd = document.getElementById("startDate"), ed = document.getElementById("endDate");
    if (sd) state.startDate = sd.value;
    if (ed) state.endDate   = ed.value || (sd ? sd.value : "");
  }
  // multiselect and tickets update state in real-time via their event listeners
}

/* ── Final screen ── */
function buildJSON() {
  var q = JSON.stringify;
  var tickets = state.tickets.filter(function(t) { return t.url; });
  var ticketObjs = tickets.length === 0
    ? [{ name: "", url: "" }]
    : tickets;
  var ticketsStr = "[\n" + ticketObjs.map(function(t) {
    return '      {\n        "name": ' + q(t.name) + ',\n        "url": ' + q(t.url) + '\n      }';
  }).join(",\n") + "\n    ]";
  var fields = [
    '    "name": '        + q(state.name        || ""),
    '    "website": '     + q(state.website      || ""),
    '    "description": ' + q(state.description  || ""),
    '    "startDate": '   + q(state.startDate    || ""),
    '    "endDate": '     + q(state.endDate      || ""),
    '    "city": '        + q(state.city         || ""),
    '    "country": '     + q(state.country      || ""),
    '    "timezone": '    + q(state.timezone     || ""),
    '    "type": '        + q(state.type         || ""),
    '    "details": ['    + state.details.map(q).join(", ") + "]",
    '    "image": '       + q(state.image        || ""),
    '    "tickets": '     + ticketsStr,
  ];
  return "  {\n" + fields.join(",\n") + "\n  }";
}

function renderFinal() {
  var container = document.getElementById("wizardStep");
  if (!container) return;
  var json = buildJSON();
  var L = function(k) { return LABELS[k][lang] || LABELS[k].en; };

  container.innerHTML =
    '<div class="done-title">'    + escHtml(L("done"))         + '</div>' +
    '<div class="done-hint">'     + escHtml(L("doneHint"))     + '</div>' +
    '<button id="btnEmail" class="btn-email">' + escHtml(L("send")) + '</button>' +
    '<p class="mail-fallback">'   + escHtml(L("mailFallback")) + '</p>' +
    '<div class="json-label">'    + escHtml(L("jsonLabel"))    + '</div>' +
    '<div id="jsonOutput" class="json-output">' + escHtml(json) + '</div>' +
    '<button id="btnCopy" class="btn-copy">'   + escHtml(L("copy")) + '</button>';

  document.getElementById("btnNext").style.display = "none";
  var btnBack = document.getElementById("btnBack");
  if (btnBack) { btnBack.style.display = ""; btnBack.textContent = L("back"); }
  updateProgress();

  document.getElementById("btnEmail").addEventListener("click", function() {
    var g = { en:"Hi,\n\nHere is my event submission:\n\n", fr:"Bonjour,\n\nVoici ma soumission :\n\n", kr:"Bonjou,\n\nWa soumisyon mwen :\n\n", es:"Hola,\n\nAquí está mi propuesta:\n\n" };
    var c = { en:"\n\nNotes: "+(state.notes||"(none)")+"\n\nThanks!", fr:"\n\nNotes : "+(state.notes||"(aucune)")+"\n\nMerci !", kr:"\n\nNòt : "+(state.notes||"(okenn)")+"\n\nMèsi !", es:"\n\nNotas: "+(state.notes||"(ninguna)")+"\n\n¡Gracias!" };
    var body    = encodeURIComponent((g[lang]||g.en) + json + (c[lang]||c.en));
    var subject = encodeURIComponent("New event — " + (state.name || ""));
    var a = document.createElement("a");
    a.href = "mailto:admin.hxqxk@silomails.com?subject=" + subject + "&body=" + body;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });

  document.getElementById("btnCopy").addEventListener("click", function() {
    var btn = document.getElementById("btnCopy");
    navigator.clipboard.writeText(json).then(function() {
      btn.textContent = L("copied");
      setTimeout(function() { btn.textContent = L("copy"); }, 2000);
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  applyLang();
  updateProgress();
  renderStep(0);

  document.querySelectorAll(".lang-btn").forEach(function(btn) {
    btn.addEventListener("click", function() { window.setLang(btn.getAttribute("data-lang")); });
  });

  document.getElementById("btnNext").addEventListener("click", function() {
    if (currentStep < STEPS.length) {
      saveStep(currentStep);
      currentStep++;
      updateProgress();
      if (currentStep === STEPS.length) { renderFinal(); } else { renderStep(currentStep); }
    }
  });

  document.getElementById("btnBack").addEventListener("click", function() {
    if (currentStep > 0) {
      currentStep--;
      updateProgress();
      document.getElementById("btnNext").style.display = "";
      renderStep(currentStep);
    }
  });
});

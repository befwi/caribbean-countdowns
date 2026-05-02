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
  document.querySelectorAll("#type option").forEach(function(opt) {
    opt.textContent = opt.getAttribute("data-" + lang) || opt.getAttribute("data-en");
  });
}

window.setLang = function(l) {
  lang = l;
  localStorage.setItem("lang", lang);
  applyLang();
};

applyLang();

document.querySelectorAll(".lang-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    window.setLang(btn.getAttribute("data-lang"));
  });
});

var VIBES = [
  "rap", "afro", "dancehall", "shatta", "zouk", "kompa",
  "jazz", "blues", "soul", "reggae", "calypso", "steelpan",
  "soca", "bouyon", "roots"
];

var selectedVibes = new Set();

var grid = document.getElementById("vibesGrid");
VIBES.forEach(function(v) {
  var btn = document.createElement("button");
  btn.className = "vibe-option";
  btn.textContent = v;
  btn.onclick = function() {
    if (selectedVibes.has(v)) {
      selectedVibes.delete(v);
      btn.classList.remove("selected");
    } else {
      selectedVibes.add(v);
      btn.classList.add("selected");
    }
  };
  grid.appendChild(btn);
});

var TICKET_PLATFORMS = [
  { name: "Website",           placeholder: "" },
  { name: "Bizouk",            placeholder: "https://www.bizouk.com/events/..." },
  { name: "Kiwol",             placeholder: "https://www.kiwol.com/..." },
  { name: "Billetweb",         placeholder: "https://www.billetweb.fr/..." },
  { name: "4 Circles Tickets", placeholder: "https://4circlestickets.com/..." },
  { name: "Other",             placeholder: "https://..." },
];

var selectedPlatforms = new Set();

var tContainer = document.getElementById("ticketPlatforms");
TICKET_PLATFORMS.forEach(function(p) {
  var row = document.createElement("div");
  row.className = "ticket-row";

  var btn = document.createElement("button");
  btn.className = "vibe-option";
  btn.textContent = p.name;

  var urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.className = "platform-url";
  urlInput.placeholder = p.placeholder;
  urlInput.dataset.platform = p.name;

  btn.onclick = function() {
    if (selectedPlatforms.has(p.name)) {
      selectedPlatforms.delete(p.name);
      btn.classList.remove("selected");
      urlInput.classList.remove("visible");
      urlInput.value = "";
    } else {
      selectedPlatforms.add(p.name);
      btn.classList.add("selected");
      urlInput.classList.add("visible");
      if (p.name === "Website") {
        urlInput.value = document.getElementById("website").value.trim();
      }
      urlInput.focus();
    }
  };

  row.appendChild(btn);
  row.appendChild(urlInput);
  tContainer.appendChild(row);
});

document.getElementById("website").addEventListener("input", function() {
  var websiteInput = tContainer.querySelector('[data-platform="Website"]');
  if (websiteInput && selectedPlatforms.has("Website")) {
    websiteInput.value = this.value.trim();
  }
});

window.generate = function() {
  var val = function(id) { return document.getElementById(id).value.trim(); };

  var name        = val("name");
  var website     = val("website");
  var description = val("description");
  var startDate   = val("startDate");
  var endDate     = val("endDate");
  var city        = val("city");
  var country     = val("country");
  var type        = document.getElementById("type").value;
  var vibes       = Array.from(selectedVibes);
  var image       = val("image");

  var tickets = Array.from(document.querySelectorAll(".platform-url.visible"))
    .map(function(input) { return { name: input.dataset.platform, url: input.value.trim() }; })
    .filter(function(t) { return t.url; });

  var q = function(s) { return JSON.stringify(s); };

  var ticketsStr = tickets.length === 0
    ? "[]"
    : "[\n" + tickets.map(function(t) { return '    { "name": ' + q(t.name) + ', "url": ' + q(t.url) + ' }'; }).join(",\n") + "\n  ]";

  var json = [
    "{",
    '  "name": '        + q(name)        + ",",
    '  "website": '     + q(website)      + ",",
    '  "description": ' + q(description)  + ",",
    '  "startDate": '   + q(startDate)    + ",",
    '  "endDate": '     + q(endDate)      + ",",
    '  "city": '        + q(city)         + ",",
    '  "country": '     + q(country)      + ",",
    '  "type": '        + q(type)         + ",",
    '  "vibes": '       + "[" + vibes.map(q).join(", ") + "]," ,
    '  "image": '       + q(image)        + ",",
    '  "tickets": '     + ticketsStr,
    "}"
  ].join("\n") + ",";

  var greetings = {
    en: "Hi,\n\nHere is my event submission for Caribbean Countdowns:\n\n",
    fr: "Bonjour,\n\nVoici ma proposition d'événement pour Caribbean Countdowns :\n\n",
    kr: "Bonjou,\n\nWa soumisyon évènman mwen pou Caribbean Countdowns :\n\n",
    es: "Hola,\n\nAquí está mi propuesta de evento para Caribbean Countdowns:\n\n"
  };
  var closings = {
    en: "\n\nThanks!",
    fr: "\n\nMerci !",
    kr: "\n\nMèsi !",
    es: "\n\n¡Gracias!"
  };

  var body = encodeURIComponent((greetings[lang] || greetings.en) + json + (closings[lang] || closings.en));
  var subject = encodeURIComponent("New event submission — " + name);

  var a = document.createElement("a");
  a.href = "mailto:admin.hxqxk@silomails.com?subject=" + subject + "&body=" + body;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  document.getElementById("outputWrap").classList.add("visible");
  document.getElementById("output").textContent = json;
  applyLang();
};

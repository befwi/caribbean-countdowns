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
};

applyLang();

// External link toast
var toastTimer;
var toastMsgs = {
  en: "You are leaving Caribbean Countdowns",
  fr: "Vous quittez Caribbean Countdowns",
  kr: "Ou ka kité Caribbean Countdowns",
  es: "Estás saliendo de Caribbean Countdowns"
};

function showToast() {
  var toast = document.getElementById("extToast");
  if (!toast) return;
  toast.textContent = toastMsgs[lang] || toastMsgs.en;
  toast.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toast.style.display = "none"; }, 3000);
}

window.onclick = function(e) {
  var el = e.target;
  while (el && el !== document.body) {
    if (el.tagName === "A" && el.target === "_blank") {
      showToast();
      return;
    }
    el = el.parentElement;
  }
};

// Countdowns
function format(ms) {
  if (ms <= 0) return "—";
  var s = Math.floor(ms / 1000);
  var d = Math.floor(s / 86400);
  var h = Math.floor((s % 86400) / 3600);
  var m = Math.floor((s % 3600) / 60);
  var sec = s % 60;
  var unit = (lang === "fr" || lang === "kr") ? "j" : "d";
  return d + unit + " " + h + "h " + m + "m " + sec + "s";
}

function updateCountdowns() {
  document.querySelectorAll(".countdown[data-date]").forEach(function(el) {
    var target = Number(el.getAttribute("data-date"));
    if (!target) return;
    var diff = target - Date.now();
    el.textContent = format(diff);
  });
}

updateCountdowns();
setInterval(updateCountdowns, 1000);

// Filters
var activeType = "All";
var activeVibe = "All";
var activeCountry = "All";

function applyFilters() {
  document.querySelectorAll(".festival-entry").forEach(function(row) {
    var rowType = row.getAttribute("data-type") || "";
    var rowVibes = (row.getAttribute("data-vibes") || "").split(",");
    var rowCountry = row.getAttribute("data-country") || "";
    var matchType = activeType === "All" || rowType === activeType;
    var matchVibe = activeVibe === "All" || rowVibes.indexOf(activeVibe) !== -1;
    var matchCountry = activeCountry === "All" || rowCountry === activeCountry;
    var show = matchType && matchVibe && matchCountry;
    row.style.display = show ? "" : "none";
    var next = row.nextElementSibling;
    if (next && next.classList.contains("divider")) {
      next.style.display = show ? "" : "none";
    }
  });
}

document.querySelectorAll(".filter-tag").forEach(function(btn) {
  btn.addEventListener("click", function() {
    var type = btn.getAttribute("data-filter-type");
    var value = btn.getAttribute("data-value");
    document.querySelectorAll(".filter-tag[data-filter-type='" + type + "']").forEach(function(b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    if (type === "type") activeType = value;
    if (type === "vibe") activeVibe = value;
    if (type === "country") activeCountry = value;
    applyFilters();
  });
});

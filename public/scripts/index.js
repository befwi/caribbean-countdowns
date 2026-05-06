/* index.js — caribbean.countdowns.co */
var LANGS = ["en", "fr", "kr", "es"];
var lang = localStorage.getItem("lang") || "en";

var searchPlaceholders = {
  en: "Search events...",
  fr: "Rechercher un évènement...",
  kr: "Chèché yon évènman...",
  es: "Buscar un evento..."
};

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
  var inp = document.getElementById("searchInput");
  if (inp) inp.placeholder = searchPlaceholders[lang] || searchPlaceholders.en;
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
var searchQuery = "";
var activeType = "All";
var activeVibe = "All";
var activeCountry = "All";

function applyFilters() {
  document.querySelectorAll(".festival-entry").forEach(function(row) {
    var rowName    = (row.getAttribute("data-name")   || "").toLowerCase();
    var rowType    = row.getAttribute("data-type")    || "";
    var rowVibes   = (row.getAttribute("data-vibes")  || "").split(",");
    var rowCountry = row.getAttribute("data-country") || "";
    var matchSearch  = !searchQuery || rowName.indexOf(searchQuery) !== -1;
    var matchType    = activeType    === "All" || rowType    === activeType;
    var matchVibe    = activeVibe    === "All" || rowVibes.indexOf(activeVibe) !== -1;
    var matchCountry = activeCountry === "All" || rowCountry === activeCountry;
    var show = matchSearch && matchType && matchVibe && matchCountry;
    row.style.display = show ? "" : "none";
    var next = row.nextElementSibling;
    if (next && next.classList.contains("divider")) {
      next.style.display = show ? "" : "none";
    }
  });
}

function updateFilterBadge() {
  var count = (activeType !== "All" ? 1 : 0) + (activeVibe !== "All" ? 1 : 0) + (activeCountry !== "All" ? 1 : 0);
  var badge = document.getElementById("filterBadge");
  var toggle = document.getElementById("filterToggle");
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? "" : "none"; }
  if (toggle) toggle.classList.toggle("has-active", count > 0);
}

// Filter panel toggle
var filterToggle = document.getElementById("filterToggle");
var filterPanel  = document.getElementById("filterPanel");

if (filterToggle && filterPanel) {
  filterToggle.addEventListener("click", function(e) {
    e.stopPropagation();
    filterPanel.classList.toggle("open");
  });
}

document.addEventListener("click", function(e) {
  if (!filterPanel) return;
  if (!filterPanel.contains(e.target) && e.target !== filterToggle && !(filterToggle && filterToggle.contains(e.target))) {
    filterPanel.classList.remove("open");
  }
});

// Filter chips
document.querySelectorAll(".filter-chip").forEach(function(btn) {
  btn.addEventListener("click", function() {
    var type  = btn.getAttribute("data-filter-type");
    var value = btn.getAttribute("data-value");
    document.querySelectorAll(".filter-chip[data-filter-type='" + type + "']").forEach(function(b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    if (type === "type")    activeType    = value;
    if (type === "vibe")    activeVibe    = value;
    if (type === "country") activeCountry = value;
    updateFilterBadge();
    applyFilters();
  });
});

// Search input
var searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", function() {
    searchQuery = this.value.trim().toLowerCase();
    applyFilters();
  });
}

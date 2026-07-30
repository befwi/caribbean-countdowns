/* lang.js — caribbean.countdowns.co */
var LANGS = ["en", "fr", "kr", "es"];
var lang = localStorage.getItem("lang") || "en";

function applyLang() {
  // Pages without kr/es content (e.g. blog articles) fall back to en instead of rendering blank.
  var effectiveLang = lang;
  if ((lang === "kr" || lang === "es") && document.querySelectorAll(".t-" + lang).length === 0) {
    effectiveLang = "en";
  }
  LANGS.forEach(function(l) {
    document.querySelectorAll(".t-" + l).forEach(function(el) {
      el.style.display = l === effectiveLang ? (el.tagName === "DIV" || el.tagName === "P" ? "block" : "inline") : "none";
    });
  });
  document.documentElement.lang = effectiveLang;
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

document.querySelectorAll(".lang-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    window.setLang(btn.getAttribute("data-lang"));
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Blog index is EN/FR only — fall back to EN if the stored site-wide pref is kr/es
  var l = localStorage.getItem("lang");
  if (l === "kr" || l === "es") {
    document.querySelectorAll(".t-en").forEach(function (el) {
      el.style.display = el.tagName === "DIV" || el.tagName === "P" ? "block" : "inline";
    });
    document.querySelectorAll(".t-fr").forEach(function (el) { el.style.display = "none"; });
  }
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var wasActive = chip.classList.contains("active");
      chips.forEach(function (c) { c.classList.remove("active"); });
      if (!wasActive) chip.classList.add("active");
      var f = wasActive ? "all" : chip.dataset.f;
      document.querySelectorAll(".tile").forEach(function (tile) {
        tile.classList.toggle("hidden", f !== "all" && tile.dataset.c.split(" ").indexOf(f) === -1);
      });
    });
  });
});

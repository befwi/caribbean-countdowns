(function () {
  var dataEl = document.getElementById("live-banner-data");
  if (!dataEl) return;

  if (sessionStorage.getItem("live-banner-dismissed") === "1") return;

  var festivals = JSON.parse(dataEl.getAttribute("data-festivals"));

  var now = new Date();
  now.setHours(0, 0, 0, 0);

  var live = festivals.filter(function (f) {
    var start = new Date(f.startDate);
    var end   = new Date(f.endDate);
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  });

  if (!live.length) return;

  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function getDateStr(f) {
    var s = new Date(f.startDate);
    var e = new Date(f.endDate);
    return s.getMonth() === e.getMonth()
      ? months[s.getMonth()] + " " + s.getDate() + "–" + e.getDate()
      : months[s.getMonth()] + " " + s.getDate() + " – " + months[e.getMonth()] + " " + e.getDate();
  }

  function formatMs(ms) {
    if (ms <= 0) return "—";
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    return d + "d " + pad(h) + "h " + pad(m) + "m " + pad(sec) + "s";
  }

  function pad(n) { return n < 10 ? "0" + n : n; }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function buildContent(container) {
    live.forEach(function (f, i) {
      if (i > 0) container.appendChild(el("span", "live-tsep-big", "✦"));

      var a = document.createElement("a");
      a.className = "live-tname";
      a.href = f.website || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = f.name;
      container.appendChild(a);

      container.appendChild(el("span", "live-tsep", "·"));
      container.appendChild(el("span", "live-tloc", f.city ? f.city + ", " + f.country : f.country));
      container.appendChild(el("span", "live-tsep", "·"));
      container.appendChild(el("span", "live-tdates", getDateStr(f)));
      container.appendChild(el("span", "live-tsep", "·"));
      container.appendChild(el("span", "live-tends", "ends in"));

      var end = new Date(f.endDate);
      end.setHours(23, 59, 59, 999);

      var counter = el("span", "live-counter");
      counter.setAttribute("data-endts", end.getTime());
      counter.textContent = formatMs(end.getTime() - Date.now());
      container.appendChild(counter);
    });
  }

  var tickerA = document.getElementById("live-ticker-a");
  var tickerB = document.getElementById("live-ticker-b");
  var ticker  = document.getElementById("live-ticker");
  var banner  = document.getElementById("live-banner");
  var closeEl = document.getElementById("live-banner-close");

  if (!tickerA || !tickerB || !ticker || !banner || !closeEl) return;

  buildContent(tickerA);
  buildContent(tickerB);

  banner.style.display = "";

  requestAnimationFrame(function () {
    var w = tickerA.offsetWidth + 80;
    ticker.style.animationDuration = Math.max(8, w / 80) + "s";
  });

  function tick() {
    document.querySelectorAll(".live-counter[data-endts]").forEach(function (c) {
      c.textContent = formatMs(Number(c.getAttribute("data-endts")) - Date.now());
    });
  }
  setInterval(tick, 1000);

  closeEl.addEventListener("click", function () {
    banner.style.display = "none";
    sessionStorage.setItem("live-banner-dismissed", "1");
  });
})();

function format(ms: number) {
  if (ms <= 0) return "0d 0h 0m";

  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);

  return `${d}d ${h}h ${m}m`;
}

function update() {
  const els = document.querySelectorAll<HTMLElement>(".countdown");

  els.forEach((el) => {
    const date = el.dataset.date;
    if (!date) return;

    const target = Number(date);
    const diff = target - Date.now();

    el.textContent = format(diff);
  });
}

update();
setInterval(update, 1000);
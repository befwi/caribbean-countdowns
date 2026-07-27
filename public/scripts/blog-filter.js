document.addEventListener("DOMContentLoaded", () => {
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.f;
    document.querySelectorAll(".tile").forEach((tile) => {
      tile.classList.toggle("hidden", f !== "all" && !tile.dataset.c.split(" ").includes(f));
    });
  }));
});

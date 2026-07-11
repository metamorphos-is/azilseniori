document.querySelectorAll(".stat-grid strong, .stat strong").forEach((el) => {
  const target = parseInt(el.textContent, 10);
  if (Number.isNaN(target)) return;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const tick = () => {
    current = Math.min(target, current + step);
    el.textContent = current;
    if (current < target) requestAnimationFrame(tick);
  };
  tick();
});

(function () {
  const toggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("current-theme");
  const STORAGE_KEY = "azil-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeLabel.textContent = theme === "dark" ? "Night Mode" : "Day Mode";
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  let currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  toggle.addEventListener("click", function () {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(currentTheme);
  });
})();

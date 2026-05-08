document.addEventListener("DOMContentLoaded", () => {
  const themeSelect = document.getElementById("theme-select");
  const syntaxLink = document.getElementById("syntax-theme");
  const dataEl = document.getElementById("theme-data");

  if (!themeSelect || !syntaxLink || !dataEl) return;

  const data = JSON.parse(dataEl.textContent);
  const themeModeMap = Object.fromEntries(
    data.list.map((t) => [t.id, t.mode]),
  );
  const validThemes = Object.keys(themeModeMap);

  function setTheme(theme) {
    if (!validThemes.includes(theme)) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const mode = themeModeMap[theme];
    syntaxLink.href = "/assets/css/syntax/github-" + mode + ".css";
  }

  const storedTheme = localStorage.getItem("theme");
  const initialTheme = validThemes.includes(storedTheme)
    ? storedTheme
    : data.default;

  themeSelect.value = initialTheme;
  setTheme(initialTheme);

  themeSelect.addEventListener("change", () => {
    setTheme(themeSelect.value);
  });
});

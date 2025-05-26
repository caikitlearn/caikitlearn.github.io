document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme-select');
  const syntaxLink = document.getElementById('syntax-theme');

  if (!themeSelect || !syntaxLink) return;

  const themeModeMap = {
    jazz: 'light',
    nocturne: 'dark',
    outrun: 'dark',
    severance: 'light',
    snes: 'light',
    tyranitar: 'dark',
  };

  const validThemes = Object.keys(themeModeMap);

  function setTheme(theme) {
    if (!validThemes.includes(theme)) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const mode = themeModeMap[theme];
    syntaxLink.href = '/assets/css/syntax/github-' + mode + '.css';
  }

  const storedTheme = localStorage.getItem('theme');
  const initialTheme = validThemes.includes(storedTheme) ? storedTheme : 'dark';

  themeSelect.value = initialTheme;
  setTheme(initialTheme);

  themeSelect.addEventListener('change', () => {
    setTheme(themeSelect.value);
  });
});

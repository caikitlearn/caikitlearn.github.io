document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('theme-select');

  if (!themeSelect) return;

  // load saved theme or set default
  const validThemes = [
    'dark',
    'light',
    'jazz',
    'outrun',
    'raptors',
    'severance',
    'snes',
    'tyranitar',
  ];
  const storedTheme = localStorage.getItem('theme');
  const savedTheme = validThemes.includes(storedTheme) ? storedTheme : 'dark';

  themeSelect.value = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);

  // update theme on selection
  themeSelect.addEventListener('change', () => {
    const selectedTheme = themeSelect.value;
    if (validThemes.includes(selectedTheme)) {
      document.documentElement.setAttribute('data-theme', selectedTheme);
      localStorage.setItem('theme', selectedTheme);
    }
  });
});
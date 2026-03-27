const stored = localStorage.getItem('rtg:theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = $state({ dark: stored ? stored === 'dark' : prefersDark });

$effect.root(() => {
  $effect(() => {
    document.documentElement.classList.toggle('dark', theme.dark);
    localStorage.setItem('rtg:theme', theme.dark ? 'dark' : 'light');
  });
});

export function toggleTheme() {
  theme.dark = !theme.dark;
}

export function isDark() {
  return theme.dark;
}

import type { SettingsTheme } from '../types/settings';

const THEME_STORAGE_KEY = 'pebble_theme';
const THEME_TRANSITION_BLOCK_CLASS = 'theme-transition-blocked';

let themeTransitionBlockId = 0;

interface ApplyThemeOptions {
  persist?: boolean;
}

function blockThemeTransition(root: HTMLElement) {
  if (typeof window === 'undefined') return;

  const blockId = ++themeTransitionBlockId;

  root.classList.add(THEME_TRANSITION_BLOCK_CLASS);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (blockId === themeTransitionBlockId) {
        root.classList.remove(THEME_TRANSITION_BLOCK_CLASS);
      }
    });
  });
}

export function applyTheme(
  theme: SettingsTheme,
  options: ApplyThemeOptions = {},
) {
  if (typeof document === 'undefined') return;

  const { persist = true } = options;
  const normalizedTheme = theme.toLowerCase();
  const root = document.documentElement;

  blockThemeTransition(root);

  root.dataset.theme = normalizedTheme;
  root.classList.toggle(
    'dark',
    theme === 'DARK',
  );
  root.style.colorScheme = normalizedTheme;

  if (persist && typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

export function getStoredTheme(): SettingsTheme {
  if (typeof window === 'undefined') {
    return 'LIGHT';
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) ===
    'DARK'
    ? 'DARK'
    : 'LIGHT';
}

export function initializeTheme(isAuthenticated: boolean) {
  if (!isAuthenticated) {
    applyTheme('LIGHT', {
      persist: false,
    });
    return;
  }

  applyTheme(getStoredTheme(), {
    persist: false,
  });
}

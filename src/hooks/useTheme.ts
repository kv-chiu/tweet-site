import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const el = document.documentElement;
  if (theme === 'system') {
    el.removeAttribute('data-theme');
  } else {
    el.setAttribute('data-theme', resolved);
  }
}

// Initialize on load
applyTheme(getStoredTheme());

let listeners: (() => void)[] = [];

function subscribe(cb: () => void) {
  listeners.push(cb);

  // Also listen to system theme changes
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
    listeners.forEach((l) => l());
  };
  mq.addEventListener('change', handler);

  return () => {
    listeners = listeners.filter((l) => l !== cb);
    mq.removeEventListener('change', handler);
  };
}

function getSnapshot(): Theme {
  return getStoredTheme();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    listeners.forEach((l) => l());
  }, []);

  const resolved: 'light' | 'dark' = theme === 'system' ? getSystemTheme() : theme;

  return { theme, resolved, setTheme };
}

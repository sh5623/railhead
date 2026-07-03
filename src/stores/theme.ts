import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Shared client/UI state via Zustand — the template's one client-state store.
 * Theme is genuinely shared (a toggle in the header, consumed app-wide) and
 * must survive reloads, so it earns a store (vs `useState`). `persist` writes
 * to localStorage under the `theme` key; `index.html` reads the same key to
 * apply the class before paint (no flash). RootLayout applies it on change.
 *
 * Copy this shape for any genuinely-shared client state. Server data does NOT
 * belong here — that stays in TanStack Query.
 */
export type Theme = 'light' | 'dark';

type ThemeState = {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
};

/** First-run default before any user choice: follow the OS preference. */
function systemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      toggle: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'theme' },
  ),
);

import '@testing-library/jest-dom/vitest';

// jsdom under an opaque origin doesn't expose a working `localStorage`.
// Polyfill a minimal in-memory one so persisted Zustand stores (e.g. the theme
// store) work in tests.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

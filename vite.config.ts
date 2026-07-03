/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Playwright E2E specs (e2e/**) are NOT Vitest tests — they run via `pnpm e2e`.
    exclude: [...configDefaults.exclude, 'e2e/**'],
    // env.ts validates VITE_API_BASE_URL at import time; provide it for tests.
    env: { VITE_API_BASE_URL: 'http://localhost:8080' },
  },
});

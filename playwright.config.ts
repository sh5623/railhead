import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E config. Specs live in `e2e/` (`*.spec.ts`). Locally, Playwright
 * auto-starts the Vite dev server via `webServer` below; in CI it runs against a
 * production build (`vite preview`). Vitest unit/component tests stay in `src/`
 * and are excluded from Playwright by `testDir` (and from Vitest by `vite.config.ts`).
 *
 * CI: GitHub Actions (`.github/workflows/ci.yml`) sets `CI=true`, runs
 * `pnpm build`, then `pnpm e2e` — so E2E exercises the built app via `vite preview`.
 */
// Defaults to Vite's 5173 (same as `pnpm dev`). Set E2E_PORT to dodge a
// collision with another dev server already on 5173.
const PORT = Number(process.env.E2E_PORT) || 5173;
const baseURL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  // Generous default so cold Vite compiles + React Query retry/backoff don't flake.
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    // `--strictPort` fails fast if the port is busy instead of silently moving
    // to 5174 (which would mismatch `url` and hang). CI runs against the
    // production build via `vite preview` (the CI workflow runs `pnpm build`
    // first); locally it uses the dev server for fast iteration.
    command: isCI
      ? `pnpm preview --port ${PORT} --strictPort`
      : `pnpm dev --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});

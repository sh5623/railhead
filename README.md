# railhead

**English** | [한국어](./README.ko.md)

A React 19 + TypeScript + Vite SPA template optimized for building with AI coding agents.
Two core principles: **minimize hallucination** and **no over-engineering**. See **[AGENTS.md](./AGENTS.md)** for conventions.

## Tech Stack

React 19 · TypeScript 6 (strict) · Vite 8 · React Router 7 · TanStack Query 5 · Zustand 5 ·
React Hook Form + Zod · Tailwind v4 + shadcn/ui · Biome 2 (lint + format) · Vitest · pnpm

## Prerequisites

- **GitHub repo access** — the host repo is [`sh5623/railhead`](https://github.com/sh5623/railhead).
- Node **24 LTS** (see `.nvmrc`)
- **pnpm 11** — run `corepack enable` (Corepack ships with Node), then the version pinned in `packageManager` is used automatically

## Getting Started

```bash
# clone the repo
git clone https://github.com/sh5623/railhead.git
cd railhead

pnpm install
cp .env.example .env       # required — sets VITE_API_BASE_URL (without it the screen renders blank)
pnpm dev                   # http://localhost:5173

# optional — src/lib/api/schema.d.ts is already committed, so only run this
# after the backend OpenAPI spec changes ($VITE_API_OPENAPI_URL must be reachable):
pnpm gen:api
```

## Bootstrapping a New Project

When you clone this repo as the **starting point for a new project**, clean up the template's own introductory content.
(The `health` and `auth/login` examples are canonical patterns — keep and extend them as-is; only the onboarding tour is meant to go.)

1. **Remove the onboarding tour page** — `src/features/onboarding/*` is a demo (route map, orientation content) introducing *this template itself*. Delete the whole directory.
2. **Repoint the `/` index route** — replace `{ index: true, element: <OnboardingPage /> }` in `src/routes/router.tsx` with your new app's home component.
3. **Clean up coupled tests** — remove or rewrite assertions tied to onboarding: `src/features/onboarding/OnboardingPage.test.tsx` (delete), `e2e/navigation.spec.ts` (drop the onboarding heading, `노선도` nav, `fe-rail 워크플로우`, and `/fe-rail` path assertions).
4. **Update project metadata** — change `name` in `package.json` to your new project name.
5. **Replace the API schema** — once the backend OpenAPI spec is ready, regenerate `src/lib/api/schema.d.ts` (currently a `/health`-only placeholder) with `pnpm gen:api`.

> This is a *cleanup checklist*, not a feature list — don't add new scripts or tooling here.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Vite dev server |
| `pnpm build` | Type check (`tsc -b`) + production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format (writes files) |
| `pnpm check` | Biome lint + format `--write` — run before committing |
| `pnpm test` / `pnpm test:run` | Vitest unit/component (watch / single run) |
| `pnpm e2e` | Playwright E2E (`e2e/` — auto-starts the Vite dev server) |
| `pnpm e2e:ui` | Playwright UI mode (debugging) |
| `pnpm gen:api` | Regenerate `src/lib/api/schema.d.ts` from `$VITE_API_OPENAPI_URL` |

## Testing

Two layers:

- **Unit/component (Vitest + Testing Library)** — `src/**/*.test.tsx`, colocated. `pnpm test` (watch) / `pnpm test:run` (single run).
- **E2E (Playwright)** — `e2e/**/*.spec.ts`. Verifies SPA routing and state in a real browser.

```bash
pnpm exec playwright install chromium   # first time only — downloads the browser
pnpm e2e                                # runs e2e/ (auto-starts the Vite dev server)
pnpm e2e:ui                             # UI mode (debugging)
```

- Example specs: `e2e/navigation.spec.ts` (routing — `/` → `/login`, plus unknown-path → error boundary) and `e2e/health.spec.ts` (mocks 500 / delayed / OK via `page.route()`). **Don't ship happy-path-only E2E** — cover failure, loading, and empty states with `page.route()` too.
- Projects: `chromium` (Desktop) + `mobile-chrome` (Pixel 5). Reports and artifacts (`playwright-report/`, `test-results/`) are in `.gitignore`.
- Port conflicts: E2E boots the app on `:5173` by default (same as `pnpm dev`). If another dev server already holds `:5173`, Playwright will **reuse that server** — stop it or point to a different port with `E2E_PORT=5174 pnpm e2e`.
- **CI**: GitHub Actions. `.github/workflows/ci.yml` runs the same gate (typecheck → `biome ci` → `test:run` → `build` → `e2e`) in a clean environment on every push/PR. Since `CI=true`, E2E serves the built `dist/` via `vite preview` instead of `pnpm dev` (see the comment in `playwright.config.ts`).

## Conventions

Every tool-enforceable rule lives in `biome.json` and `tsconfig.json` (run `pnpm check` + `pnpm typecheck`).
Rules a tool can't enforce — the single API pattern, state separation, the query-key factory, environment-variable handling, and so on — are documented in **[AGENTS.md](./AGENTS.md)**. `CLAUDE.md` imports it, so Claude Code reads the same source.
The husky `pre-commit` hook runs `lint-staged` (Biome) on staged files, then `pnpm typecheck`, so format, lint, and type checks are enforced automatically on every commit — set up automatically by `pnpm install`.

## UI Components

Add shadcn/ui components via the CLI (they're copied into `src/components/ui` and you own/edit them from there):

```bash
pnpm dlx shadcn@latest add button
```

## Using an AI Agent (Claude Code)

AI working conventions live in the committed `AGENTS.md` / `CLAUDE.md` (see Conventions above) — Claude Code reads these files and follows the same rules.
The `.claude/` directory (skills, settings, hooks), by contrast, is **gitignored, developer-local configuration not shared through the repo**. It won't come along with a plain clone, so if your team wants shared skills or hooks, distribute them outside the repo or have each developer set them up individually.

## MCP (optional — for Claude Code and other MCP clients)

This repo **includes the shadcn MCP server in `.mcp.json`** — unlike `.claude/` above, this one **is committed and shared**.

- **First run** — when Claude Code prompts you to approve the `shadcn` project server, allow it. The first connection may be slow while packages are fetched (cached afterward).
- **What it does** — lets the agent search and add real components (with correct props/variants) from the registry. It complements `pnpm dlx shadcn@latest add` and aligns with the *minimize hallucination* principle.
- **Requirements** — Node + pnpm (already required by the project), network access on first run, and `components.json` (already included).
- **Verify** — check that `shadcn` shows as connected via `/mcp`.
- If you don't use an MCP client, ignore this (the config just stays inactive). To regenerate: `pnpm dlx shadcn@latest mcp init --client claude`.

## Troubleshooting

- **Blank screen after `pnpm dev`** — usually a missing `.env`. `src/lib/env.ts` validates `VITE_API_BASE_URL` at startup and (intentionally) throws if it's missing, halting rendering. Fix: `cp .env.example .env` (check the browser console for a `ZodError`).
- **`pnpm gen:api` fails** — it fetches the live spec from `$VITE_API_OPENAPI_URL`, so the backend must be reachable. Skip it on a fresh clone (`src/lib/api/schema.d.ts` is already committed) — only run it after the backend spec changes.
- **API calls fail with `ERR_CONNECTION_REFUSED`** — the backend is a separate service. Run it (default `http://localhost:8080`) or point `VITE_API_BASE_URL` at the correct host.

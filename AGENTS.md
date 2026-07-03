# AGENTS.md

> Lint, format, import order, type strictness, null-safety, unused code, a11y and JSX rules are enforced automatically by **Biome 2.5.0** (`biome.json`) and **TypeScript strict** (`tsconfig.json`). Do not restate those here — just run `pnpm check` and `pnpm typecheck`. This file holds ONLY conventions a tool cannot enforce.
>
> Claude Code reads `CLAUDE.md`, not `AGENTS.md`. Keep one source of truth: `CLAUDE.md` is a stub containing `@AGENTS.md` (or a symlink). Do not maintain two docs.

## Project overview

- React 19 + TypeScript + Vite **SPA** (admin/dashboard behind login + light public pages). Low-SEO, so **no SSR / no Next**.
- The **backend is a separate service**; this repo only consumes its OpenAPI spec. Never add server, DB, or endpoint code here.
- Two hard rules: **minimize hallucination** (prefer generated types, one pinned pattern) and **no over-engineering** (don't add abstractions/libraries that weren't asked for).

## Commands (pnpm only — the lockfile is pnpm)

```
pnpm dev          # Vite dev server
pnpm build        # production build
pnpm typecheck    # tsc --noEmit — MUST pass before done
pnpm lint         # Biome lint
pnpm format       # Biome format
pnpm check        # Biome lint + format with --write (run before commit)
pnpm test         # Vitest (unit/component)
pnpm e2e          # Playwright E2E (e2e/**.spec.ts; auto-starts the dev server)
pnpm gen:api      # regenerate the OpenAPI client/types (after the backend spec changes)
```

`pnpm check` + `pnpm typecheck` must pass before committing.

## The single API pattern (most important rule)

- ALWAYS call the backend through the generated **openapi-fetch** client (instantiated in `src/lib/api`). NEVER hand-write `fetch`/`axios`.
- NEVER invent endpoints, paths, params, or response fields. Every call must type-check against the generated `schema.d.ts`. If a field/endpoint is missing, the spec is stale — fix the backend spec, not the types.
- Do NOT silence schema/type mismatches with `as any`, `as unknown as T`, or `@ts-expect-error`. Regenerate with `pnpm gen:api`.
- API/server types come ONLY from the generated types. Never redeclare server shapes by hand.

## Do not edit generated files

- `schema.d.ts` and everything emitted by `pnpm gen:api` are **read-only**. They are excluded from Biome in `biome.json` — change the backend spec and regenerate, never hand-edit.

## State management

- **Server/remote state → TanStack Query ONLY.** Do not copy fetched data into Zustand or `useState`.
- Shared client/UI state → Zustand (add a store only when state is genuinely shared). Local state → `useState`.
- Data fetching: all GETs via `useQuery`, mutations via `useMutation`. **`useEffect` is not for data fetching.**
- Read `data` only after guarding `isPending` / `isError`.
- Use the functional updater `setX(prev => ...)` whenever next state derives from previous (avoids stale closures in async/intervals/handlers).
- Forms → React Hook Form + Zod (`@hookform/resolvers`).

## Testing

- **Unit/component → Vitest + Testing Library**, colocated as `src/**/*.test.tsx`. **E2E → Playwright**, in `e2e/**/*.spec.ts` (kept out of Vitest via `vite.config.ts`). Never put `*.spec.ts` under `src`.
- Never ship happy-path-only E2E. Every feature's E2E must include a **non-happy** path — mock the backend with Playwright `page.route()` to assert error / loading / empty states (see `e2e/health.spec.ts`).
- Assert on user-visible roles/text (`getByRole` / `getByText`), not CSS classes or `data-testid` unless there's no accessible handle.

## TanStack Query keys

- Query keys come from a **central key factory**; never inline ad-hoc array keys at call sites.
- Keep keys hierarchical so invalidation works: `users.all → users.list(params) → users.detail(id)`.
- Queries/mutations live colocated per feature: `src/features/<feature>/api`.

## Folder layout

- `src/components` (shared UI) · `src/features/<feature>` · `src/lib` (api client, utils) · `src/stores` (Zustand) · `src/routes`.
- Use the `@/*` import alias (configured in `tsconfig.json`) instead of deep relative paths.

## Environment access

- Read env ONLY through the validated (Zod-parsed) env module — never touch `import.meta.env` / `process.env` directly in app code.
- Only `VITE_`-prefixed vars are client-exposed. Never put secrets in client env. Add new vars to the env schema first.

## UI: styling & shadcn

- Add shadcn/ui components via the CLI (`pnpm dlx shadcn@latest add <component>`) or the connected **shadcn MCP** (`.mcp.json` — search/add from the registry); do not hand-author them. They are editable after landing.
- Compose class names with the `cn()` helper for conditional/merged classes; do not concatenate Tailwind strings manually.
- Tailwind v4 is the styling system; avoid inline `style` objects when a utility class exists.
- If `dangerouslySetInnerHTML` is truly unavoidable, sanitize with DOMPurify first.

## Design quality

- The visual contract is in **`DESIGN.md`** (tokens, OKLCH color, component states, motion, layout, project bans) and **`PRODUCT.md`** (product/brand register) — follow them for UI work.
- Tokens live in `src/styles/index.css` (Tailwind v4 `@theme` + class-based dark mode); consume via utilities (`bg-background`, `text-muted-foreground`, …) — never hard-code color/spacing values.

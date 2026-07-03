# Design

Visual contract for this project. Tokens are implemented in `src/styles/index.css` (Tailwind v4 `@theme inline` + shadcn-style `:root`/`.dark` variables, OKLCH). Consume via utilities (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, …) — never hard-code values.

## Theme

Light and dark, **class-based** (`@custom-variant dark`). Neutral, professional, low-chroma — the surface stays out of the way; meaning comes from hierarchy, spacing, and one accent. Register: product → **Restrained** color strategy (tinted-neutral surfaces + a single accent ≤ ~10% of surface).

## Color (OKLCH)

- **Neutrals** carry the UI: `background` / `foreground` and a second surface layer (`card`, `muted`) at near-zero chroma. No cream/sand defaults.
- **Primary** is a confident near-black (light mode) / near-white (dark mode) — Vercel-style monochrome for actions and emphasis.
- **Ring/accent** for focus and selection only.
- **Brand accent** (`--brand`, azure ~hue 245; `bg-brand` / `text-brand` / `border-brand` + `--brand-foreground`): the single chromatic accent for identity, emphasis, and wayfinding (logo mark, hero surface wash, section markers). Restrained — small surface washes (4–8%), marks/borders, and large/bold text only; never small body text (contrast). Dark mode uses a lighter, slightly desaturated brand. Keep `success`/`destructive` for state; `brand` is identity, not a state.
- **Semantic**: `destructive` / `success` / `warning` for state, each with a `-foreground` pair for text/icon on a filled chip (e.g. `bg-warning text-warning-foreground`); never decoration. State is never color-only — pair with text or icon. (`warning` = amber ~hue 72/80, body-contrast verified; for caution/pending — e.g. 일시품절·휴면화.)
- Contrast: body ≥ 4.5:1, large/bold ≥ 3:1. Verify, don't assume.

## Typography

- **One family**: a system sans stack (`system-ui, -apple-system, "Segoe UI", Roboto, …`). No display/body pairing in product UI; use at most **two font weights** in one view.
- **Fixed rem scale** (not fluid/clamp), tight ratio ~1.2. Steps: `text-sm` labels, `text-base` body, `text-lg`/`text-xl` section heads, `text-2xl`/`text-3xl` page title.
- **Numeric data uses tabular figures** (`tabular-nums`) so table columns and metrics align; use `font-mono` for code, IDs, and dense numeric tables. Tailwind built-ins — no font to add.
- `tracking-tight` + `text-balance` on h1–h2; prose capped 65–75ch; `text-pretty` on long copy.
- **Korean wrapping**: base CSS sets `word-break: keep-all` (wrap at 어절, not mid-word) + `overflow-wrap: break-word` (long URLs/IDs still break). Don't revert Korean text to character-level breaks.

## Spacing & Radius

- 0.25rem spacing base (Tailwind default). Vary spacing for rhythm; don't pad everything uniformly. **Three-step rhythm**: ~`8px` within a group, `16px` between groups, `32–40px` between sections (`gap-2` / `gap-4` / `gap-8`+). Card padding: `p-6` default, `p-4` compact, `p-8` hero.
- `--radius` base 0.625rem → `rounded-sm/md/lg/xl` derived. Consistent, not scattered.

## Depth & Elevation

Border-first: depth comes from a 1px hairline (`border` — every element already inherits the `--border` color) plus a soft, low-opacity shadow — never a single heavy drop. A raised surface always keeps its hairline ring so its edge stays crisp in both themes. Use the `shadow-*` utilities — tuned to a restrained, low-opacity set in `src/styles/index.css`; never hand-roll arbitrary `shadow-[…]` values. A ladder mapped to how shadcn components render, so added components land on-system:

- **0 · flat** — no border, no shadow. Page regions, inline content.
- **1 · hairline** — `border` only. Resting panels, sections, table rows.
- **2 · input** — `shadow-xs` + border. Inputs, resting buttons.
- **3 · card** — `shadow-sm` + border. Resting cards, raised tiles.
- **4 · menu** — `shadow-md` + border. Dropdowns, popovers, selects, hover-lifted surfaces.
- **5 · overlay** — `shadow-lg` + border. Dialogs, modals, command palette, toasts.
- Stop at `shadow-lg`; `shadow-xl`/`shadow-2xl` read as decoration — don't use (see Bans). Move one rung per interaction; don't jump straight to an overlay shadow on hover.
- **Dark mode**: lift with the surface ladder, not bigger shadows (shadows read weakly on dark). Order: `bg-background` → `bg-card`/`bg-popover` → `bg-muted`/`bg-secondary`/`bg-accent`. Reserve `shadow-md`/`shadow-lg` for true overlays.
- **Motion**: elevation changes on hover/press are ≤150 ms ease-out; honor `prefers-reduced-motion: reduce` with an instant swap (see Motion).

## Components

Every interactive element ships: default · hover · focus(-visible) · active · disabled · loading · error. Loading = skeletons, not centered spinners. Empty states teach the interface. Same button shape, same form-control vocabulary, same icon set (lucide) everywhere. Build new components the shadcn way (cva + cn + Radix). On touch / coarse pointers, every interactive control meets a ≥44×44px hit target — grow the hit area with padding (or a pseudo-element), don't inflate the visual size; dense desktop tables and toolbars may stay compact on a fine pointer.

## Content & UX copy

Copy is part of the design contract — precise and calm (see PRODUCT.md voice). Product UI is **Korean-first**; the examples below are the target register. Rules a linter can't catch:

- **Actions name the action + object** — not a bare `확인` / `예` / `아니오`: `회원 삭제`, `변경사항 저장`.
- **Errors = what happened + what to do next**: `업로드 실패: 파일이 10 MB를 초과합니다. 압축하거나 다른 파일을 선택하세요.`
- **Toasts name what changed; drop `성공`·`성공적으로`·느낌표**: `회원을 삭제했습니다` — not `성공적으로 삭제되었습니다!`.
- **Empty states point to the first action**: `아직 프로젝트가 없습니다. 새로 만들어 시작하세요.`
- **In-progress = `~ 중` + ellipsis**: `저장 중…`, `삭제 중…`.
- Use the real `…`; skip filler (`~하실 수 있습니다`) and superlatives (`완벽한`, `최고의`). Keep one honorific ending per surface (don't mix `~하세요` / `~합니다` / `~해주세요`).

## Motion

State, feedback, reveal — never decoration. Duration scales with the surface (see Depth & Elevation): ~150 ms for in-place state changes, ~200 ms for menus/popovers (rung 4), ~300 ms for overlays/modals (rung 5). Ease-out, no bounce/elastic. Honor `prefers-reduced-motion: reduce` with a crossfade/instant fallback on every animation. No orchestrated page-load sequences (product loads into a task).

## Layout

Mobile-first; responsive behavior is **structural** (collapse sidebar, responsive table, breakpoint columns), not fluid type. Flex for 1D, Grid for 2D; `repeat(auto-fit, minmax(280px,1fr))` for breakpoint-free grids. Container queries for reusable widgets. Semantic z-index scale (dropdown → sticky → modal → toast → tooltip), never `9999`.

## Bans (project)

Side-stripe accent borders · gradient text · default glassmorphism · hero-metric template · identical card grids · per-section uppercase eyebrows · `01/02/03` section markers · text that overflows its container. If you're about to write one, restructure instead.

**Exception — ordered sequence markers.** Numeric markers are banned as *decorative section scaffolding* (eyebrow-style `01 / 02 / 03` slapped above otherwise-generic sections). They are allowed when the numbers form a deliberate, page-wide **ordered sequence** that carries information and is wired to real wayfinding — e.g. the onboarding "rail / 노선도" stops (`00`…`08` + `↓` terminus) synced to scroll-spy and `aria-current`. Test: delete the numbers — if order/wayfinding breaks, they earn their place; if nothing is lost, they were decoration.

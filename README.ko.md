# railhead

[English](./README.md) | **한국어**

AI 코딩 에이전트와 함께 개발하도록 최적화된 React 19 + TypeScript + Vite SPA 템플릿입니다.
두 가지 핵심 원칙: **AI 환각 최소화**와 **과도한 설계 금지(no over-engineering)**. 컨벤션은 **[AGENTS.md](./AGENTS.md)**를 참고하세요.

## 기술 스택

React 19 · TypeScript 6 (strict) · Vite 8 · React Router 7 · TanStack Query 5 · Zustand 5 ·
React Hook Form + Zod · Tailwind v4 + shadcn/ui · Biome 2 (lint + format) · Vitest · pnpm

## 사전 준비물

- **GitHub 저장소 접근 권한** — 호스트 레포는 [`sh5623/railhead`](https://github.com/sh5623/railhead)입니다.
- Node **24 LTS** (`.nvmrc` 참고)
- **pnpm 11** — `corepack enable` 실행(Node에 Corepack 내장) 후 `packageManager` 필드에 고정된 버전이 사용됩니다

## 시작하기

```bash
# 저장소 clone
git clone https://github.com/sh5623/railhead.git
cd railhead

pnpm install
cp .env.example .env       # 필수 — VITE_API_BASE_URL 설정 (없으면 화면이 빈 채로 렌더링됨)
pnpm dev                   # http://localhost:5173

# 선택 — src/lib/api/schema.d.ts는 이미 커밋되어 있으므로, 백엔드 OpenAPI 스펙이
# 바뀐 경우에만 실행하세요 ($VITE_API_OPENAPI_URL로 백엔드에 접근 가능해야 함):
pnpm gen:api
```

## 새 프로젝트로 전환 (부트스트랩)

이 저장소를 clone해 **새 프로젝트의 출발점**으로 쓸 때, 템플릿 소개용 콘텐츠를 정리하세요.
(`health` · `auth/login` 예시는 정전(canonical) 패턴이므로 지우지 말고 그대로 참고·확장하세요 — 정리 대상은 온보딩 투어뿐입니다.)

1. **온보딩 투어 페이지 제거** — `src/features/onboarding/*`는 *이 템플릿 자체*를 소개하는 데모(노선도·입사 안내)입니다. 디렉터리 전체를 삭제하세요.
2. **`/` 인덱스 라우트 재지정** — `src/routes/router.tsx`의 `{ index: true, element: <OnboardingPage /> }`를 새 앱의 홈 컴포넌트로 교체하세요.
3. **결합된 테스트 정리** — 온보딩에 묶인 단언을 지우거나 새 홈에 맞게 고칩니다: `src/features/onboarding/OnboardingPage.test.tsx`(삭제), `e2e/navigation.spec.ts`(온보딩 heading · `노선도` nav · `fe-rail 워크플로우` · `/fe-rail` 경로 단언).
4. **프로젝트 메타 변경** — `package.json`의 `name`을 새 프로젝트명으로 바꿉니다.
5. **API 스키마 교체** — 백엔드 OpenAPI 스펙이 준비되면 `pnpm gen:api`로 `src/lib/api/schema.d.ts`(현재 `/health` 전용 placeholder)를 재생성하세요.

> *기능 추가가 아니라 정리 목록*입니다 — 새 스크립트·도구를 더하지 마세요.

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `pnpm dev` | Vite 개발 서버 |
| `pnpm build` | 타입 체크(`tsc -b`) + 프로덕션 빌드 |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | Biome 린트 |
| `pnpm format` | Biome 포맷 (파일 수정) |
| `pnpm check` | Biome 린트 + 포맷 (파일 수정) — 커밋 전에 실행 |
| `pnpm test` / `pnpm test:run` | Vitest 단위·컴포넌트 (watch / 1회 실행) |
| `pnpm e2e` | Playwright E2E (`e2e/` — Vite dev 서버 자동 기동) |
| `pnpm e2e:ui` | Playwright UI 모드 (디버깅) |
| `pnpm gen:api` | `$VITE_API_OPENAPI_URL`에서 `src/lib/api/schema.d.ts` 재생성 |

## 테스트

두 계층으로 나뉩니다:

- **단위·컴포넌트 (Vitest + Testing Library)** — `src/**/*.test.tsx`. `pnpm test`(watch) / `pnpm test:run`(1회).
- **E2E (Playwright)** — `e2e/**/*.spec.ts`. 실제 브라우저에서 SPA 라우팅·상태를 검증합니다.

```bash
pnpm exec playwright install chromium   # 최초 1회 — 브라우저 다운로드
pnpm e2e                                # e2e/ 실행 (Vite dev 서버 자동 기동)
pnpm e2e:ui                             # UI 모드 (디버깅)
```

- 예시 spec: `e2e/navigation.spec.ts`(라우팅 — `/`→`/login`, 그리고 미지 경로→에러 바운더리) + `e2e/health.spec.ts`(`page.route()`로 500/지연/정상 모킹). **happy 경로만 만들지 마세요** — 실패·로딩·빈 상태를 `page.route()`로 함께 검증합니다.
- 프로젝트: `chromium`(Desktop) + `mobile-chrome`(Pixel 5). 리포트·결과물(`playwright-report/`, `test-results/`)은 `.gitignore`에 포함됩니다.
- 포트 충돌: E2E는 기본 `:5173`(= `pnpm dev`)에 앱을 띄웁니다. 이미 다른 dev 서버가 `:5173`을 점유하면 Playwright가 **그 서버를 재사용**하므로, 끄거나 다른 포트를 지정하세요 — `E2E_PORT=5174 pnpm e2e`.
- **CI**: GitHub Actions를 사용합니다 — `.github/workflows/ci.yml`이 push/PR마다 동일 게이트(typecheck → `biome ci` → `test:run` → `build` → `e2e`)를 클린 환경에서 실행합니다. E2E는 `CI=true`이므로 `pnpm dev` 대신 빌드된 `dist/`를 `vite preview`로 서빙합니다(`playwright.config.ts` 주석 참고).

## 컨벤션

도구로 강제되는 규칙은 모두 `biome.json`과 `tsconfig.json`에 있습니다 (`pnpm check` + `pnpm typecheck` 실행).
도구로 강제할 수 없는 규칙 — 단일 API 패턴, 상태 분리, 쿼리 키 팩토리, 환경 변수 처리 등 — 은 **[AGENTS.md](./AGENTS.md)**에 정리되어 있습니다. `CLAUDE.md`가 이를 import하므로 Claude Code도 동일한 소스를 읽습니다.
husky `pre-commit` 훅이 스테이징된 파일에 `lint-staged`(Biome)를 실행한 뒤 `pnpm typecheck`까지 돌리므로, 커밋 시 포맷·린트·타입체크가 자동으로 강제됩니다 — `pnpm install` 시 설정됩니다.

## UI 컴포넌트

shadcn/ui 컴포넌트는 CLI로 추가합니다 (`src/components/ui`로 복사되며 이후 직접 소유·수정합니다):

```bash
pnpm dlx shadcn@latest add button
```

## AI 에이전트(Claude Code) 활용

AI 작업 컨벤션은 저장소에 커밋되는 `AGENTS.md` / `CLAUDE.md`에 있습니다(위 컨벤션 섹션 참고) — Claude Code가 이 파일을 읽고 동일한 규칙을 따릅니다.
반면 `.claude/` 디렉터리(스킬·설정·훅)는 **`.gitignore`에 포함되어 저장소로 공유되지 않는 개발자별 로컬 설정**입니다. clone만으로는 따라오지 않으므로, 팀에서 공통 스킬이나 훅을 사용하려면 저장소 외 별도 방법으로 배포하거나 각자 설정하세요.

## MCP (Claude Code 등 MCP 클라이언트 사용 시 — 선택)

이 저장소는 **shadcn MCP 서버를 `.mcp.json`에 포함**합니다 — 위 `.claude/`와 달리 **커밋·공유**됩니다.

- **첫 실행** — Claude Code가 `shadcn` 프로젝트 서버 **승인 프롬프트**를 띄우면 허용하세요. 최초 연결은 패키지를 받아오느라 잠시 느릴 수 있습니다(이후 캐시됨).
- **기능** — 에이전트가 레지스트리에서 실제 컴포넌트(정확한 props·variant)를 검색·추가합니다. `pnpm dlx shadcn@latest add`의 보완이며, *AI 환각 최소화* 원칙과 부합합니다.
- **전제** — Node + pnpm(프로젝트 기본) · 최초 실행 시 네트워크 · `components.json`(이미 포함).
- **확인** — `/mcp` 에서 `shadcn` 이 connected 인지 확인.
- MCP 클라이언트를 쓰지 않으면 무시해도 됩니다(설정은 비활성으로 남음). 재생성: `pnpm dlx shadcn@latest mcp init --client claude`.

## 문제 해결 (Troubleshooting)

- **`pnpm dev` 후 빈 화면** — `.env`가 없는 경우입니다. `src/lib/env.ts`가 시작 시점에 `VITE_API_BASE_URL`을 검증하며, 없으면 (의도적으로) throw하여 앱 렌더링이 중단됩니다. 해결: `cp .env.example .env` (브라우저 콘솔에서 `ZodError` 확인).
- **`pnpm gen:api` 실패** — `$VITE_API_OPENAPI_URL`에서 실시간 스펙을 가져오므로 백엔드에 접근 가능해야 합니다. 새로 clone한 경우 건너뛰어도 됩니다(`src/lib/api/schema.d.ts`가 커밋되어 있음). 백엔드 스펙이 바뀐 뒤에만 실행하세요.
- **API 호출이 `ERR_CONNECTION_REFUSED`로 실패** — 백엔드는 별도 서비스입니다. 백엔드를 실행(기본값 `http://localhost:8080`)하거나 `VITE_API_BASE_URL`을 올바른 호스트로 지정하세요.

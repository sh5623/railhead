/**
 * Static, typed content for the onboarding page — single source of truth.
 * Replaces the old welcome + fe-rail pages. Verified against the repo and the
 * fe-rail plugin.
 *
 * Inline markup in strings: `code` and **bold** (rendered by richText.tsx).
 * Code blocks store raw source; React escapes it on render (no manual &lt;).
 */

export type Tone = 'do' | 'dont' | 'warn' | 'tip' | 'info';

export type Block =
  | { kind: 'prose'; text: string }
  | { kind: 'subheading'; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'steps'; items: string[] }
  | { kind: 'callout'; tone: Tone; title?: string; body: string }
  | { kind: 'code'; file?: string; lang: string; code: string }
  | { kind: 'table'; headers: string[]; rows: string[][] };

export type Section = {
  id: string;
  title: string;
  subtitle: string;
  blocks: Block[];
};

export const HERO = {
  kicker: '신규 입사자 온보딩',
  // Headline as a deliberate tonal ramp: ink → ink/brand mix → brand (azure).
  // Single source of truth; OnboardingPage maps tone → color and space-joins.
  titleSegments: [
    { text: '출발부터', tone: 'ink' },
    { text: '첫 PR까지,', tone: 'mid' },
    { text: '레일을 따라 가면 됩니다.', tone: 'brand' },
  ],
  lead: '이 저장소는 AI 코딩 에이전트와 함께 개발하도록 설계된 React 19 + TypeScript SPA 템플릿입니다. 컴패니언 플러그인 fe-rail이 스펙 → 구현 → 리뷰 → PR을 하나의 레일로 잇습니다. 아래 노선을 차례로 따라오면 오늘 안에 첫 변경을 만들 수 있습니다.',
  // 역할별로 묶은 기술 스택. OnboardingPage가 이 그룹들을 map으로 렌더한다.
  stackGroups: [
    { label: '런타임 · 언어 · 번들러', items: ['React 19', 'TypeScript 6', 'Vite 8'] },
    {
      label: '상태 · 데이터 · UI',
      items: ['TanStack Query 5', 'Zustand 5', 'Tailwind v4 · shadcn'],
    },
    { label: '품질 · 테스트 · 패키지', items: ['Biome 2.5', 'Vitest · Playwright', 'pnpm'] },
  ],
} as const;

export const DOC_REFS: { file: string; desc: string }[] = [
  { file: 'README.md', desc: '시작하기, 스크립트, 트러블슈팅.' },
  { file: 'AGENTS.md', desc: '도구가 못 막는 컨벤션의 단일 소스(`CLAUDE.md`가 import).' },
  { file: 'DESIGN.md', desc: '시각 계약(토큰, OKLCH, 상태, 모션, 금지 목록).' },
  { file: 'PRODUCT.md', desc: '제품·브랜드 register (precise, calm, dependable).' },
];

export const SECTIONS: Section[] = [
  {
    id: 'setup',
    title: '출발 준비',
    subtitle: '클론에서 첫 화면까지, 30분.',
    blocks: [
      {
        kind: 'steps',
        items: [
          '**저장소를 clone**합니다. `git clone https://github.com/sh5623/railhead.git` 후 디렉터리로 이동합니다.',
          '**Node 24 이상**인지 `node -v`로 확인합니다. 저장소 `engines`가 `>=24.0.0`이니, 낮으면 nvm/Volta로 24로 올리세요.',
          '**pnpm을 활성화**합니다. `corepack enable && corepack prepare pnpm@11.7.0 --activate`. 이 저장소는 pnpm 고정이라 npm/yarn은 쓰지 않습니다.',
          '**의존성을 설치**합니다. `pnpm install` (CI와 동일하게 하려면 `--frozen-lockfile`).',
          '**환경 변수를 준비**합니다. `cp .env.example .env`. 빠뜨리면 시작 시점에 앱이 의도적으로 죽습니다(아래 경고 참고).',
          '**개발 서버를 실행**합니다. `pnpm dev` 후 브라우저에서 `http://localhost:5173`.',
          '로그인 화면(`/login`)과 임의의 미지 경로(에러 화면)도 확인합니다.',
          '**품질 게이트를 한 번 돌립니다.** `pnpm typecheck`와 `pnpm check`가 통과하는지 확인하세요(커밋의 전제).',
        ],
      },
      {
        kind: 'code',
        file: '한 번에 셋업',
        lang: 'bash',
        code: `git clone https://github.com/sh5623/railhead.git
cd railhead
node -v                                   # >= 24 인지 확인
corepack enable && corepack prepare pnpm@11.7.0 --activate
pnpm install                              # CI 동일: --frozen-lockfile
cp .env.example .env                      # 없으면 앱이 시작 시 죽는다
pnpm dev                                  # http://localhost:5173`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '빈 화면이 뜨면 거의 항상 .env 누락',
        body: '`src/lib/env.ts`가 시작 시 `VITE_API_BASE_URL`을 Zod로 검증하고, 없으면 일부러 throw해서 렌더링을 멈춥니다(콘솔의 `ZodError`). 해결: `cp .env.example .env`. 기본값 `VITE_API_BASE_URL=http://localhost:8080` 그대로 두면 됩니다.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '백엔드 없이도 정상입니다',
        body: '하단 푸터의 **HealthBadge**가 “백엔드 미연결”(빨간 점)로 떠도 고장이 아닙니다. 백엔드는 별도 서비스라 로컬에 없을 때의 정상 상태입니다.',
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'fe-rail 설치는 선택',
        body: '이 저장소는 `.claude/`를 gitignore하므로 fe-rail은 클론만으로 따라오지 않습니다. 개발자가 각자 설치해야 합니다. 설치 방법은 아래 [fe-rail 워크플로우](#workflow)에서 다룹니다.',
      },
    ],
  },
  {
    id: 'overview',
    title: '프로젝트 개관',
    subtitle: '무엇을, 왜, 무엇으로 만드는가.',
    blocks: [
      {
        kind: 'prose',
        text: '로그인 뒤의 어드민/대시보드 + 가벼운 공개 페이지를 위한 **React 19 SPA**입니다. SEO 요구가 낮아 **SSR/Next를 쓰지 않습니다**. 백엔드는 **별도 서비스**이고, 이 저장소는 그 OpenAPI 스펙만 소비합니다. 서버·DB·엔드포인트 코드는 여기에 두지 않습니다.',
      },
      {
        kind: 'callout',
        tone: 'info',
        title: '두 가지 하드 룰 (모든 결정의 기준)',
        body: '**① 할루시네이션 최소화**: 생성된 타입을 우선하고, 핀으로 고정된 하나의 패턴을 따른다. **② 오버엔지니어링 금지**: 요청되지 않은 추상화나 라이브러리를 더하지 않는다.',
      },
      { kind: 'subheading', text: '기술 스택 (실측 버전)' },
      {
        kind: 'table',
        headers: ['역할', '패키지', '버전'],
        rows: [
          ['프레임워크', '`react` / `react-dom`', '19.2.7'],
          ['언어', '`typescript` (strict)', '6.0.3'],
          ['빌드', '`vite`', '8.0.16'],
          ['라우팅', '`react-router-dom`', '7.17.0'],
          ['서버 상태', '`@tanstack/react-query`', '5.101.0'],
          ['클라이언트 상태', '`zustand`', '5.0.14'],
          ['폼', '`react-hook-form` + `zod`', '7.79.0 · 4.4.3'],
          ['API 클라이언트', '`openapi-fetch` (+ `openapi-typescript`)', '0.17.0 · 7.13.0'],
          ['스타일', '`tailwindcss` + shadcn (`radix-ui`)', '4.3.1 · 1.6.0'],
          ['린트 / 포맷', '`@biomejs/biome`', '2.5.0'],
          ['테스트', '`vitest` · `@playwright/test`', '4.1.9 · 1.61.0'],
          ['패키지 매니저', '`pnpm` (Node ≥ 24)', '11.7.0'],
        ],
      },
      { kind: 'subheading', text: '폴더 레이아웃 · @/* alias' },
      {
        kind: 'table',
        headers: ['경로', '용도'],
        rows: [
          ['`src/components`', '공유 UI (`ui/` = shadcn 컴포넌트)'],
          ['`src/features/<feature>`', '기능별 코드. 데이터 훅(`api.ts`)을 함께 콜로케이트'],
          ['`src/lib`', 'API 클라이언트 · `env` · `query-keys` · `cn` 등 유틸'],
          ['`src/stores`', 'Zustand store (현재: 테마)'],
          ['`src/routes`', '라우터 · 루트 레이아웃 · 에러 페이지'],
          ['`src/styles`', '`index.css` 디자인 토큰'],
          ['`src/test`', '테스트 하네스 (`renderWithProviders` · `setup`)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'do',
        title: 'import는 alias로',
        body: "깊은 상대경로(`../../../`) 대신 `@/*` alias를 씁니다. 예: `import { api } from '@/lib/api/client'`.",
      },
    ],
  },
  {
    id: 'example',
    title: '예제 앱 둘러보기',
    subtitle: '처음 보는 화면들이 그대로 따라 쓸 수 있는 패턴 예시다.',
    blocks: [
      {
        kind: 'prose',
        text: '`pnpm dev` 후 만나는 각 라우트는 하나의 패턴을 시연합니다. 새 코드는 지어내지 말고, 이 화면들의 **소스 shape를 복사하는 것**이 출발점입니다.',
      },
      { kind: 'subheading', text: '라우트 맵' },
      {
        kind: 'table',
        headers: ['경로', '화면', '시연하는 패턴'],
        rows: [
          ['`/`', 'OnboardingPage (이 페이지)', '온보딩 전체 (레일 노선도 · 정적 콘텐츠 분리)'],
          ['`/login`', 'LoginPage', 'React Hook Form + Zod (`zodResolver`, 인라인 a11y 에러)'],
          ['미지 경로', 'ErrorPage', '`errorElement`로 빈 화면 대신 “오류가 발생했습니다”'],
        ],
      },
      {
        kind: 'code',
        file: 'src/routes/router.tsx',
        lang: 'tsx',
        code: `export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <OnboardingPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);`,
      },
      { kind: 'subheading', text: 'HealthBadge: 데이터 패턴의 “렌더된 절반”' },
      {
        kind: 'prose',
        text: '`health/api.ts`의 `useHealth`가 데이터 절반(타입드 클라이언트 + 키 팩토리의 얇은 래퍼)이고, `HealthBadge`가 UI 절반입니다. **모든 엔드포인트에서 이 shape를 복사**하면 됩니다. 실제 동작은 푸터에서 볼 수 있습니다.',
      },
      {
        kind: 'code',
        file: 'src/features/health/api.ts',
        lang: 'ts',
        code: `export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health.all,
    queryFn: async () => {
      const { data, error } = await api.GET('/health');
      if (error) throw new Error('Health check request failed');
      return data;
    },
  });
}`,
      },
      {
        kind: 'code',
        file: 'src/features/health/HealthBadge.tsx: 가드로 3상태 산출',
        lang: 'tsx',
        code: `const { isPending, isError } = useHealth();
const state = isPending ? 'pending' : isError ? 'error' : 'ok';
const label =
  state === 'pending' ? '연결 확인 중…'
  : state === 'error' ? '백엔드 미연결'
  : '백엔드 정상';`,
      },
      {
        kind: 'callout',
        tone: 'do',
        title: '화면 = 복붙 시작점',
        body: '폼은 `LoginPage.tsx`, 데이터 조회는 `health/api.ts`의 shape를 복사하세요. `isPending`/`isError`를 먼저 가드한 뒤에만 `data`를 읽습니다.',
      },
    ],
  },
  {
    id: 'rules',
    title: '핵심 규칙 · 패턴',
    subtitle: '도구가 강제하지 못하는, 반드시 지켜야 하는 약속들.',
    blocks: [
      {
        kind: 'prose',
        text: 'lint·format·import 순서·타입 엄격성·a11y는 **Biome 2.5 + TypeScript strict**가 자동으로 강제합니다. 여기서는 **도구가 못 막는 규칙**만 다룹니다. 이 약속들이 “할루시네이션 최소화 / 오버엔지니어링 금지” 두 하드 룰의 실천입니다.',
      },
      { kind: 'subheading', text: '단일 API 패턴 (가장 중요)' },
      {
        kind: 'callout',
        tone: 'do',
        title: '항상 이렇게',
        body: '`src/lib/api`에서 인스턴스화된 생성 클라이언트 `api`로만 호출합니다. 모든 호출은 생성된 `schema.d.ts`에 대해 타입 체크되어야 합니다. 필드나 엔드포인트가 없으면 스펙이 stale한 것입니다. 백엔드 스펙을 고치고 `pnpm gen:api`로 재생성합니다.',
      },
      {
        kind: 'callout',
        tone: 'dont',
        title: '절대 금지',
        body: '손수 `fetch`/`axios` 작성, 엔드포인트·파라미터·응답 필드 임의 발명, `as any` · `as unknown as T` · `@ts-expect-error`로 불일치 무마, 서버 타입 손수 재선언, 생성 파일(`schema.d.ts`) 직접 편집.',
      },
      {
        kind: 'code',
        file: 'src/lib/api/client.ts: 단 하나의 타입드 클라이언트',
        lang: 'ts',
        code: `export const api = createClient<paths>({ baseUrl: env.VITE_API_BASE_URL });

api.use({
  onRequest({ request }) {
    const token = getToken();
    if (token) request.headers.set('Authorization', \`Bearer \${token}\`);
    return request;
  },
  onResponse({ response }) {
    if (response.status === 401) {
      clearToken();
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return response;
  },
});`,
      },
      {
        kind: 'callout',
        tone: 'info',
        title: '인증 흐름이 도는 곳',
        body: '토큰 부착과 만료 세션(401) 처리가 이 한 곳에 모여 있습니다. `onRequest`가 Bearer 토큰을 붙이고, 401이면 `clearToken()` 후 `/login`으로 리다이렉트하며, 그 도착지가 `LoginPage`입니다. 토큰 저장은 `src/lib/auth/token.ts`에서만 다룹니다.',
      },
      { kind: 'subheading', text: '환경 변수' },
      {
        kind: 'callout',
        tone: 'do',
        title: '검증된 env 모듈만',
        body: '앱 코드는 `@/lib/env`의 `env`를 import합니다. 새 변수는 `envSchema`에 먼저 추가하고, `VITE_` 접두사가 붙은 것만 클라이언트에 노출됩니다. 시크릿은 클라이언트 env에 넣지 않습니다.',
      },
      {
        kind: 'callout',
        tone: 'dont',
        body: '앱 코드에서 `import.meta.env`나 `process.env`를 직접 읽지 않습니다.',
      },
      {
        kind: 'code',
        file: 'src/lib/env.ts: Zod 검증 env (시작 시 fail-fast)',
        lang: 'ts',
        code: `const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1, 'VITE_API_BASE_URL is required'),
  VITE_API_OPENAPI_URL: z.string().min(1).optional(),
});

export const env = envSchema.parse(import.meta.env);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        body: '`VITE_API_OPENAPI_URL`은 런타임엔 optional이지만, `pnpm gen:api`는 이 변수를 **필수**로 씁니다(없으면 타입 생성이 깨짐). “optional인데 왜 gen:api가 안 되지?”의 정답입니다.',
      },
      { kind: 'subheading', text: '상태 관리' },
      {
        kind: 'callout',
        tone: 'do',
        title: '상태 위치 결정',
        body: '서버 상태 → **TanStack Query만**. 공유 클라이언트/UI 상태 → **Zustand**(진짜 공유될 때만). 로컬 상태 → **useState**. 다음 상태가 이전 상태에서 파생되면 `setX(prev => ...)` 함수형 업데이터를 씁니다.',
      },
      {
        kind: 'callout',
        tone: 'dont',
        body: 'fetch한 서버 데이터를 Zustand/useState로 복사하기, `useEffect`로 데이터 fetch하기, `isPending`/`isError` 가드 없이 `data` 읽기.',
      },
      {
        kind: 'callout',
        tone: 'info',
        body: '레포에 실제로 존재하는 **유일한 Zustand store는 테마**(`src/stores/theme.ts`, persist)입니다. “genuinely shared일 때만 store”라는 규칙의 예시입니다. GET은 모두 `useQuery`, mutation은 `useMutation`.',
      },
      { kind: 'subheading', text: '쿼리 키 중앙 팩토리' },
      {
        kind: 'callout',
        tone: 'do',
        title: '키는 팩토리에서만',
        body: '`queryKeys`에서 키를 가져오고 계층 구조를 유지합니다. `users.all`을 invalidate하면 그 아래 모든 list/detail이 함께 무효화되도록 키가 스프레드로 누적됩니다.',
      },
      {
        kind: 'callout',
        tone: 'dont',
        body: "호출부에서 `['users', id]` 같은 ad-hoc 배열 키를 인라인하지 않습니다. 그러면 무효화가 깨집니다.",
      },
      {
        kind: 'code',
        file: 'src/lib/query-keys.ts: 계층 키 팩토리',
        lang: 'ts',
        code: `export const queryKeys = {
  health: { all: ['health'] as const },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
} as const;`,
      },
      { kind: 'subheading', text: '폼: React Hook Form + Zod' },
      {
        kind: 'prose',
        text: 'Zod 스키마를 콜로케이트하고 `zodResolver`로 RHF에 연결합니다. `handleSubmit`은 폼이 유효할 때만 `onSubmit`을 호출하고, 에러는 `aria-invalid` + `aria-describedby`로 접근성 링크하여 인라인 렌더합니다.',
      },
      {
        kind: 'code',
        file: 'src/features/auth/LoginPage.tsx: 스키마 + 리졸버',
        lang: 'tsx',
        code: `const loginSchema = z.object({
  email: z.email('유효한 이메일을 입력하세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});
type LoginValues = z.infer<typeof loginSchema>;

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'LoginPage의 onSubmit은 의도된 스캐폴드',
        body: "백엔드 스펙에 아직 auth 엔드포인트가 없어 `onSubmit`은 문서화된 TODO입니다. 엔드포인트가 생기면 `api.POST('/auth/login', { body })`로 연결하고, 성공 후 이동이 필요하면 `useNavigate`도 함께 추가합니다. fetch를 직접 작성하거나 엔드포인트를 발명하지 마세요.",
      },
    ],
  },
  {
    id: 'design',
    title: '디자인 시스템',
    subtitle: '위계와 여백, 그리고 하나의 accent로 의미를 만든다.',
    blocks: [
      {
        kind: 'prose',
        text: '신규 화면이 Linear / Stripe / Vercel 급 내부 도구처럼 보이게 하는 시각 계약입니다. 제품 voice는 **precise · calm · dependable** (PRODUCT.md). 전체 규칙은 `DESIGN.md`에 있습니다.',
      },
      { kind: 'subheading', text: '테마 & 색 (OKLCH)' },
      {
        kind: 'bullets',
        items: [
          '**다크모드는 class 기반** (`@custom-variant dark`). 토큰은 `src/styles/index.css`의 `@theme inline` + `:root`/`.dark` 변수로 정의.',
          '**Neutrals**가 UI를 끌고 간다 (near-zero chroma). cream/sand 기본값 금지.',
          '**Primary** = near-black(light)/near-white(dark) 모노크롬, 액션·강조용.',
          '**`--brand`** (azure, ~hue 245): 정체성용 단일 accent. 작은 surface wash·마크·border·크고 굵은 텍스트에만 씁니다. 작은 본문 텍스트에는 대비 때문에 쓰지 않습니다.',
          '**semantic** `destructive`/`success`/`warning`은 상태 전용 + `-foreground` 쌍. 상태를 색만으로 표현하지 말고 텍스트나 아이콘을 함께 씁니다.',
        ],
      },
      {
        kind: 'callout',
        tone: 'do',
        title: '토큰은 유틸리티로 소비',
        body: '`bg-background` · `text-foreground` · `text-muted-foreground` · `bg-primary` · `bg-warning text-warning-foreground` 처럼 유틸리티 클래스로만 색을 씁니다.',
      },
      {
        kind: 'callout',
        tone: 'dont',
        title: '하드코딩 금지',
        body: 'OKLCH 값·임의 색을 직접 쓰거나 `shadow-[...]` arbitrary 값을 만들지 않습니다. 깊이는 border-first(1px hairline + 낮은 shadow), `shadow-xl`/`shadow-2xl`도 금지.',
      },
      { kind: 'subheading', text: '컴포넌트 · 모션 · 레이아웃' },
      {
        kind: 'bullets',
        items: [
          '모든 인터랙티브 요소는 default·hover·focus(-visible)·active·disabled·loading·error 상태를 제공. 로딩=skeleton(스피너 X), empty state는 UI를 가르친다.',
          '새 컴포넌트는 **shadcn 방식**(cva + cn + Radix)으로. 아이콘은 `lucide` 통일.',
          'coarse pointer에서 컨트롤은 ≥ 44×44px 히트 타깃(padding으로 확장).',
          '모션 150~250ms ease-out, bounce/elastic 금지. `prefers-reduced-motion: reduce` 시 crossfade/즉시 대체.',
          '레이아웃은 mobile-first + **구조적** 반응형. z-index는 semantic scale, `9999` 금지.',
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '컴포넌트를 새로 만들 때',
        body: 'shadcn 컴포넌트는 CLI(`pnpm dlx shadcn@latest add <component>`) 또는 연결된 shadcn MCP로만 추가하고(이후 `src/components/ui`에서 직접 소유·수정), 손으로 작성하지 않습니다. 조건부/병합 클래스는 `cn()` 헬퍼(`@/lib/cn`)로 합성합니다.',
      },
    ],
  },
  {
    id: 'test',
    title: '테스트',
    subtitle: 'happy 경로만 검증하면 머지하지 않는다.',
    blocks: [
      {
        kind: 'prose',
        text: '두 계층입니다. **단위·컴포넌트 = Vitest + Testing Library** → `src/**/*.test.tsx` 콜로케이션. **E2E = Playwright** → `e2e/**/*.spec.ts`. `*.spec.ts`는 `src` 아래 두지 않습니다.',
      },
      {
        kind: 'callout',
        tone: 'info',
        title: '컴포넌트 테스트 하네스',
        body: '컴포넌트 테스트는 `src/test/renderWithProviders.tsx`로 QueryClient·Router provider를 감싸 렌더합니다. `useQuery`/router 훅을 쓰는 컴포넌트는 이 헬퍼로 시작하세요.',
      },
      {
        kind: 'prose',
        text: '단언은 CSS 클래스나 `data-testid`가 아니라 **사용자 가시 핸들**(`getByRole`/`getByText`)로 합니다. E2E는 `page.route()`로 백엔드를 모킹해 error/loading/empty 같은 non-happy 경로를 반드시 포함합니다.',
      },
      {
        kind: 'code',
        file: 'e2e/health.spec.ts: page.route()로 non-happy 모킹',
        lang: 'ts',
        code: `const HEALTH = '**/health';

test('500 → 미연결 상태를 보여준다', async ({ page }) => {
  await page.route(HEALTH, (route) =>
    route.fulfill({ status: 500, contentType: 'application/json',
      body: JSON.stringify({ message: 'internal error' }) }),
  );
  await page.goto('/');
  await expect(page.getByText('백엔드 미연결')).toBeVisible();
});`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        body: 'happy-path만 있는 E2E는 머지 금지. `navigation.spec.ts`의 “미지 경로 → 에러 화면”, `health.spec.ts`의 500/지연 모킹이 그 예입니다. 리스트 화면이라면 `[]` 응답으로 empty-state 케이스를 추가하세요.',
      },
    ],
  },
  {
    id: 'gate',
    title: '품질 게이트 & CI',
    subtitle: '로컬 · pre-commit · GitHub Actions 3중으로 품질을 강제한다.',
    blocks: [
      {
        kind: 'prose',
        text: '품질은 **Biome 2.5.0**(lint+format)과 **TypeScript strict**가 도구로 강제합니다(추가 가드: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals` 등). 커밋 전 `pnpm check` + `pnpm typecheck`가 통과해야 합니다.',
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'pre-commit이 자동 강제',
        body: '`.husky/pre-commit`이 `pnpm exec lint-staged && pnpm typecheck`를 실행합니다. lint-staged가 스테이징된 파일에 `biome check --write`를 돌리고, 이어서 전체 typecheck가 통과해야 커밋이 진행됩니다. (`pnpm install` 시 설정됩니다.)',
      },
      { kind: 'subheading', text: '명령어 cheat sheet' },
      {
        kind: 'table',
        headers: ['명령어', '설명'],
        rows: [
          ['`pnpm dev`', 'Vite 개발 서버'],
          ['`pnpm build`', '타입 체크(`tsc -b`) + 프로덕션 빌드 → `dist/`'],
          ['`pnpm typecheck`', '`tsc --noEmit -p tsconfig.app.json`, 완료 전 필수'],
          ['`pnpm lint`', 'Biome 린트'],
          ['`pnpm format`', 'Biome 포맷 적용'],
          ['`pnpm check`', 'Biome lint + format `--write`, 커밋 전 실행'],
          ['`pnpm test` / `test:run`', 'Vitest watch / 1회 실행'],
          ['`pnpm e2e` / `e2e:ui`', 'Playwright E2E / UI 디버그 모드'],
          ['`pnpm gen:api`', 'OpenAPI 타입 재생성 (스펙 변경 시에만)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'gen:api는 스펙 변경 시에만',
        body: '`openapi-typescript $VITE_API_OPENAPI_URL -o src/lib/api/schema.d.ts`를 실행합니다. 새로 clone한 경우 `schema.d.ts`가 이미 커밋돼 있으니 건너뛰고, 생성 파일은 직접 수정하지 않습니다(Biome 제외 대상).',
      },
      { kind: 'subheading', text: 'CI / 배포' },
      {
        kind: 'callout',
        tone: 'info',
        title: 'CI는 GitHub Actions로 자동 실행',
        body: '`.github/workflows/ci.yml`이 push/PR마다 클린 환경에서 로컬과 동일한 게이트(`pnpm typecheck` · `pnpm exec biome ci .` · `pnpm test:run` · `pnpm build` · `pnpm e2e`)를 실행합니다. 로컬에서는 pre-commit 훅이 1차로 강제하니, 커밋 전 `pnpm check` · `pnpm typecheck`를 먼저 통과시키세요.',
      },
      {
        kind: 'prose',
        text: '호스트 저장소는 **GitHub** `sh5623/railhead`입니다. `.github/workflows/ci.yml`이 아래 순서로 로컬과 동일한 게이트를 클린 환경에서 실행합니다.',
      },
      {
        kind: 'code',
        file: '.github/workflows/ci.yml: 게이트 순서',
        lang: 'yaml',
        code: `- run: pnpm typecheck         # tsc --noEmit (strict)
- run: pnpm exec biome ci .   # lint + format 검사 (no write)
- run: pnpm test:run          # Vitest unit/component (1회)
- run: pnpm build             # tsc -b && vite build -> dist/
- run: pnpm e2e               # Playwright; CI=true는 vite preview(dist) 대상`,
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'CI에서: preview 대상 E2E',
        body: 'CI 환경에서는 `CI=true`라서 Playwright가 `pnpm build` 산출물(`dist`)을 `vite preview --strictPort`로 서빙하고 그에 대해 E2E를 돌립니다. 로컬은 빠른 반복을 위해 `pnpm dev` 서버를 자동 기동합니다. 프로젝트는 `chromium`(Desktop) + `mobile-chrome`(Pixel 5).',
      },
    ],
  },
  {
    id: 'workflow',
    title: 'fe-rail 워크플로우',
    subtitle: '스펙 → 구현 → 리뷰 → PR을 하나의 레일로.',
    blocks: [
      {
        kind: 'prose',
        text: '**fe-rail**은 프론트엔드 작업을 위한 전용 하네스(플러그인)입니다. 기능을 **spec → build → review → PR** 사이클로 자동화하며, 각 단계가 별도 스킬로 분리되어 있습니다.',
      },
      {
        kind: 'callout',
        tone: 'info',
        title: '설치: 클론만으로는 안 따라옵니다',
        body: '이 저장소는 `.claude/`를 gitignore하므로 fe-rail은 **개발자별 로컬 설치**입니다(project scope). 아래 2단계 후 슬래시 명령 또는 자연어로 트리거됩니다.',
      },
      {
        kind: 'code',
        file: 'fe-rail 설치 (Claude Code 내에서)',
        lang: 'text',
        code: `/plugin marketplace add sh5623/fe-rail
/plugin install fe-rail@fe-rail-market`,
      },
      { kind: 'subheading', text: '스킬 한눈에 보기' },
      {
        kind: 'table',
        headers: ['스킬 (호출)', '무엇을', '언제', '쓰지 말 때', '사람 개입'],
        rows: [
          [
            '`/fe-spec`',
            '요구사항을 `feature.md` 스펙으로',
            '새 기능 시작 전',
            '버그수정·리팩토링·스타일',
            '스펙 승인',
          ],
          [
            '`/fe-build`',
            '승인된 스펙으로 구현',
            '`feature.md` 승인 직후',
            '스펙 작성·리뷰',
            '없음',
          ],
          [
            '`/fe-review`',
            '4축(타입·성능·a11y·품질) 검토',
            '구현 완료 후, PR 전',
            '스펙·신규 구현',
            'BLOCK 수정 결정',
          ],
          ['`/fe-start`', '스펙→PR 원스톱 자동', '“feature.md로 시작해줘”', '없음', '두 번 (아래)'],
          [
            '`/fe-doc-sync`',
            '`CLAUDE.md`/`README.md` 동기화',
            '라우트·의존성·구조 변경 후',
            '없음',
            '수정안 승인',
          ],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        body: '각 스킬 frontmatter의 “Do NOT load for”를 지킵니다. 예: `fe-spec`은 버그수정/리팩토링/스타일 변경에 로드 금지, `fe-build`는 스펙 작성/리뷰에 금지. 잘못된 스킬을 띄우면 사이클이 어긋납니다.',
      },
      { kind: 'subheading', text: '표준 흐름 (수동: spec → build → review → PR)' },
      {
        kind: 'steps',
        items: [
          '**기능 시작.** 무엇을 만들지 정합니다 (페이지·컴포넌트·훅).',
          '**/fe-spec.** 목적, 화면 흐름, 정상·비정상 시나리오, 완료 기준을 담은 `feature.md`를 루트에 작성합니다.',
          '**승인.** “이 스펙으로 구현을 진행할까요?”에 답합니다. **승인 전엔 코드를 작성하지 않습니다.**',
          '**/fe-build.** 레포의 실제 모범 파일 shape를 복사해 타입 → 훅 → 컴포넌트 → 테스트 순으로 구현하고 자동 검증합니다.',
          '**/fe-review.** 4축 리뷰. BLOCK은 수정 후 재검토해 **BLOCK 0**을 만듭니다.',
          '**커밋.** 사용자가 명시적으로 요청할 때만 합니다. 파일을 하나씩 스테이징합니다(`git add .` 금지).',
          '**PR.** `gh pr create`로 GitHub PR을 생성합니다. fe-start 사용 시 기본 draft.',
        ],
      },
      {
        kind: 'callout',
        tone: 'dont',
        body: 'fe-build는 스킬의 산문 예시가 아니라 **소비자 레포의 실제 패턴**을 1차 소스로 따릅니다: `src/features/*/api.ts` · `src/lib/query-keys.ts` · `src/lib/api/client.ts` · `src/components/ui/*`를 grep·Read해 같은 컨벤션으로 작성합니다.',
      },
      { kind: 'subheading', text: '/fe-start: 원스톱 자동화' },
      {
        kind: 'prose',
        text: '`feature.md` 하나로 **스펙 확인 → 구현 → 검증 → 리뷰 → 커밋 → PR**을 끝까지 자동 진행합니다. 중간에 딱 두 번만 멈춰 사람에게 묻습니다.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '두 번의 STOP',
        body: '① “위 내용으로 구현을 시작할까요?” (승인 전 코드 작성 금지)　② “검증 완료. 커밋하고 PR 생성할까요?” 이 두 지점 외에는 자동입니다.',
      },
      {
        kind: 'code',
        file: '호출 예 (슬래시 / 자연어 모두 가능)',
        lang: 'bash',
        code: `/fe-start feature.md
"feature.md로 시작해줘"

/fe-start feature.md --plan-only   # Phase1까지만 (계획 확인)
/fe-start feature.md --no-pr       # 커밋까지만, PR 생략
/fe-start feature.md --no-draft    # PR을 바로 ready 상태로`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        body: '이 저장소 지침상 작업 완료 후 **자동 커밋·push 금지**입니다. `/fe-start`의 두 번째 STOP에서도 사용자가 같은 세션에서 명시 승인할 때만 커밋·PR이 진행됩니다(커밋은 `fe-git-operator`, PR은 `fe-pr-author` 에이전트에 위임).',
      },
    ],
  },
  {
    id: 'agents',
    title: '에이전트 & 자동 가드레일',
    subtitle: '이름 15개를 외우기보다 흐름을 익히면 된다.',
    blocks: [
      {
        kind: 'prose',
        text: 'fe-rail은 작업 종류별 서브에이전트 15개를 제공합니다. 핵심은 **직접 호출할 필요가 거의 없다**는 점입니다. 스킬과 메인 세션이 단계에 맞는 에이전트를 자동 위임합니다. 아래 표는 “내부에서 무슨 일이 일어나는지” 파악용 지도입니다.',
      },
      {
        kind: 'callout',
        tone: 'info',
        body: '**READ-ONLY**는 frontmatter `disallowedTools`에 `Write`/`Edit`이 들어가 파일을 절대 수정하지 않는다는 뜻입니다. 15개 중 13개가 읽기 전용이라 안심하고 돌릴 수 있고, 쓰기 가능한 건 `fe-build-fixer`·`fe-test-author` 둘뿐입니다.',
      },
      {
        kind: 'table',
        headers: ['그룹', '에이전트', '역할', 'RO'],
        rows: [
          [
            '탐색',
            '`fe-explorer`',
            '코드베이스 탐색 전담. 경로·역할 요약만 반환(부모 컨텍스트 보호, haiku)',
            '예',
          ],
          [
            '스펙·분석',
            '`fe-analyst`',
            '요구사항 갭(미질문·미정의 가드레일·범위 확장·엣지 케이스) 식별',
            '예',
          ],
          [
            '',
            '`fe-architect`',
            '아키텍처 자문. 컴포넌트 경계·데이터 흐름·상태·라우팅 (file:line 근거)',
            '예',
          ],
          [
            '',
            '`fe-refactor-advisor`',
            '리팩토링 6차원 평가 + Before/After + 영향도×난이도 매트릭스',
            '예',
          ],
          ['', '`fe-researcher`', '외부 문서·라이브러리 조사. 모든 정보에 출처 URL 필수', '예'],
          [
            '구현·수정',
            '`fe-build-fixer`',
            '빌드/타입 오류를 최소 diff로 수정. 아키텍처 변경 없이 “오류만”',
            '아니오',
          ],
          ['리뷰·감사', '`fe-reviewer`', '변경 파일 4축 리뷰 → BLOCK/WARN/INFO 분류', '예'],
          ['', '`fe-a11y-auditor`', '접근성 정밀 감사. semantic·ARIA·키보드·대비 (WCAG AA)', '예'],
          [
            '',
            '`fe-perf-auditor`',
            'React 성능 정밀 감사. 번들·fetch·Image·dynamic import (정량)',
            '예',
          ],
          [
            '테스트',
            '`fe-test-author`',
            '테스트 코드 생성. BDD 시나리오 + TDD Red-Green-Refactor',
            '아니오',
          ],
          [
            '',
            '`fe-test-runner`',
            '테스트 실행 전담. 실패를 카테고리로 분류 요약(노이즈 차단)',
            '예',
          ],
          [
            'git·PR',
            '`fe-git-operator`',
            '커밋 분리·안전한 스테이징 + Conventional Commits 본문',
            '예',
          ],
          [
            '',
            '`fe-pr-author`',
            '커밋·diff·spec 종합 → PR 본문 + PR 생성 (GitHub `gh pr create`, 기본 draft)',
            '예',
          ],
          [
            '디자인',
            '`fe-vision`',
            '화면(Figma·시안)에서 레이아웃·색·타이포 정밀 추출(디자인→코드) + 구현 스크린샷을 레퍼런스와 대조해 시각 충실도 판정(visual-verdict, 고증 작업 시)',
            '예',
          ],
          ['', '`fe-deck-reader`', 'PPT·기획서를 [정책 / 목업 / 흐름 / 데이터]로 분해', '예'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        body: '흐름만 기억하세요: 새 기능은 `/fe-spec` → `/fe-build` → `/fe-review`, 끝까지 자동은 `/fe-start`. 각 스킬이 위 에이전트들을 알아서 부릅니다.',
      },
      { kind: 'subheading', text: '자동 가드레일 (hooks)' },
      {
        kind: 'prose',
        text: '`hooks.json`에 매핑된 셸 훅이 도구 실행 직전(PreToolUse)·직후(PostToolUse)·세션 시작(SessionStart)·응답 종료(Stop) 시점에 위험 명령·민감 파일·품질 저하를 자동으로 막거나 잡아냅니다.',
      },
      {
        kind: 'table',
        headers: ['시점', '훅', '하는 일'],
        rows: [
          [
            'SessionStart',
            '`session-init.sh`',
            '세션 시작 시 실행. 원격 버전 체크는 통과만 하며, 업데이트는 `/plugin marketplace update`로 수동입니다.',
          ],
          [
            'PreToolUse: Bash',
            '`guard.sh`',
            '**차단**: `git add .`/`-A`, force push(`--force-with-lease`는 허용), `--no-verify`, `git reset --hard`, `git checkout/restore .`, publish, 루트·홈 `rm -rf`, `DROP TABLE/DATABASE`.',
          ],
          [
            'PreToolUse: Write·Edit',
            '`write-guard.sh`',
            '**차단**: 민감 파일 생성·수정. `.env` 계열(`.env.example`은 허용), 인증서·키(`*.pem/*.key/*.p12`), `credentials.json`/`secrets.json` 등.',
          ],
          ['PreToolUse: Read', '`read-guard.sh`', '민감 파일 읽기 시 **경고만**(차단 안 함).'],
          [
            'PreToolUse: Task·Agent',
            '`task-guard.sh`',
            '서브에이전트 프롬프트의 인젝션 패턴·위험 명령 위임은 **차단**, 민감정보 접근은 경고.',
          ],
          [
            'PostToolUse: Edit·Write',
            '`lint-fix.sh`',
            '편집 직후 **자동 정리**: Biome `check --write` / ESLint `--fix`. 남은 오류는 표시.',
          ],
          [
            'PostToolUse: Edit·Write',
            '`nextjs-guard.sh`',
            'Next.js 프로젝트에서만 동작(Server Component 경고). Vite SPA에선 즉시 종료.',
          ],
          [
            'Stop',
            '`quality-gate.sh`',
            '응답 종료 직전 변경 파일(최대 20개)에 Biome/ESLint + `tsc --noEmit` 일괄 실행(보고만).',
          ],
          [
            'Stop',
            '`doc-sync-check.sh`',
            '구조·의존성 변경 감지 시 `/fe-rail:fe-doc-sync` 실행 안내.',
          ],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '안심하고 작업하세요',
        body: '위험한 git/rm/DROP 명령과 시크릿 파일 쓰기는 실제로 **차단**되고, 저장하면 lint-fix가 포맷·린트를 고치며, 응답을 마칠 때 quality-gate가 Biome + tsc로 한 번 더 검증합니다. 실수로 히스토리를 망가뜨리거나 깨진 코드를 남길 일이 구조적으로 막혀 있습니다.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        body: '차단 대상은 회피하지 말고 의도대로 푸세요: `git add .` 대신 파일 명시, 강제 푸시가 필요하면 `--force-with-lease`, `.env` 대신 `.env.example`. `--no-verify`로 훅을 우회하는 것도 막힙니다.',
      },
    ],
  },
  {
    id: 'first-pr',
    title: '첫 PR',
    subtitle: '레일을 한 바퀴, 그리고 막혔을 때.',
    blocks: [
      { kind: 'subheading', text: '여정 요약' },
      {
        kind: 'steps',
        items: [
          '만들 기능을 정한다 → `/fe-spec`으로 `feature.md` 작성 → **승인**.',
          '`/fe-build`로 구현 (실제 레포 패턴 복사: `health/api.ts` · `LoginPage.tsx` shape).',
          '`/fe-review` → **BLOCK 0** 달성.',
          '`pnpm check && pnpm typecheck` 통과 확인 (husky가 커밋 때 한 번 더 강제).',
          '커밋·PR은 **명시적으로 요청**할 때만 합니다. 작업이 끝나면 멈추고 지시를 기다립니다.',
        ],
      },
      { kind: 'subheading', text: '막혔을 때 (흔한 함정)' },
      {
        kind: 'bullets',
        items: [
          '**앱이 즉시 죽는다** → `.env` 누락. `cp .env.example .env`. 항상 `@/lib/env`의 `env`를 쓰고 `import.meta.env`를 직접 읽지 않는다.',
          '**새 API 호출이 타입체크에서 막힌다** → 정상이다. 엔드포인트를 지어내지 말고, 스펙이 stale하면 백엔드 스펙 수정 후 `pnpm gen:api`. `health/api.ts` shape를 복사해 시작하는 게 가장 빠르다.',
          '**포트 5173 점유**로 dev/E2E가 안 뜬다 → `E2E_PORT=5174 pnpm e2e` (config가 `strictPort`라 조용히 넘어가지 않고 실패한다).',
          '**`git add .`가 막힌다** → `guard.sh`가 의도적으로 차단한 것. 파일을 명시 스테이징, 강제 푸시는 `--force-with-lease`.',
          '**HealthBadge가 “백엔드 미연결”** → 백엔드가 로컬에 없을 때의 정상 상태(경보 아님).',
          '**`schema.d.ts` 등 생성 파일**은 read-only. 손으로 고치지 말고 `pnpm gen:api`로 재생성.',
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '한 줄 요약',
        body: '생성된 타입 안에서 레포의 실제 패턴을 복사해 작업하세요. 막히는 지점은 대개 가드레일이 의도대로 막고 있는 것입니다.',
      },
      { kind: 'subheading', text: '더 읽을거리 (저장소 내 문서)' },
      {
        kind: 'bullets',
        items: [
          '`README.md`: 시작하기, 스크립트, 트러블슈팅.',
          '`AGENTS.md`: 도구가 못 막는 컨벤션의 단일 소스(`CLAUDE.md`가 import).',
          '`DESIGN.md`: 시각 계약(토큰, OKLCH, 상태, 모션, 금지 목록).',
          '`PRODUCT.md`: 제품·브랜드 register (precise, calm, dependable).',
        ],
      },
    ],
  },
];

/** Two-digit station codes (`00`…); the terminus uses a downward arrow. */
export const SECTION_CODES = SECTIONS.map((_, i) =>
  i === SECTIONS.length - 1 ? '↓' : String(i).padStart(2, '0'),
);

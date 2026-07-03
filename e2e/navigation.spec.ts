import { expect, test } from '@playwright/test';

/**
 * Happy path: the home route renders the onboarding page; the in-page route nav
 * jumps to sections. Non-happy path: unknown URLs — including the now-removed
 * `/fe-rail` — render the error boundary, not a blank screen. (Network
 * non-happy paths live in `health.spec.ts`.)
 */
test('홈은 온보딩 페이지를 렌더하고 로그인으로 이동한다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /레일을 따라/ })).toBeVisible();

  await page.goto('/login');
  await expect(page.getByRole('heading', { level: 1, name: '로그인' })).toBeVisible();
});

test('노선도 nav가 섹션 앵커로 이동시킨다', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: '노선도' });
  await nav.getByRole('link', { name: 'fe-rail 워크플로우' }).click();
  await expect(page).toHaveURL(/#workflow$/);
  await expect(page.getByRole('heading', { level: 2, name: 'fe-rail 워크플로우' })).toBeVisible();
});

test('제거된 /fe-rail과 알 수 없는 경로는 에러 화면을 보여준다', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { level: 1, name: '오류가 발생했습니다' })).toBeVisible();

  await page.goto('/fe-rail');
  await expect(page.getByRole('heading', { level: 1, name: '오류가 발생했습니다' })).toBeVisible();
});

test('맨 위로 버튼: 상단에선 inert로 숨고, 스크롤 후 눌러 최상단으로 복귀한다', async ({
  page,
}) => {
  await page.goto('/');
  const toTop = page.locator('button[aria-label="맨 위로 이동"]');

  // 비정상(상단): 버튼은 inert라 탭/클릭 대상에서 빠져 있다.
  await expect(toTop).toHaveAttribute('inert', '');

  // 아래로 스크롤하면 활성화된다.
  await page.evaluate(() => window.scrollTo(0, 2000));
  await expect(toTop).not.toHaveAttribute('inert');

  // 키보드로 활성화(포인터는 dev의 Query Devtools 오버레이가 가림) → 최상단 복귀 → 다시 inert.
  await toTop.focus();
  await toTop.press('Enter');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(toTop).toHaveAttribute('inert', '');
});

/**
 * 접기/펼치기를 제거했으므로 모든 섹션(과거 "참고" 섹션 포함) 본문이 처음부터 보인다.
 * "에이전트 & 자동 가드레일"이 그 예다. 노선도 점프는 해당 섹션 앵커로 이동시킨다.
 */
const REF_SECTION_BODY = 'fe-rail은 작업 종류별 서브에이전트';

test('참고 섹션 본문이 기본으로 펼쳐져 있다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(REF_SECTION_BODY, { exact: false })).toBeVisible();
});

test('노선도에서 참고 섹션으로 점프하면 해당 섹션으로 이동한다', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: '노선도' })
    .getByRole('link', { name: '에이전트 & 자동 가드레일' })
    .click();
  await expect(page).toHaveURL(/#agents$/);
  await expect(
    page.getByRole('heading', { level: 2, name: '에이전트 & 자동 가드레일' }),
  ).toBeVisible();
});

/**
 * 다크모드 토글(switch · 디자인 C): 헤더 토글이 라이트↔다크를 전환하고 상태를
 * role=switch / aria-checked + <html>.dark 로 반영한다.
 */
test('다크모드 토글로 라이트↔다크가 전환된다', async ({ page }) => {
  await page.goto('/');
  const sw = page.getByRole('switch', { name: '다크 모드로 전환' });
  await expect(sw).toHaveAttribute('aria-checked', 'false');
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

  await sw.click();

  await expect(page.getByRole('switch', { name: '라이트 모드로 전환' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
});

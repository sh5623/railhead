import { expect, test } from '@playwright/test';

/**
 * Non-happy network paths via `page.route()` — the rule that keeps E2E from
 * being happy-only. We mock the `/health` endpoint and assert each state the
 * footer `HealthBadge` renders (error / loading / ok). Assertions are scoped to
 * the badge's `role="status"` region: the onboarding page shows the same state
 * strings inside a code example, so plain `getByText` would be ambiguous.
 *
 * For a real list screen, add a 4th case: fulfill with `[]` and assert the
 * empty-state UI. The health badge has no "empty" state, so it isn't shown here.
 */
const HEALTH = '**/health';

test('500 → 미연결 상태를 보여준다', async ({ page }) => {
  await page.route(HEALTH, (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'internal error' }),
    }),
  );

  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('백엔드 미연결');
});

test('응답 지연 → 로딩 상태를 보여준다', async ({ page }) => {
  await page.route(HEALTH, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok' }),
    });
  });

  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('연결 확인 중…');
});

test('정상 200 → 정상 상태를 보여준다', async ({ page }) => {
  await page.route(HEALTH, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok' }),
    }),
  );

  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('백엔드 정상');
});

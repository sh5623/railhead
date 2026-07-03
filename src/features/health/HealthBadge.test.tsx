import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HealthBadge } from '@/features/health/HealthBadge';
import { api } from '@/lib/api/client';
import { renderWithProviders } from '@/test/renderWithProviders';

// openapi-fetch captures `globalThis.fetch` at module load, so stubbing fetch
// later won't intercept — mock the typed client instead. The factory's default
// impl resolves OK; individual tests override it per case.
vi.mock('@/lib/api/client', () => ({
  api: {
    GET: vi.fn(async () => ({ data: { status: 'ok' }, response: new Response() })),
  },
}));

describe('HealthBadge', () => {
  it('shows the connected state when the API resolves', async () => {
    renderWithProviders(<HealthBadge />);
    expect(await screen.findByText('백엔드 정상')).toBeInTheDocument();
  });

  it('shows the disconnected state when the request fails (non-happy)', async () => {
    vi.mocked(api.GET).mockRejectedValueOnce(new Error('backend down'));
    renderWithProviders(<HealthBadge />);
    expect(await screen.findByText('백엔드 미연결')).toBeInTheDocument();
  });
});

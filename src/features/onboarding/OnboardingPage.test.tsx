import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('OnboardingPage', () => {
  it('renders the hero and key section headings', () => {
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByRole('heading', { level: 1, name: /레일을 따라/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '핵심 규칙 · 패턴' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'fe-rail 워크플로우' })).toBeInTheDocument();
  });

  it('lists every station in the route nav', () => {
    renderWithProviders(<OnboardingPage />);
    const nav = screen.getByRole('navigation', { name: '노선도' });
    expect(within(nav).getByRole('link', { name: /출발 준비/ })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /첫 PR/ })).toBeInTheDocument();
  });

  it('shows the real fe-rail install command', () => {
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText(/fe-rail@fe-rail-market/)).toBeInTheDocument();
  });

  it('renders every section expanded with no collapse toggle', () => {
    renderWithProviders(<OnboardingPage />);
    // "에이전트 & 자동 가드레일" used to be a collapsible reference section;
    // collapse is removed, so its body renders and there is no toggle button.
    expect(screen.getByText(/fe-rail은 작업 종류별 서브에이전트/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /에이전트 & 자동 가드레일/ })).toBeNull();
  });
});

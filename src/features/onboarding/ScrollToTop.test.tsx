import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollToTop } from '@/features/onboarding/ScrollToTop';

/** jsdom exposes `scrollY` as a read-only getter; redefine it to simulate scroll. */
function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true });
}

// `hidden: true` so the query still resolves while the button is `inert`.
const button = () => screen.getByRole('button', { name: '맨 위로 이동', hidden: true });

afterEach(() => {
  setScrollY(0);
  vi.unstubAllGlobals();
});

describe('ScrollToTop', () => {
  it('상단(scrollY=0)에서는 inert로 비활성화되어 탭·스크린리더 대상에서 빠진다', () => {
    setScrollY(0);
    render(<ScrollToTop />);
    expect(button()).toHaveAttribute('inert');
  });

  it('첫 화면(임계값) 이상 스크롤하면 활성화된다', () => {
    setScrollY(0);
    render(<ScrollToTop />);
    expect(button()).toHaveAttribute('inert');

    setScrollY(600);
    fireEvent.scroll(window);
    expect(button()).not.toHaveAttribute('inert');
  });

  it('클릭하면 부드럽게(behavior:smooth) 최상단으로 스크롤한다', () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    setScrollY(600);
    render(<ScrollToTop />);
    fireEvent.scroll(window);

    fireEvent.click(button());
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('prefers-reduced-motion이면 즉시(behavior:auto) 이동한다', () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    setScrollY(600);
    render(<ScrollToTop />);
    fireEvent.scroll(window);

    fireEvent.click(button());
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });
});

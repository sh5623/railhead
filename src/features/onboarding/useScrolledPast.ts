import { useEffect, useState } from 'react';

/**
 * Track whether the window has scrolled past `threshold` px from the top.
 * No-op safe where `window` is unavailable (SSR / some test envs). Reads scroll
 * position on a passive listener.
 */
export function useScrolledPast(threshold: number): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => setScrolled(window.scrollY > threshold);
    update(); // sync initial state (e.g. reload while scrolled mid-page)

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  return scrolled;
}

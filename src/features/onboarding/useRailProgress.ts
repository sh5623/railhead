import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-driven active-station index for the onboarding line. A station is
 * active once its top scrolls up past the bottom of the sticky stack (header +
 * route-map overview), so the highlighted car always matches the section
 * showing just below the overview. The route-map highlight and spine node read
 * off this single index.
 *
 * `offset` is that sticky-stack height in CSS px (header ≈ 57 + route-map ≈ 242
 * ≈ 300). Measured with `getBoundingClientRect().top` (viewport-relative), so it
 * is independent of the section's `offsetParent` — `offsetTop` would be relative
 * to the positioned spine container and mismatch `window.scrollY`.
 *
 * RAF-throttled. jsdom-safe: with no layout the document is not taller than the
 * viewport, so it stays at 0 (first station active). Pass a stable `sectionIds`
 * array (module-level constant).
 */
export function useRailProgress(sectionIds: string[], offset = 300): number {
  const [active, setActive] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const n = sectionIds.length;
    if (n === 0) return;

    const compute = () => {
      rafRef.current = 0;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      // No layout (jsdom) or page fits the viewport → first station.
      if (docH <= winH) {
        setActive((prev) => (prev === 0 ? prev : 0));
        return;
      }

      // Active = the last station whose top has passed the sticky-stack line.
      let idx = 0;
      for (let i = 0; i < n; i++) {
        const el = document.getElementById(sectionIds[i] ?? '');
        const top = el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
        if (top <= offset + 1) idx = i;
        else break;
      }
      // Snap to the terminus at the very bottom (a short final section never
      // scrolls far enough to reach the line otherwise).
      if (docH - winH - window.scrollY < 4) idx = n - 1;

      setActive((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionIds, offset]);

  return active;
}

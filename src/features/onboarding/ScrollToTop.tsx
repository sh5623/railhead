import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrolledPast } from '@/features/onboarding/useScrolledPast';
import { cn } from '@/lib/cn';

/** Reveal the button once the reader has scrolled past roughly the first viewport. */
const SHOW_AFTER_PX = 480;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Floating "back to top" control for the long onboarding page. Hidden — and pulled
 * out of the tab + a11y tree via `inert` — until the reader scrolls down; clicking
 * returns to the top, smoothly or instantly under `prefers-reduced-motion`.
 */
export function ScrollToTop() {
  const visible = useScrolledPast(SHOW_AFTER_PX);

  const handleClick = () => {
    if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') return;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="맨 위로 이동"
      inert={!visible}
      onClick={handleClick}
      className={cn(
        'fixed right-6 bottom-6 z-20 size-11 rounded-full shadow-md transition-all duration-200 ease-out motion-reduce:transition-none sm:right-8 sm:bottom-8',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </Button>
  );
}

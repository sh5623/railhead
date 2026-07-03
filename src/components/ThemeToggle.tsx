import { cn } from '@/lib/cn';
import { useThemeStore } from '@/stores/theme';

/**
 * Dark-mode toggle — "Minimal" crescent switch (design C). A brand-azure knob
 * slides across a muted track; a "bite" carves it from a full disc (light / sun)
 * into a crescent (dark / moon). In dark mode the bite is a distinct azure shadow
 * tone (NOT the track color) so the moon reads as a full sphere — lit crescent +
 * shadowed body — clearly off the track. Wired to the Zustand theme store —
 * `RootLayout` applies the resulting `.dark` class to <html>.
 *
 * role="switch" + aria-checked; colors are design tokens only (no hard-coded hex);
 * 200ms transition with an instant `prefers-reduced-motion` fallback; the visual
 * size stays 62×32 while a pseudo-element gives a ≥44px hit target on coarse pointers.
 */
export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      onClick={toggle}
      className="relative h-8 w-[62px] cursor-pointer rounded-full border border-border bg-muted p-0 outline-none transition-colors duration-200 ease-out after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none pointer-fine:after:hidden"
    >
      {/* knob: brand disc → crescent (carved by the bite) */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1 left-1 size-6 overflow-hidden rounded-full bg-toggle-knob shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none',
          isDark ? 'translate-x-[30px]' : 'translate-x-0',
        )}
      >
        {/* bite: carves the crescent; dark mode uses a distinct azure shadow (not the track) */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute -top-1 left-[7px] size-6 rounded-full bg-toggle-knob-shadow transition-transform duration-200 ease-out motion-reduce:transition-none',
            isDark ? 'translate-x-0' : 'translate-x-[27px]',
          )}
        />
      </span>
    </button>
  );
}

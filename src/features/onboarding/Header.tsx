import { Route } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SECTION_CODES, SECTIONS } from '@/features/onboarding/content';

/**
 * Sticky top bar: wordmark on the left, the current station ("01 프로젝트 개관",
 * driven by scroll-spy) in the center, and the theme toggle on the right.
 */
export function Header({ active }: { active: string }) {
  const index = SECTIONS.findIndex((s) => s.id === active);
  const current = index >= 0 ? SECTIONS[index] : undefined;
  const code = index >= 0 ? (SECTION_CODES[index] ?? '') : '';

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
        <span className="flex shrink-0 items-center gap-2">
          <Route className="size-5 text-brand" aria-hidden="true" />
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            railhead
            <span className="hidden sm:inline">
              <span className="font-normal text-muted-foreground"> × </span>fe-rail
            </span>
          </span>
        </span>
        <span
          className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground"
          aria-hidden="true"
        >
          {current ? (
            <>
              <span className="font-semibold text-brand">{code}</span> {current.title}
            </>
          ) : null}
        </span>
        <span className="shrink-0">
          <ThemeToggle />
        </span>
      </div>
    </header>
  );
}

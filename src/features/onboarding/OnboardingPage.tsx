import { type MouseEvent, useCallback } from 'react';
import { HERO, SECTION_CODES, SECTIONS } from '@/features/onboarding/content';
import { Header } from '@/features/onboarding/Header';
import { RouteMapTrain, type TrainStop } from '@/features/onboarding/RouteMapTrain';
import { ScrollToTop } from '@/features/onboarding/ScrollToTop';
import { StationSection } from '@/features/onboarding/StationSection';
import { useRailProgress } from '@/features/onboarding/useRailProgress';
import { cn } from '@/lib/cn';

// Stable id list (useRailProgress depends on its reference identity).
const SECTION_IDS = SECTIONS.map((s) => s.id);
const STOPS: TrainStop[] = SECTIONS.map((s, i) => ({
  id: s.id,
  code: SECTION_CODES[i] ?? '',
  title: s.title,
}));
export function OnboardingPage() {
  const active = useRailProgress(SECTION_IDS);
  const activeId = SECTIONS[active]?.id ?? '';

  const jumpTo = useCallback((event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const target = SECTIONS[index];
    if (!target) return;
    event.preventDefault();
    const el = document.getElementById(target.id);
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${target.id}`);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-md outline-none focus-visible:fixed focus-visible:top-3 focus-visible:left-4 focus-visible:z-50 focus-visible:not-sr-only focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        본문으로 건너뛰기
      </a>
      <Header active={activeId} />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 outline-none sm:px-6">
        <div className="py-12 sm:py-16">
          <p className="text-sm font-medium text-brand">{HERO.kicker}</p>
          {/* Hero title: tonal ramp (ink → ink/brand mix → brand) driven by HERO.titleSegments. */}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {HERO.titleSegments.map((seg, i) => (
              <span
                key={seg.text}
                className={cn(
                  seg.tone === 'ink' && 'text-foreground',
                  seg.tone === 'mid' && 'text-brand-ink',
                  seg.tone === 'brand' && 'text-brand',
                )}
              >
                {i > 0 ? ' ' : ''}
                {seg.text}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            {HERO.lead}
          </p>
          <div className="mt-6 flex flex-col gap-4">
            {HERO.stackGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 font-mono text-xs font-medium text-brand-ink">{group.label}</p>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-brand/40 bg-brand/12 px-2 py-1 font-mono text-xs text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Route-map overview (train consist) — sticks under the header while scrolling. */}
        <div className="sticky top-14 z-10 -mx-4 border-y border-border bg-background px-4 sm:-mx-6 sm:px-6">
          <RouteMapTrain stops={STOPS} active={active} onJump={jumpTo} />
        </div>

        {/* Station list along a vertical spine. */}
        <div className="relative pb-16">
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[9px] w-px bg-border" />
          {SECTIONS.map((section, i) => (
            <StationSection
              key={section.id}
              section={section}
              code={SECTION_CODES[i] ?? ''}
              active={i === active}
            />
          ))}
          <div className="relative flex items-center gap-2 py-8 pl-7 text-sm text-muted-foreground">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-[9px] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-background"
            />
            종착역 · 온보딩 완료
          </div>
        </div>
      </main>
      <ScrollToTop />
    </>
  );
}

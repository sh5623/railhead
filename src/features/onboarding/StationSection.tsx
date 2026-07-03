import { Blocks } from '@/features/onboarding/Blocks';
import type { Section } from '@/features/onboarding/content';
import { cn } from '@/lib/cn';

/**
 * One station on the onboarding line: code + heading and its blocks, with a
 * spine node on the left rail. The active station (synced with scroll) tints
 * brand and lights its node. Every station is always expanded.
 */
export function StationSection({
  section,
  code,
  active,
}: {
  section: Section;
  code: string;
  active: boolean;
}) {
  return (
    <section
      id={section.id}
      className="relative scroll-mt-[300px] border-b border-border pl-7 last:border-b-0"
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-[1.7rem] left-[9px] size-3.5 -translate-x-1/2 rounded-full border-2 bg-background ring-4 ring-background transition-colors',
          active ? 'border-brand bg-brand' : 'border-border',
        )}
      />
      <div aria-current={active ? 'true' : undefined} className="flex items-center gap-2.5 py-5">
        <span
          className={cn(
            'shrink-0 font-mono text-xs font-semibold tracking-wider',
            active ? 'text-brand' : 'text-muted-foreground',
          )}
        >
          {code}
        </span>
        <h2
          className={cn(
            'text-lg font-semibold tracking-tight text-balance transition-colors sm:text-xl',
            active ? 'text-brand' : 'text-foreground',
          )}
        >
          {section.title}
        </h2>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{section.subtitle}</p>
      <Blocks blocks={section.blocks} />
      <div aria-hidden="true" className="h-8" />
    </section>
  );
}

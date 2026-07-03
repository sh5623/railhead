import type { MouseEvent } from 'react';
import { cn } from '@/lib/cn';

export type TrainStop = { id: string; code: string; title: string };

/**
 * Route-map as a train looping an oval track: each station is a compact train
 * car (windows · code · title · wheels) placed around an ellipse, so the whole
 * line fits the width with no horizontal scroll. Wide-but-short ellipse keeps
 * the sticky height modest while leaving enough arc between cars to avoid
 * overlap. The active car fills brand. Each car is an in-page anchor (`#id`) —
 * keyboard/URL-navigable; `onJump` adds smooth scroll + opens collapsed
 * sections. Car positions are a continuous function of index, so left/top % are
 * inline (not expressible as utilities).
 */
export function RouteMapTrain({
  stops,
  active,
  onJump,
}: {
  stops: TrainStop[];
  active: number;
  onJump: (event: MouseEvent<HTMLAnchorElement>, index: number) => void;
}) {
  const n = stops.length;
  return (
    <nav aria-label="노선도" className="relative mx-auto h-60 w-full max-w-2xl">
      {/* Oval track */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] inset-y-[14%] rounded-[50%] border-2 border-dashed border-border"
      />
      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          온보딩 라인
        </span>
      </div>
      {/* Train cars around the ellipse (00 at top, clockwise) */}
      {stops.map((stop, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + 33 * Math.cos(angle);
        const y = 50 + 41 * Math.sin(angle);
        const isActive = i === active;
        return (
          <a
            key={stop.id}
            href={`#${stop.id}`}
            onClick={(event) => onJump(event, i)}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`${stop.code} ${stop.title}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span
              className={cn(
                'relative flex w-16 flex-col items-center gap-0 rounded-lg border px-1.5 py-0.5 transition-colors',
                isActive
                  ? 'border-brand bg-brand shadow-sm'
                  : 'border-border bg-background hover:border-brand/50',
              )}
            >
              <span aria-hidden="true" className="flex w-full gap-0.5">
                {[0, 1, 2].map((w) => (
                  <span
                    key={w}
                    className={cn(
                      'h-1 flex-1 rounded-[2px]',
                      isActive ? 'bg-brand-foreground/80' : 'bg-brand/15',
                    )}
                  />
                ))}
              </span>
              <span
                className={cn(
                  'font-mono text-[9px] font-semibold tracking-wider',
                  isActive ? 'text-brand-foreground/85' : 'text-muted-foreground',
                )}
              >
                {stop.code}
              </span>
              <span
                className={cn(
                  'text-center text-[9px] leading-tight font-semibold break-keep',
                  isActive ? 'text-brand-foreground' : 'text-foreground',
                )}
              >
                {stop.title}
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 flex w-full justify-center gap-3"
              >
                <span
                  className={cn(
                    'size-1 rounded-full border border-background',
                    isActive ? 'bg-brand-ink' : 'bg-muted-foreground',
                  )}
                />
                <span
                  className={cn(
                    'size-1 rounded-full border border-background',
                    isActive ? 'bg-brand-ink' : 'bg-muted-foreground',
                  )}
                />
              </span>
            </span>
          </a>
        );
      })}
    </nav>
  );
}

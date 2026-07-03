import { cva } from 'class-variance-authority';
import { Ban, Check, Info, Lightbulb, type LucideIcon, TriangleAlert } from 'lucide-react';
import type { Tone } from '@/features/onboarding/content';
import { renderInline } from '@/features/onboarding/richText';
import { cn } from '@/lib/cn';

const calloutVariants = cva('flex gap-3 rounded-lg border p-3.5 text-sm', {
  variants: {
    tone: {
      do: 'border-success/30 bg-success/10',
      dont: 'border-destructive/30 bg-destructive/10',
      warn: 'border-warning/40 bg-warning/10',
      tip: 'border-brand/30 bg-brand/[0.07]',
      info: 'border-border bg-muted/50',
    } satisfies Record<Tone, string>,
  },
  defaultVariants: { tone: 'info' },
});

const TONE_ICON: Record<Tone, LucideIcon> = {
  do: Check,
  dont: Ban,
  warn: TriangleAlert,
  tip: Lightbulb,
  info: Info,
};

const TONE_TEXT: Record<Tone, string> = {
  do: 'text-success',
  dont: 'text-destructive',
  warn: 'text-warning',
  tip: 'text-brand',
  info: 'text-muted-foreground',
};

export function Callout({
  tone = 'info',
  title,
  body,
}: {
  tone?: Tone;
  title?: string | undefined;
  body: string;
}) {
  const Icon = TONE_ICON[tone];
  return (
    <aside className={cn(calloutVariants({ tone }))}>
      <Icon className={cn('mt-0.5 size-[1.05rem] shrink-0', TONE_TEXT[tone])} aria-hidden="true" />
      <div className="min-w-0 space-y-1">
        {title ? <p className="font-semibold text-foreground">{title}</p> : null}
        {body.split('\n').map((para) => (
          <p key={para} className="leading-relaxed text-foreground/90">
            {renderInline(para)}
          </p>
        ))}
      </div>
    </aside>
  );
}

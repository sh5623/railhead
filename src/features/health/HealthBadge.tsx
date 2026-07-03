import { useHealth } from '@/features/health/api';
import { cn } from '@/lib/cn';

/**
 * Tiny backend-connectivity indicator — the rendered half of the canonical
 * data pattern (`useHealth` → guard `isPending`/`isError` → UI). It also gives
 * the E2E suite a real network-dependent target: `e2e/health.spec.ts` mocks
 * `/health` with `page.route()` to drive each state below.
 *
 * With no backend wired up (the template default) the request fails and this
 * shows "미연결" with a destructive dot — an expected state for the template,
 * not an actual error.
 */
export function HealthBadge() {
  const { isPending, isError } = useHealth();
  const state = isPending ? 'pending' : isError ? 'error' : 'ok';

  const label =
    state === 'pending' ? '연결 확인 중…' : state === 'error' ? '백엔드 미연결' : '백엔드 정상';

  return (
    <span
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 text-xs text-muted-foreground"
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          state === 'pending' && 'animate-pulse bg-muted-foreground/50 motion-reduce:animate-none',
          state === 'error' && 'bg-destructive',
          state === 'ok' && 'bg-success',
        )}
      />
      {label}
    </span>
  );
}

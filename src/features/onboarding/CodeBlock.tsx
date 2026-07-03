import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

/** Copy-to-clipboard control for a code sample. Gives inline feedback and fails
 *  gracefully where the Clipboard API is unavailable (insecure context). */
function CopyButton({ code }: { code: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const t = setTimeout(() => setStatus('idle'), 1500);
    return () => clearTimeout(t);
  }, [status]);

  const onCopy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  };

  const label = status === 'copied' ? '복사됨' : status === 'error' ? '복사 실패' : '코드 복사';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={onCopy}
      aria-label={label}
      title={label}
      className={cn(
        'text-muted-foreground hover:text-foreground',
        status === 'copied' && 'text-success hover:text-success',
        status === 'error' && 'text-destructive hover:text-destructive',
      )}
    >
      {status === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    </Button>
  );
}

/** Code sample with a file/label caption, a copy button, and a horizontally scrollable body. */
export function CodeBlock({
  file,
  lang,
  code,
}: {
  file?: string | undefined;
  lang: string;
  code: string;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border bg-muted/40">
      <figcaption className="flex items-center justify-between gap-3 border-b bg-card py-1 pr-1.5 pl-3">
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          {file}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="rounded border px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
            {lang}
          </span>
          <CopyButton code={code} />
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-3.5 text-xs leading-relaxed">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </figure>
  );
}

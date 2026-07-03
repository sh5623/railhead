import { Fragment, type ReactNode } from 'react';

/**
 * Render inline `code`, **bold**, and [text](href) link markers in content
 * strings as React nodes. Plain text passes through React's escaping, so this
 * never injects raw HTML. Links: in-page `#anchor` stay internal; external
 * `http(s)` links get `target="_blank"` + `rel="noopener noreferrer"`.
 */
const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export function renderInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  INLINE.lastIndex = 0; // defensive: g-flag regex reused across calls

  for (let m = INLINE.exec(text); m !== null; m = INLINE.exec(text)) {
    const full = m[0] ?? '';
    if (m.index > last) {
      nodes.push(<Fragment key={`t${last}`}>{text.slice(last, m.index)}</Fragment>);
    }
    if (m[1] !== undefined) {
      nodes.push(
        <code
          key={`c${m.index}`}
          className="break-words rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {m[1]}
        </code>,
      );
    } else if (m[2] !== undefined) {
      nodes.push(
        <strong key={`b${m.index}`} className="font-semibold text-foreground">
          {m[2]}
        </strong>,
      );
    } else if (m[3] !== undefined && m[4] !== undefined) {
      const href = m[4];
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a
          key={`l${m.index}`}
          href={href}
          className="rounded-sm font-medium text-brand underline decoration-brand/40 underline-offset-2 outline-none hover:decoration-brand focus-visible:ring-2 focus-visible:ring-ring/50"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {m[3]}
        </a>,
      );
    }
    last = m.index + full.length;
  }

  if (last < text.length) {
    nodes.push(<Fragment key={`t${last}`}>{text.slice(last)}</Fragment>);
  }
  return nodes;
}

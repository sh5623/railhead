import { Callout } from '@/features/onboarding/Callout';
import { CodeBlock } from '@/features/onboarding/CodeBlock';
import type { Block } from '@/features/onboarding/content';
import { DataTable } from '@/features/onboarding/DataTable';
import { renderInline } from '@/features/onboarding/richText';

/** Stable, content-derived key (noArrayIndexKey forbids index keys). */
function blockKey(block: Block): string {
  switch (block.kind) {
    case 'prose':
      return `prose:${block.text.slice(0, 40)}`;
    case 'subheading':
      return `sub:${block.text}`;
    case 'bullets':
      return `bul:${block.items[0] ?? ''}`;
    case 'steps':
      return `step:${block.items[0] ?? ''}`;
    case 'callout':
      return `call:${block.title ?? block.body.slice(0, 40)}`;
    case 'code':
      return `code:${block.file ?? block.lang}`;
    case 'table':
      return `table:${block.headers.join('|')}`;
  }
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'prose':
      return (
        <p className="text-sm leading-relaxed text-muted-foreground">{renderInline(block.text)}</p>
      );
    case 'subheading':
      return (
        <h3 className="pt-2 text-base font-semibold tracking-tight text-foreground">
          {block.text}
        </h3>
      );
    case 'bullets':
      return (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-4 leading-relaxed before:absolute before:top-[0.55rem] before:left-0 before:size-1.5 before:rounded-full before:bg-brand/70"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol className="space-y-2.5 text-sm text-muted-foreground">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-medium text-brand"
              >
                {i + 1}
              </span>
              <span className="leading-relaxed">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
    case 'callout':
      return <Callout tone={block.tone} title={block.title} body={block.body} />;
    case 'code':
      return <CodeBlock file={block.file} lang={block.lang} code={block.code} />;
    case 'table':
      return <DataTable headers={block.headers} rows={block.rows} />;
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <BlockView key={blockKey(block)} block={block} />
      ))}
    </div>
  );
}

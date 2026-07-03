import { renderInline } from '@/features/onboarding/richText';
import { cn } from '@/lib/cn';

/** Responsive data table: scrolls horizontally on narrow viewports. */
export function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="border-b bg-brand/[0.06] text-left">
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2 font-medium text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')} className="border-b align-top last:border-0">
              {headers.map((h, ci) => (
                <td
                  key={h}
                  className={cn(
                    'px-3 py-2',
                    ci === 0 ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {renderInline(row[ci] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

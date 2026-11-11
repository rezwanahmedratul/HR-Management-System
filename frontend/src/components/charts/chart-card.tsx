'use client';

import * as React from 'react';
import { Maximize2, Download, Table as TableIcon, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog } from '@/components/ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { exportToCsv } from '@/lib/export';
import { cn } from '@/lib/utils';

export interface ChartCardProps {
  title: string;
  loading?: boolean;
  data?: Record<string, any>[];
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
  minHeight?: number;
}

export function ChartCard({
  title,
  loading = false,
  data = [],
  ariaLabel,
  children,
  className,
  minHeight = 280,
}: ChartCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [viewTable, setViewTable] = React.useState(false);

  const handleExport = () => {
    if (data && data.length > 0) {
      exportToCsv(data, title.toLowerCase().replace(/\s+/g, '-'));
    }
  };

  const isEmpty = !loading && data && data.length === 0;

  return (
    <>
      <div
        className={cn(
          'flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xs transition-shadow duration-200 hover:shadow-xs',
          className,
        )}
        aria-label={ariaLabel}
      >
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold tracking-tight text-[var(--foreground)] truncate">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <Tooltip content="Export">
              <button
                onClick={handleExport}
                disabled={isEmpty || loading}
                className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Export CSV"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
            <Tooltip content="Expand">
              <button
                onClick={() => setExpanded(true)}
                disabled={isEmpty || loading}
                className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Expand"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 w-full" style={{ minHeight }}>
          {loading ? (
            <Skeleton className="w-full h-full min-h-[240px] rounded-lg" />
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[240px] text-[var(--muted-foreground)]">
              <BarChart3 className="w-8 h-8 opacity-40 mb-1" />
              <span className="text-xs uppercase tracking-wider font-medium">Empty</span>
            </div>
          ) : (
            children
          )}
        </div>
      </div>

      {/* Expanded View Dialog */}
      <Dialog
        open={expanded}
        onOpenChange={(open) => {
          setExpanded(open);
          if (!open) setViewTable(false);
        }}
        title={title}
        className="max-w-4xl max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg p-0.5 bg-[var(--muted)]/50">
            <button
              onClick={() => setViewTable(false)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                !viewTable
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-2xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
              )}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Chart
            </button>
            <button
              onClick={() => setViewTable(true)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                viewTable
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-2xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
              )}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Data
            </button>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>

        <div className="flex-1 overflow-auto min-h-[380px] pt-2">
          {viewTable ? (
            <div className="max-h-[500px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {data && data.length > 0 &&
                      Object.keys(data[0]).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    data.map((row, i) => (
                      <TableRow key={i}>
                        {Object.values(row).map((val, j) => (
                          <TableCell key={j}>
                            {typeof val === 'object' && val !== null
                              ? JSON.stringify(val)
                              : String(val ?? '—')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="w-full h-[450px]">{children}</div>
          )}
        </div>
      </Dialog>
    </>
  );
}

'use client';

import * as React from 'react';

// Progressive clean shades of dark/gray
export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-3)',
  'var(--chart-5)',
  'var(--chart-2)',
  'var(--chart-4)',
  'var(--chart-6)',
  'var(--chart-7)',
];

export const DARK_SHADES = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-3)',
  tertiary: 'var(--chart-5)',
  quaternary: 'var(--chart-6)',
  muted: 'var(--chart-7)',
};

export function ChartPatterns() {
  return null;
}

export function CustomTooltipContent({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (val: any) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2.5 shadow-md text-xs">
      {label && (
        <p className="font-semibold text-[var(--foreground)] mb-1 pb-1 border-b border-[var(--border)]">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-xs border border-[var(--border)] inline-block"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name || 'Value'}:
            </span>
            <span className="font-medium text-[var(--foreground)]">
              {formatter ? formatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

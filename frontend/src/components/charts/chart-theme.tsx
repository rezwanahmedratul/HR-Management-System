'use client';

import * as React from 'react';

export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
];

export const PATTERN_IDS = {
  diagonalHatch: 'pattern-diagonal-hatch',
  dots: 'pattern-dots',
  horizontalStripes: 'pattern-horizontal-stripes',
  crossHatch: 'pattern-cross-hatch',
  verticalStripes: 'pattern-vertical-stripes',
  denseDots: 'pattern-dense-dots',
};

export function ChartPatterns() {
  return (
    <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
      <defs>
        {/* Diagonal Hatch */}
        <pattern
          id={PATTERN_IDS.diagonalHatch}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="8" height="8" fill="var(--chart-5)" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="var(--chart-1)"
            strokeWidth="2.5"
          />
        </pattern>

        {/* Dots */}
        <pattern
          id={PATTERN_IDS.dots}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="var(--chart-6)" />
          <circle cx="4" cy="4" r="1.75" fill="var(--chart-2)" />
        </pattern>

        {/* Horizontal Stripes */}
        <pattern
          id={PATTERN_IDS.horizontalStripes}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="var(--chart-5)" />
          <line
            x1="0"
            y1="4"
            x2="8"
            y2="4"
            stroke="var(--chart-2)"
            strokeWidth="2.5"
          />
        </pattern>

        {/* Cross Hatch */}
        <pattern
          id={PATTERN_IDS.crossHatch}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="8" fill="var(--chart-6)" />
          <line
            x1="0"
            y1="4"
            x2="8"
            y2="4"
            stroke="var(--chart-3)"
            strokeWidth="1.5"
          />
          <line
            x1="4"
            y1="0"
            x2="4"
            y2="8"
            stroke="var(--chart-3)"
            strokeWidth="1.5"
          />
        </pattern>

        {/* Vertical Stripes */}
        <pattern
          id={PATTERN_IDS.verticalStripes}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="6" fill="var(--chart-5)" />
          <line
            x1="3"
            y1="0"
            x2="3"
            y2="6"
            stroke="var(--chart-1)"
            strokeWidth="1.5"
          />
        </pattern>

        {/* Dense Dots */}
        <pattern
          id={PATTERN_IDS.denseDots}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect width="5" height="5" fill="var(--chart-6)" />
          <circle cx="2.5" cy="2.5" r="1" fill="var(--chart-1)" />
        </pattern>
      </defs>
    </svg>
  );
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

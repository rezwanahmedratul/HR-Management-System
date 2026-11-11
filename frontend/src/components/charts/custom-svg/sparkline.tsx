'use client';

import * as React from 'react';

export interface SparklineProps {
  data: number[];
  width?: number | string;
  height?: number;
  className?: string;
}

export function Sparkline({
  data,
  width = '100%',
  height = 36,
  className = '',
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ height }} className="w-full bg-[var(--muted)]/30 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const svgWidth = 120;
  const svgHeight = height;
  const padding = 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((val - min) / range) * (svgHeight - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${svgWidth - padding},${svgHeight} L ${padding},${svgHeight} Z`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
        style={{ height }}
      >
        <path
          d={areaD}
          fill="var(--chart-4)"
          fillOpacity="0.2"
        />
        <path
          d={pathD}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

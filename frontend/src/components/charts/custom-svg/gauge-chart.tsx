'use client';

import * as React from 'react';

export interface GaugeChartProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

export function GaugeChart({
  value,
  size = 220,
  strokeWidth = 18,
}: GaugeChartProps) {
  const clampedValue = Math.min(100, Math.max(0, value || 0));
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // 240 degree gauge arc (-210 to 30 deg)
  const startAngle = 150;
  const endAngle = 390;
  const totalAngle = endAngle - startAngle; // 240 deg

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const backgroundArc = describeArc(center, center, radius, startAngle, endAngle);
  const currentAngle = startAngle + (clampedValue / 100) * totalAngle;
  const progressArc = describeArc(center, center, radius, startAngle, Math.max(startAngle + 0.1, currentAngle));

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          {/* Background track */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active progress */}
          <path
            d={progressArc}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {clampedValue.toFixed(1)}%
          </span>
          <span className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)] font-medium mt-0.5">
            Rate
          </span>
        </div>
      </div>
    </div>
  );
}

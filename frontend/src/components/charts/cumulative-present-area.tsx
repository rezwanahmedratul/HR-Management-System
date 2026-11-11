'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyTrend } from '@/types';
import { PATTERN_IDS } from './chart-theme';

export function CumulativePresentArea({ data }: { data: DailyTrend[] }) {
  if (!data || data.length === 0) return null;

  let runningTotal = 0;
  const cumulativeData = data.map((d) => {
    runningTotal += d.present;
    return {
      date: d.date,
      cumulativePresent: runningTotal,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={cumulativeData}
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.4}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(d: string) => d.slice(5)}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <Tooltip
          formatter={(value: any) => [`${value} days`, 'Cumulative Present']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Area
          type="monotone"
          dataKey="cumulativePresent"
          stroke="var(--foreground)"
          strokeWidth={2}
          fill={`url(#${PATTERN_IDS.diagonalHatch})`}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { BonusRatio } from '@/types';

export function BonusRatioBar({ data }: { data: BonusRatio[] }) {
  if (!data || data.length === 0) return null;

  const subset = data.slice(0, 15);
  const avgRatio =
    data.reduce((acc, curr) => acc + curr.bonusRatio, 0) / (data.length || 1);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={subset}
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.4}
          vertical={false}
        />
        <XAxis
          dataKey="employeeName"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }}
          tickFormatter={(name: string) => (name.length > 7 ? `${name.slice(0, 6)}…` : name)}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(val) => `${val}%`}
        />
        <Tooltip
          formatter={(value: any) => [`${value}%`, 'Bonus Ratio']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <ReferenceLine
          y={Math.round(avgRatio * 10) / 10}
          stroke="var(--foreground)"
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
        <Bar
          dataKey="bonusRatio"
          fill="var(--chart-2)"
          radius={[4, 4, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

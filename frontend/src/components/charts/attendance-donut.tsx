'use client';

import * as React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatusDistribution } from '@/types';
import { PATTERN_IDS } from './chart-theme';

export function AttendanceDonut({ data }: { data: StatusDistribution[] }) {
  if (!data || data.length === 0) return null;

  const patterns = [
    `url(#${PATTERN_IDS.diagonalHatch})`,
    `url(#${PATTERN_IDS.dots})`,
    `url(#${PATTERN_IDS.horizontalStripes})`,
  ];
  const strokes = ['var(--chart-1)', 'var(--chart-3)', 'var(--chart-5)'];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={3}
          stroke="var(--border)"
          strokeWidth={1}
          animationDuration={800}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={patterns[index % patterns.length]}
              stroke={strokes[index % strokes.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [`${value} logs`, 'Count']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="rect"
          formatter={(val: string) => (
            <span style={{ color: 'var(--foreground)', fontSize: '11px' }}>
              {val}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

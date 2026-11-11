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

export function AttendanceDonut({ data }: { data: StatusDistribution[] }) {
  if (!data || data.length === 0) return null;

  const shades = ['var(--chart-1)', 'var(--chart-4)', 'var(--chart-6)'];

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
          stroke="var(--card)"
          strokeWidth={2}
          animationDuration={800}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={shades[index % shades.length]}
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
          iconType="circle"
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

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
import { HeadcountByDepartment } from '@/types';
import { CHART_COLORS } from './chart-theme';

export function HeadcountPie({ data }: { data: HeadcountByDepartment[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="headcount"
          nameKey="departmentName"
          cx="50%"
          cy="50%"
          outerRadius={80}
          stroke="var(--card)"
          strokeWidth={2}
          animationDuration={800}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [`${value} employees`, 'Share']}
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
          height={32}
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

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
import { PATTERN_IDS } from './chart-theme';

export function HeadcountPie({ data }: { data: HeadcountByDepartment[] }) {
  if (!data || data.length === 0) return null;

  const patterns = [
    `url(#${PATTERN_IDS.diagonalHatch})`,
    `url(#${PATTERN_IDS.dots})`,
    `url(#${PATTERN_IDS.horizontalStripes})`,
    `url(#${PATTERN_IDS.crossHatch})`,
    `url(#${PATTERN_IDS.verticalStripes})`,
    `url(#${PATTERN_IDS.denseDots})`,
  ];

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
          stroke="var(--border)"
          strokeWidth={1}
          animationDuration={800}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={patterns[index % patterns.length]}
              stroke="var(--chart-2)"
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

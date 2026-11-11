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
} from 'recharts';
import { TopEarner } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function TopEarnersBar({ data }: { data: TopEarner[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.4}
          horizontal={false}
        />
        <XAxis
          type="number"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(val) => `$${val / 1000}k`}
        />
        <YAxis
          dataKey="employeeName"
          type="category"
          stroke="transparent"
          width={90}
          tick={{ fill: 'var(--foreground)', fontSize: 11 }}
        />
        <Tooltip
          formatter={(value: any) => [formatCurrency(Number(value)), 'Compensation']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey="totalCompensation"
          fill="var(--chart-1)"
          radius={[0, 4, 4, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

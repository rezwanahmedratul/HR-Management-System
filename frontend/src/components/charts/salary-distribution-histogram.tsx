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
import { SalaryDistribution } from '@/types';

export function SalaryDistributionHistogram({
  data,
}: {
  data: SalaryDistribution[];
}) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.4}
          vertical={false}
        />
        <XAxis
          dataKey="bin"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <Tooltip
          formatter={(value: any) => [`${value} employees`, 'Frequency']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey="count"
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

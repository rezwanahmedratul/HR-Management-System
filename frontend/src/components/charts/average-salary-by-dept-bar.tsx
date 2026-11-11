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
import { PayrollByDepartment } from '@/types';
import { PATTERN_IDS } from './chart-theme';
import { formatCurrency } from '@/lib/utils';

export function AverageSalaryByDeptBar({
  data,
}: {
  data: PayrollByDepartment[];
}) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.4}
          vertical={false}
        />
        <XAxis
          dataKey="departmentName"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          tickFormatter={(val) => `$${val / 1000}k`}
        />
        <Tooltip
          formatter={(value: any) => [formatCurrency(Number(value)), 'Average']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey="averageSalary"
          fill={`url(#${PATTERN_IDS.verticalStripes})`}
          stroke="var(--chart-1)"
          strokeWidth={1}
          radius={[4, 4, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

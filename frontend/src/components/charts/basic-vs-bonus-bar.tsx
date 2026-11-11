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
  Legend,
} from 'recharts';
import { SalaryVsBonus } from '@/types';
import { PATTERN_IDS } from './chart-theme';
import { formatCurrency } from '@/lib/utils';

export function BasicVsBonusBar({ data }: { data: SalaryVsBonus[] }) {
  if (!data || data.length === 0) return null;

  // Show first 15 employees for readability
  const subset = data.slice(0, 15);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={subset}
        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
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
          tickFormatter={(name: string) => (name.length > 8 ? `${name.slice(0, 7)}…` : name)}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          tickFormatter={(val) => `$${val / 1000}k`}
        />
        <Tooltip
          formatter={(value: any, name: any) => [
            formatCurrency(Number(value)),
            name === 'basicSalary' ? 'Basic' : 'Bonus',
          ]}
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
              {val === 'basicSalary' ? 'Basic Salary' : 'Bonus'}
            </span>
          )}
        />
        <Bar
          dataKey="basicSalary"
          fill="var(--chart-2)"
          stroke="var(--chart-1)"
          strokeWidth={1}
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="bonus"
          fill={`url(#${PATTERN_IDS.dots})`}
          stroke="var(--chart-3)"
          strokeWidth={1}
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

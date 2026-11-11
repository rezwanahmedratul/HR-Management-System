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
import { SalaryRangeByDepartment } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function SalaryRangeBar({
  data,
}: {
  data: SalaryRangeByDepartment[];
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
          formatter={(value: any, name: any) => [
            formatCurrency(Number(value)),
            name === 'minSalary' ? 'Min' : name === 'avgSalary' ? 'Avg' : 'Max',
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
          iconType="circle"
          formatter={(val: string) => (
            <span style={{ color: 'var(--foreground)', fontSize: '11px' }}>
              {val === 'minSalary' ? 'Min' : val === 'avgSalary' ? 'Avg' : 'Max'}
            </span>
          )}
        />
        <Bar
          dataKey="minSalary"
          fill="var(--chart-6)"
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="avgSalary"
          fill="var(--chart-3)"
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="maxSalary"
          fill="var(--chart-1)"
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

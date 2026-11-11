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
import { PayrollByDepartment } from '@/types';
import { CHART_COLORS } from './chart-theme';
import { formatCurrency } from '@/lib/utils';

export function PayrollShareDonut({ data }: { data: PayrollByDepartment[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalPayroll"
          nameKey="departmentName"
          cx="50%"
          cy="50%"
          innerRadius={55}
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
          formatter={(value: any) => [formatCurrency(Number(value)), 'Payroll']}
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

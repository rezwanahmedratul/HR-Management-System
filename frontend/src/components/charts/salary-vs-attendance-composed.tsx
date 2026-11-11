'use client';

import * as React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DepartmentScorecard } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function SalaryVsAttendanceComposed({
  data,
}: {
  data: DepartmentScorecard[];
}) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
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
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <YAxis
          yAxisId="left"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(val) => `$${val / 1000}k`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="transparent"
          domain={[0, 100]}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(val) => `${val}%`}
        />
        <Tooltip
          formatter={(value: any, name: any) => [
            name === 'avgSalary'
              ? formatCurrency(Number(value))
              : `${value}%`,
            name === 'avgSalary' ? 'Avg Salary' : 'Attendance Rate',
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
              {val === 'avgSalary' ? 'Avg Salary' : 'Attendance Rate'}
            </span>
          )}
        />
        <Bar
          yAxisId="left"
          dataKey="avgSalary"
          fill="var(--chart-2)"
          radius={[4, 4, 0, 0]}
          animationDuration={800}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="attendanceRate"
          stroke="var(--foreground)"
          strokeWidth={2}
          dot={{ fill: 'var(--foreground)', r: 3 }}
          animationDuration={800}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

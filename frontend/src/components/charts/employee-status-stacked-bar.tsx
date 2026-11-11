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
import { AttendanceByEmployee } from '@/types';

export function EmployeeStatusStackedBar({
  data,
}: {
  data: AttendanceByEmployee[];
}) {
  if (!data || data.length === 0) return null;

  const subset = data.slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={subset}
        layout="vertical"
        margin={{ top: 5, right: 10, left: 30, bottom: 5 }}
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
        />
        <YAxis
          dataKey="employeeName"
          type="category"
          stroke="transparent"
          width={80}
          tick={{ fill: 'var(--foreground)', fontSize: 10 }}
        />
        <Tooltip
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
            <span style={{ color: 'var(--foreground)', fontSize: '11px', textTransform: 'capitalize' }}>
              {val}
            </span>
          )}
        />
        <Bar
          dataKey="present"
          stackId="a"
          fill="var(--chart-1)"
          animationDuration={800}
        />
        <Bar
          dataKey="leave"
          stackId="a"
          fill="var(--chart-4)"
          animationDuration={800}
        />
        <Bar
          dataKey="absent"
          stackId="a"
          fill="var(--chart-6)"
          radius={[0, 4, 4, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

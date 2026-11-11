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
import { HeadcountByDepartment } from '@/types';

export function HeadcountHorizontalBar({
  data,
}: {
  data: HeadcountByDepartment[];
}) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
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
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <YAxis
          dataKey="departmentName"
          type="category"
          stroke="transparent"
          width={85}
          tick={{ fill: 'var(--foreground)', fontSize: 11 }}
        />
        <Tooltip
          formatter={(value: any) => [`${value} employees`, 'Headcount']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey="headcount"
          fill="var(--chart-1)"
          radius={[0, 4, 4, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

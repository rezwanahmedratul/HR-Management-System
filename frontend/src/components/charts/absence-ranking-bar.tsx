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
import { AttendanceByEmployee } from '@/types';

export function AbsenceRankingBar({
  data,
}: {
  data: AttendanceByEmployee[];
}) {
  if (!data || data.length === 0) return null;

  const sorted = [...data]
    .sort((a, b) => b.absent - a.absent)
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 5, right: 15, left: 30, bottom: 5 }}
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
          formatter={(value: any) => [`${value} days`, 'Absences']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey="absent"
          fill="var(--chart-1)"
          radius={[0, 4, 4, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyTrend } from '@/types';

export function AttendanceRateLine({ data }: { data: DailyTrend[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
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
          dataKey="date"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(d: string) => d.slice(5)}
        />
        <YAxis
          stroke="transparent"
          domain={[0, 100]}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(val) => `${val}%`}
        />
        <Tooltip
          formatter={(value: any) => [`${value}%`, 'Present Rate']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Line
          type="monotone"
          dataKey="attendanceRate"
          stroke="var(--foreground)"
          strokeWidth={2}
          dot={{ fill: 'var(--foreground)', r: 2.5 }}
          activeDot={{ r: 5 }}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

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
import { AttendanceByWeekday } from '@/types';

export function WeekdayAttendanceBar({
  data,
}: {
  data: AttendanceByWeekday[];
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
          dataKey="weekdayName"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
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
          fill="var(--chart-1)"
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="leave"
          fill="var(--chart-4)"
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="absent"
          fill="var(--chart-6)"
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

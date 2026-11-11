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
import { AttendanceByDepartment } from '@/types';

export function LeaveVsAbsentBar({
  data,
}: {
  data: AttendanceByDepartment[];
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
          dataKey="departmentName"
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
            <span style={{ color: 'var(--foreground)', fontSize: '11px' }}>
              {val === 'leaveCount' ? 'Leave' : 'Absent'}
            </span>
          )}
        />
        <Bar
          dataKey="leaveCount"
          fill="var(--chart-2)"
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="absentCount"
          fill="var(--chart-5)"
          radius={[3, 3, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

'use client';

import * as React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { AttendanceByDepartment } from '@/types';
import { CHART_COLORS } from './chart-theme';

export function DepartmentRadialBar({
  data,
}: {
  data: AttendanceByDepartment[];
}) {
  if (!data || data.length === 0) return null;

  const formatted = data.map((d, i) => ({
    name: d.departmentName,
    rate: d.attendanceRate,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="25%"
        outerRadius="90%"
        barSize={10}
        data={formatted}
      >
        <RadialBar
          background={{ fill: 'var(--muted)' }}
          dataKey="rate"
          cornerRadius={4}
          animationDuration={800}
        />
        <Tooltip
          formatter={(value: any) => [`${value}%`, 'Attendance Rate']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Legend
          iconSize={8}
          layout="horizontal"
          verticalAlign="bottom"
          height={32}
          formatter={(val: string) => (
            <span style={{ color: 'var(--foreground)', fontSize: '10px' }}>
              {val}
            </span>
          )}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

'use client';

import * as React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { DepartmentScorecard } from '@/types';
import { CHART_COLORS } from './chart-theme';

export function DepartmentScorecardRadar({
  data,
}: {
  data: DepartmentScorecard[];
}) {
  if (!data || data.length === 0) return null;

  const metrics = [
    { metric: 'Headcount', key: 'normalizedHeadcount' },
    { metric: 'Avg Salary', key: 'normalizedAvgSalary' },
    { metric: 'Avg Bonus', key: 'normalizedAvgBonus' },
    { metric: 'Attendance', key: 'normalizedAttendanceRate' },
  ];

  const radarData = metrics.map((m) => {
    const row: Record<string, any> = { metric: m.metric };
    data.slice(0, 4).forEach((dept) => {
      row[dept.departmentName] = (dept as any)[m.key];
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={radarData} outerRadius={80}>
        <PolarGrid stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: 'var(--foreground)', fontSize: 10 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }}
        />
        {data.slice(0, 4).map((dept, index) => {
          const color = CHART_COLORS[index % CHART_COLORS.length];
          return (
            <Radar
              key={dept.departmentName}
              name={dept.departmentName}
              dataKey={dept.departmentName}
              stroke={color}
              strokeWidth={1.5}
              fill={color}
              fillOpacity={0.25}
              animationDuration={800}
            />
          );
        })}
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
              {val}
            </span>
          )}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DailyTrend } from '@/types';

export function DailyTrendStackedArea({ data }: { data: DailyTrend[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
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
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
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
        <Area
          type="monotone"
          dataKey="present"
          stackId="1"
          stroke="var(--chart-1)"
          fill="var(--chart-1)"
          fillOpacity={0.8}
          animationDuration={800}
        />
        <Area
          type="monotone"
          dataKey="leave"
          stackId="1"
          stroke="var(--chart-3)"
          fill="var(--chart-3)"
          fillOpacity={0.7}
          animationDuration={800}
        />
        <Area
          type="monotone"
          dataKey="absent"
          stackId="1"
          stroke="var(--chart-5)"
          fill="var(--chart-5)"
          fillOpacity={0.6}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

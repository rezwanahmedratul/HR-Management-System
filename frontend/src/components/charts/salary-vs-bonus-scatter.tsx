'use client';

import * as React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { SalaryVsBonus } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function SalaryVsBonusScatter({ data }: { data: SalaryVsBonus[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.4}
        />
        <XAxis
          type="number"
          dataKey="basicSalary"
          name="Basic Salary"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(val) => `$${val / 1000}k`}
        />
        <YAxis
          type="number"
          dataKey="bonus"
          name="Bonus"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(val) => `$${val / 1000}k`}
        />
        <ZAxis range={[50, 50]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const item = payload[0].payload as SalaryVsBonus;
            return (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 text-xs shadow-md">
                <p className="font-semibold text-[var(--foreground)]">{item.employeeName}</p>
                <p className="text-[var(--muted-foreground)]">{item.departmentName}</p>
                <div className="mt-1 pt-1 border-t border-[var(--border)]">
                  <p>Basic: {formatCurrency(item.basicSalary)}</p>
                  <p>Bonus: {formatCurrency(item.bonus)}</p>
                </div>
              </div>
            );
          }}
        />
        <Scatter
          name="Employees"
          data={data}
          fill="var(--chart-1)"
          stroke="var(--chart-3)"
          strokeWidth={1.5}
          animationDuration={800}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

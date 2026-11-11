'use client';

import * as React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { PayrollByDepartment } from '@/types';
import { CHART_COLORS } from './chart-theme';
import { formatCurrency } from '@/lib/utils';

function CustomizedPayrollTreemapContent(props: any) {
  const { x, y, width, height, index, departmentName, totalPayroll } = props;

  if (width < 30 || height < 20) return null;

  const fill = CHART_COLORS[index % CHART_COLORS.length];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="var(--card)"
        strokeWidth={2}
        rx={4}
      />
      {width > 60 && height > 35 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 2}
            textAnchor="middle"
            fill="var(--background)"
            fontSize={11}
            fontWeight={600}
            className="select-none"
          >
            {departmentName}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 13}
            textAnchor="middle"
            fill="var(--background)"
            fillOpacity={0.8}
            fontSize={10}
            className="select-none"
          >
            {formatCurrency(totalPayroll)}
          </text>
        </>
      )}
    </g>
  );
}

export function PayrollTreemap({ data }: { data: PayrollByDepartment[] }) {
  if (!data || data.length === 0) return null;

  const formatted = data.map((d) => ({
    name: d.departmentName,
    departmentName: d.departmentName,
    size: d.totalPayroll,
    totalPayroll: d.totalPayroll,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <Treemap
        data={formatted}
        dataKey="size"
        stroke="var(--border)"
        content={<CustomizedPayrollTreemapContent />}
        animationDuration={800}
      >
        <Tooltip
          formatter={(value: any, _: any, item: any) => [
            formatCurrency(item.payload.totalPayroll),
            item.payload.departmentName,
          ]}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}

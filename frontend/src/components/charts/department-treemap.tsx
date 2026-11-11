'use client';

import * as React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { HeadcountByDepartment } from '@/types';
import { PATTERN_IDS } from './chart-theme';

const patterns = [
  `url(#${PATTERN_IDS.diagonalHatch})`,
  `url(#${PATTERN_IDS.dots})`,
  `url(#${PATTERN_IDS.horizontalStripes})`,
  `url(#${PATTERN_IDS.crossHatch})`,
  `url(#${PATTERN_IDS.verticalStripes})`,
  `url(#${PATTERN_IDS.denseDots})`,
];

function CustomizedTreemapContent(props: any) {
  const { x, y, width, height, index, departmentName, headcount } = props;

  if (width < 30 || height < 20) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={patterns[index % patterns.length]}
        stroke="var(--border)"
        strokeWidth={1.5}
        rx={3}
      />
      {width > 50 && height > 35 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 2}
            textAnchor="middle"
            fill="var(--foreground)"
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
            fill="var(--muted-foreground)"
            fontSize={10}
            className="select-none"
          >
            {headcount} emp
          </text>
        </>
      )}
    </g>
  );
}

export function DepartmentTreemap({ data }: { data: HeadcountByDepartment[] }) {
  if (!data || data.length === 0) return null;

  const formatted = data.map((d) => ({
    name: d.departmentName,
    departmentName: d.departmentName,
    size: d.headcount,
    headcount: d.headcount,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <Treemap
        data={formatted}
        dataKey="size"
        stroke="var(--border)"
        content={<CustomizedTreemapContent />}
        animationDuration={800}
      >
        <Tooltip
          formatter={(value: any, _: any, item: any) => [
            `${item.payload.headcount} employees`,
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

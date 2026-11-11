'use client';

import * as React from 'react';
import { AttendanceHeatmapItem } from '@/types';

export interface HeatmapChartProps {
  data: AttendanceHeatmapItem[];
}

export function HeatmapChart({ data }: HeatmapChartProps) {
  const [tooltip, setTooltip] = React.useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[220px] text-xs text-[var(--muted-foreground)]">
        Empty
      </div>
    );
  }

  // Get unique employees and unique dates sorted
  const employeesMap = new Map<number, string>();
  const datesSet = new Set<string>();

  data.forEach((item) => {
    employeesMap.set(item.employeeId, item.employeeName);
    datesSet.add(item.date);
  });

  const employees = Array.from(employeesMap.entries()).map(([id, name]) => ({
    id,
    name,
  }));
  const dates = Array.from(datesSet).sort();

  // Create lookup matrix: employeeId_date -> status
  const lookup = new Map<string, string>();
  data.forEach((item) => {
    lookup.set(`${item.employeeId}_${item.date}`, item.status);
  });

  const cellSize = 18;
  const cellGap = 3;
  const nameWidth = 120;
  const headerHeight = 28;

  const totalWidth = nameWidth + dates.length * (cellSize + cellGap) + 20;
  const totalHeight = headerHeight + employees.length * (cellSize + cellGap) + 20;

  return (
    <div className="relative w-full overflow-x-auto pb-2">
      <svg
        width={Math.max(600, totalWidth)}
        height={totalHeight}
        className="font-sans text-[11px]"
      >
        {/* Date Headers */}
        {dates.map((d, colIndex) => {
          const x = nameWidth + colIndex * (cellSize + cellGap);
          // Show label only every few days or when space permits
          const showLabel = dates.length <= 15 || colIndex % 5 === 0;
          return (
            <g key={d}>
              {showLabel && (
                <text
                  x={x + cellSize / 2}
                  y={headerHeight - 8}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  className="text-[9px]"
                >
                  {d.slice(5)}
                </text>
              )}
            </g>
          );
        })}

        {/* Rows */}
        {employees.map((emp, rowIndex) => {
          const y = headerHeight + rowIndex * (cellSize + cellGap);
          return (
            <g key={emp.id}>
              {/* Employee Name */}
              <text
                x={nameWidth - 8}
                y={y + cellSize / 2 + 4}
                textAnchor="end"
                fill="var(--foreground)"
                className="text-[11px] font-medium"
              >
                {emp.name.length > 14 ? `${emp.name.slice(0, 13)}…` : emp.name}
              </text>

              {/* Cells */}
              {dates.map((date, colIndex) => {
                const x = nameWidth + colIndex * (cellSize + cellGap);
                const status = lookup.get(`${emp.id}_${date}`);

                let fill = 'var(--muted)';
                let stroke = 'transparent';

                if (status === 'Present') {
                  fill = 'var(--chart-1)';
                } else if (status === 'Leave') {
                  fill = 'var(--chart-4)';
                } else if (status === 'Absent') {
                  fill = 'var(--chart-6)';
                }

                return (
                  <rect
                    key={`${emp.id}_${date}`}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={3}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1}
                    className="cursor-pointer transition-opacity hover:opacity-75"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 10,
                        text: `${emp.name} • ${date}: ${status || 'No Record'}`,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="pointer-events-none z-50 rounded bg-[var(--foreground)] px-2 py-1 text-[11px] font-medium text-[var(--background)] shadow-md whitespace-nowrap"
        >
          {tooltip.text}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs text-[var(--muted-foreground)] pl-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-[var(--chart-1)]" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-[var(--chart-4)]" />
          <span>Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-[var(--chart-6)]" />
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { AttendanceFlowItem } from '@/types';

export interface SankeyChartProps {
  data: AttendanceFlowItem[];
}

export function SankeyChart({ data }: SankeyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[240px] text-xs text-[var(--muted-foreground)]">
        Empty
      </div>
    );
  }

  // Aggregate left nodes (from) and right nodes (to)
  const leftMap = new Map<string, number>();
  const rightMap = new Map<string, number>();
  let totalValue = 0;

  data.forEach((d) => {
    leftMap.set(d.from, (leftMap.get(d.from) || 0) + d.value);
    rightMap.set(d.to, (rightMap.get(d.to) || 0) + d.value);
    totalValue += d.value;
  });

  const width = 500;
  const height = 280;
  const nodeWidth = 14;
  const paddingY = 24;
  const availableHeight = height - paddingY * 2;

  // Layout left nodes
  const leftNodes: { name: string; y: number; height: number; value: number }[] = [];
  let currentY = paddingY;
  const leftGap = 12;
  const totalLeftGaps = (leftMap.size - 1) * leftGap;
  const leftScale = (availableHeight - totalLeftGaps) / (totalValue || 1);

  Array.from(leftMap.entries()).forEach(([name, val]) => {
    const h = Math.max(6, val * leftScale);
    leftNodes.push({ name, y: currentY, height: h, value: val });
    currentY += h + leftGap;
  });

  // Layout right nodes
  const rightNodes: { name: string; y: number; height: number; value: number }[] = [];
  currentY = paddingY;
  const rightGap = 16;
  const totalRightGaps = (rightMap.size - 1) * rightGap;
  const rightScale = (availableHeight - totalRightGaps) / (totalValue || 1);

  Array.from(rightMap.entries()).forEach(([name, val]) => {
    const h = Math.max(12, val * rightScale);
    rightNodes.push({ name, y: currentY, height: h, value: val });
    currentY += h + rightGap;
  });

  // Calculate links
  const leftNodeOffsets: Record<string, number> = {};
  const rightNodeOffsets: Record<string, number> = {};
  leftNodes.forEach((n) => (leftNodeOffsets[n.name] = n.y));
  rightNodes.forEach((n) => (rightNodeOffsets[n.name] = n.y));

  const links = data.map((d) => {
    const leftNode = leftNodes.find((n) => n.name === d.from);
    const rightNode = rightNodes.find((n) => n.name === d.to);
    if (!leftNode || !rightNode) return null;

    const linkLeftH = Math.max(2, (d.value / leftNode.value) * leftNode.height);
    const linkRightH = Math.max(2, (d.value / rightNode.value) * rightNode.height);

    const sy0 = leftNodeOffsets[d.from];
    const sy1 = sy0 + linkLeftH;
    leftNodeOffsets[d.from] += linkLeftH;

    const ty0 = rightNodeOffsets[d.to];
    const ty1 = ty0 + linkRightH;
    rightNodeOffsets[d.to] += linkRightH;

    const x0 = 120 + nodeWidth;
    const x1 = width - 120;
    const xi = (x0 + x1) / 2;

    const pathD = `M ${x0} ${sy0} C ${xi} ${sy0}, ${xi} ${ty0}, ${x1} ${ty0} L ${x1} ${ty1} C ${xi} ${ty1}, ${xi} ${sy1}, ${x0} ${sy1} Z`;

    return {
      d: pathD,
      from: d.from,
      to: d.to,
      value: d.value,
    };
  }).filter(Boolean);

  return (
    <div className="w-full flex items-center justify-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[600px] h-auto">
        {/* Links */}
        <g opacity={0.6}>
          {links.map((link, i) => (
            <path
              key={i}
              d={link!.d}
              fill="var(--chart-3)"
              className="transition-opacity duration-150 hover:opacity-90"
            >
              <title>{`${link!.from} → ${link!.to}: ${link!.value}`}</title>
            </path>
          ))}
        </g>

        {/* Left Nodes (Departments) */}
        {leftNodes.map((n) => (
          <g key={n.name}>
            <rect
              x={120}
              y={n.y}
              width={nodeWidth}
              height={n.height}
              fill="var(--chart-1)"
              rx={2}
            />
            <text
              x={112}
              y={n.y + n.height / 2 + 3}
              textAnchor="end"
              fill="var(--foreground)"
              fontSize={10}
              fontWeight={500}
            >
              {n.name}
            </text>
          </g>
        ))}

        {/* Right Nodes (Statuses) */}
        {rightNodes.map((n) => (
          <g key={n.name}>
            <rect
              x={width - 120}
              y={n.y}
              width={nodeWidth}
              height={n.height}
              fill="var(--chart-2)"
              rx={2}
            />
            <text
              x={width - 120 + nodeWidth + 8}
              y={n.y + n.height / 2 + 3}
              textAnchor="start"
              fill="var(--foreground)"
              fontSize={10}
              fontWeight={500}
            >
              {n.name} ({n.value})
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

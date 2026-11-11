'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'outline' | 'muted' | 'dashed';
  status?: 'Present' | 'Absent' | 'Leave' | string;
}

export function Badge({
  className,
  variant,
  status,
  children,
  ...props
}: BadgeProps) {
  let effectiveVariant = variant || 'outline';
  if (status) {
    if (status === 'Present') effectiveVariant = 'solid';
    else if (status === 'Absent') effectiveVariant = 'outline';
    else if (status === 'Leave') effectiveVariant = 'muted';
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide uppercase',
        {
          'bg-[var(--foreground)] text-[var(--background)]':
            effectiveVariant === 'solid',
          'border border-[var(--foreground)] text-[var(--foreground)] bg-transparent':
            effectiveVariant === 'outline',
          'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]':
            effectiveVariant === 'muted',
          'border border-dashed border-[var(--foreground)] text-[var(--foreground)] bg-transparent':
            effectiveVariant === 'dashed',
        },
        className,
      )}
      {...props}
    >
      {children || status}
    </div>
  );
}

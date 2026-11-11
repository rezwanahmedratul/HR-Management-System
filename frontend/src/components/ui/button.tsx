'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-[var(--ring)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90':
              variant === 'default',
            'border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)]':
              variant === 'outline',
            'bg-[var(--muted)] text-[var(--foreground)] hover:opacity-80':
              variant === 'secondary',
            'text-[var(--foreground)] hover:bg-[var(--muted)]':
              variant === 'ghost',
          },
          {
            'h-8 px-2.5 text-xs': size === 'sm',
            'h-9 px-3.5 text-sm': size === 'md',
            'h-10 px-4 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/employees': 'Employees',
  '/departments': 'Departments',
  '/salaries': 'Salaries',
  '/attendance': 'Attendance',
  '/report': 'Report',
};

export function Topbar() {
  const pathname = usePathname();
  const title = titles[pathname] || 'HR Management';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xs">
      <h1 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h1>
      <ThemeToggle />
    </header>
  );
}

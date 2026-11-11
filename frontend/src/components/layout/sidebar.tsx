'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Building2,
  Banknote,
  CalendarCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/employees', label: 'Employees', icon: Users },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '/salaries', label: 'Salaries', icon: Banknote },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/report', label: 'Report', icon: FileSpreadsheet },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex flex-col w-16 md:w-56 border-r border-[var(--border)] bg-[var(--card)] transition-all duration-200">
      <div className="flex items-center h-14 px-4 border-b border-[var(--border)] justify-center md:justify-start gap-2">
        <div className="w-6 h-6 rounded-md bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-bold text-xs">
          HR
        </div>
        <span className="hidden md:inline font-semibold text-sm tracking-tight text-[var(--foreground)]">
          CoreHR
        </span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-[var(--muted)] -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

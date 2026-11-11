'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, Banknote, DollarSign, CalendarCheck } from 'lucide-react';
import { api } from '@/lib/api';
import {
  DashboardSummary,
  StatusDistribution,
  HeadcountByDepartment,
  PayrollByDepartment,
  DailyTrend,
  TopEarner,
} from '@/types';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import { Sparkline } from '@/components/charts/custom-svg/sparkline';
import { GaugeChart } from '@/components/charts/custom-svg/gauge-chart';
import { ChartCard } from '@/components/charts/chart-card';
import { AttendanceDonut } from '@/components/charts/attendance-donut';
import { HeadcountHorizontalBar } from '@/components/charts/headcount-horizontal-bar';
import { PayrollStackedBar } from '@/components/charts/payroll-stacked-bar';
import { DailyTrendStackedArea } from '@/components/charts/daily-trend-stacked-area';
import { TopEarnersBar } from '@/components/charts/top-earners-bar';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [statusDist, setStatusDist] = React.useState<StatusDistribution[]>([]);
  const [headcount, setHeadcount] = React.useState<HeadcountByDepartment[]>([]);
  const [payroll, setPayroll] = React.useState<PayrollByDepartment[]>([]);
  const [dailyTrend, setDailyTrend] = React.useState<DailyTrend[]>([]);
  const [topEarners, setTopEarners] = React.useState<TopEarner[]>([]);

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sumRes, distRes, headRes, payRes, trendRes, earnersRes] =
          await Promise.all([
            api.dashboard.getSummary(),
            api.analytics.getStatusDistribution(),
            api.analytics.getHeadcountByDepartment(),
            api.analytics.getPayrollByDepartment(),
            api.analytics.getDailyTrend(),
            api.analytics.getTopEarners(10),
          ]);
        setSummary(sumRes);
        setStatusDist(distRes);
        setHeadcount(headRes);
        setPayroll(payRes);
        setDailyTrend(trendRes);
        setTopEarners(earnersRes);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const kpis = [
    {
      title: 'Employees',
      value: summary?.totalEmployees ?? 0,
      formatter: formatNumber,
      sparkline: summary?.sparklines?.employees || [],
      icon: Users,
    },
    {
      title: 'Departments',
      value: summary?.totalDepartments ?? 0,
      formatter: formatNumber,
      sparkline: summary?.sparklines?.departments || [],
      icon: Building2,
    },
    {
      title: 'Payroll',
      value: summary?.totalPayroll ?? 0,
      formatter: formatCurrency,
      sparkline: summary?.sparklines?.payroll || [],
      icon: Banknote,
    },
    {
      title: 'Average Salary',
      value: summary?.averageSalary ?? 0,
      formatter: formatCurrency,
      sparkline: summary?.sparklines?.averageSalary || [],
      icon: DollarSign,
    },
    {
      title: 'Attendance Rate',
      value: summary?.overallAttendanceRate ?? 0,
      formatter: formatPercent,
      sparkline: summary?.sparklines?.attendanceRate || [],
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xs"
            >
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  {kpi.title}
                </span>
                <Icon className="w-4 h-4 text-[var(--muted-foreground)]" />
              </div>
              <div className="my-1">
                {loading ? (
                  <Skeleton className="h-7 w-24 rounded" />
                ) : (
                  <div className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                    <AnimatedNumber
                      value={kpi.value}
                      formatter={kpi.formatter}
                    />
                  </div>
                )}
              </div>
              <div className="mt-2 pt-1 border-t border-[var(--border)]/50">
                <Sparkline data={kpi.sparkline} height={28} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overview Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Attendance Status"
          loading={loading}
          data={statusDist}
          ariaLabel="Attendance Status Distribution Donut Chart"
        >
          <AttendanceDonut data={statusDist} />
        </ChartCard>

        <ChartCard
          title="Attendance Rate"
          loading={loading}
          data={[{ rate: summary?.overallAttendanceRate ?? 0 }]}
          ariaLabel="Overall Attendance Rate Radial Gauge"
        >
          <GaugeChart value={summary?.overallAttendanceRate ?? 0} />
        </ChartCard>

        <ChartCard
          title="Department Headcount"
          loading={loading}
          data={headcount}
          ariaLabel="Department Headcount Horizontal Bar Chart"
        >
          <HeadcountHorizontalBar data={headcount} />
        </ChartCard>

        <ChartCard
          title="Department Payroll"
          loading={loading}
          data={payroll}
          ariaLabel="Department Payroll Stacked Bar Chart"
        >
          <PayrollStackedBar data={payroll} />
        </ChartCard>

        <ChartCard
          title="Daily Attendance"
          loading={loading}
          data={dailyTrend}
          ariaLabel="Daily Attendance Trend Stacked Area Chart"
        >
          <DailyTrendStackedArea data={dailyTrend} />
        </ChartCard>

        <ChartCard
          title="Top Earners"
          loading={loading}
          data={topEarners}
          ariaLabel="Top Earners Horizontal Bar Chart"
        >
          <TopEarnersBar data={topEarners} />
        </ChartCard>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';
import {
  Department,
  AnalyticsFilter,
  HeadcountByDepartment,
  PayrollByDepartment,
  SalaryDistribution,
  DailyTrend,
  AttendanceByEmployee,
  AttendanceByWeekday,
} from '@/types';
import { ChartCard } from '@/components/charts/chart-card';
import { HeadcountPie } from '@/components/charts/headcount-pie';
import { SalaryDistributionHistogram } from '@/components/charts/salary-distribution-histogram';
import { AverageSalaryByDeptBar } from '@/components/charts/average-salary-by-dept-bar';
import { AttendanceRateLine } from '@/components/charts/attendance-rate-line';
import { WeekdayAttendanceBar } from '@/components/charts/weekday-attendance-bar';
import { EmployeeStatusStackedBar } from '@/components/charts/employee-status-stacked-bar';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [filters, setFilters] = React.useState<AnalyticsFilter>({
    departmentId: undefined,
    from: undefined,
    to: undefined,
  });

  const [loading, setLoading] = React.useState(true);

  // Workforce data
  const [headcount, setHeadcount] = React.useState<HeadcountByDepartment[]>([]);

  // Compensation data
  const [payroll, setPayroll] = React.useState<PayrollByDepartment[]>([]);
  const [salaryDist, setSalaryDist] = React.useState<SalaryDistribution[]>([]);

  // Attendance data
  const [dailyTrend, setDailyTrend] = React.useState<DailyTrend[]>([]);
  const [attByEmp, setAttByEmp] = React.useState<AttendanceByEmployee[]>([]);
  const [attByWeekday, setAttByWeekday] = React.useState<AttendanceByWeekday[]>([]);

  // Load departments once
  React.useEffect(() => {
    api.departments.getAll().then(setDepartments).catch(console.error);
  }, []);

  // Fetch charts on filter change
  React.useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [
          headRes,
          payRes,
          distRes,
          trendRes,
          empAttRes,
          weekdayRes,
        ] = await Promise.all([
          api.analytics.getHeadcountByDepartment(filters),
          api.analytics.getPayrollByDepartment(filters),
          api.analytics.getSalaryDistribution(filters),
          api.analytics.getDailyTrend(filters),
          api.analytics.getByEmployee(filters),
          api.analytics.getByWeekday(filters),
        ]);

        setHeadcount(headRes);
        setPayroll(payRes);
        setSalaryDist(distRes);
        setDailyTrend(trendRes);
        setAttByEmp(empAttRes);
        setAttByWeekday(weekdayRes);
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [filters]);

  const handleReset = () => {
    setFilters({ departmentId: undefined, from: undefined, to: undefined });
  };

  return (
    <div className="space-y-8">
      {/* Sticky Filter Bar */}
      <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="w-44">
            <Select
              value={filters.departmentId ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  departmentId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-36">
            <Input
              type="date"
              value={filters.from ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  from: e.target.value || undefined,
                }))
              }
              aria-label="From Date"
            />
          </div>

          <div className="w-36">
            <Input
              type="date"
              value={filters.to ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  to: e.target.value || undefined,
                }))
              }
              aria-label="To Date"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
      </div>

      {/* SECTION 1: WORKFORCE */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
          Workforce
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard
            title="Headcount Share"
            loading={loading}
            data={headcount}
            ariaLabel="Headcount share by department pie chart"
          >
            <HeadcountPie data={headcount} />
          </ChartCard>
        </div>
      </section>

      {/* SECTION 2: COMPENSATION */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
          Compensation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard
            title="Salary Distribution"
            loading={loading}
            data={salaryDist}
            ariaLabel="Salary distribution histogram"
          >
            <SalaryDistributionHistogram data={salaryDist} />
          </ChartCard>

          <ChartCard
            title="Average Salary"
            loading={loading}
            data={payroll}
            ariaLabel="Average salary by department bar chart"
          >
            <AverageSalaryByDeptBar data={payroll} />
          </ChartCard>
        </div>
      </section>

      {/* SECTION 3: ATTENDANCE */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
          Attendance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ChartCard
            title="Present Rate Trend"
            loading={loading}
            data={dailyTrend}
            ariaLabel="Daily present rate line chart"
          >
            <AttendanceRateLine data={dailyTrend} />
          </ChartCard>

          <ChartCard
            title="Weekday Breakdown"
            loading={loading}
            data={attByWeekday}
            ariaLabel="Attendance by weekday bar chart"
          >
            <WeekdayAttendanceBar data={attByWeekday} />
          </ChartCard>

          <ChartCard
            title="Employee Status"
            loading={loading}
            data={attByEmp}
            ariaLabel="Attendance status per employee stacked bar"
            className="md:col-span-2 lg:col-span-1"
          >
            <EmployeeStatusStackedBar data={attByEmp} />
          </ChartCard>
        </div>
      </section>
    </div>
  );
}

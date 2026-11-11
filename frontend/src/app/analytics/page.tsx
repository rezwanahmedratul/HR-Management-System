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
  SalaryRangeByDepartment,
  TopEarner,
  SalaryVsBonus,
  BonusRatio,
  DailyTrend,
  AttendanceByDepartment,
  AttendanceByEmployee,
  AttendanceByWeekday,
  AttendanceHeatmapItem,
  DepartmentScorecard,
} from '@/types';
import { ChartCard } from '@/components/charts/chart-card';
import { HeadcountPie } from '@/components/charts/headcount-pie';
import { DepartmentScorecardRadar } from '@/components/charts/department-scorecard-radar';
import { SalaryDistributionHistogram } from '@/components/charts/salary-distribution-histogram';
import { BasicVsBonusBar } from '@/components/charts/basic-vs-bonus-bar';
import { TopEarnersBar } from '@/components/charts/top-earners-bar';
import { AverageSalaryByDeptBar } from '@/components/charts/average-salary-by-dept-bar';
import { SalaryRangeBar } from '@/components/charts/salary-range-bar';
import { BonusRatioBar } from '@/components/charts/bonus-ratio-bar';
import { AttendanceRateLine } from '@/components/charts/attendance-rate-line';
import { WeekdayAttendanceBar } from '@/components/charts/weekday-attendance-bar';
import { DepartmentRadialBar } from '@/components/charts/department-radial-bar';
import { EmployeeStatusStackedBar } from '@/components/charts/employee-status-stacked-bar';
import { HeatmapChart } from '@/components/charts/custom-svg/heatmap-chart';
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
  const [scorecard, setScorecard] = React.useState<DepartmentScorecard[]>([]);

  // Compensation data
  const [payroll, setPayroll] = React.useState<PayrollByDepartment[]>([]);
  const [salaryDist, setSalaryDist] = React.useState<SalaryDistribution[]>([]);
  const [salaryRange, setSalaryRange] = React.useState<SalaryRangeByDepartment[]>([]);
  const [topEarners, setTopEarners] = React.useState<TopEarner[]>([]);
  const [salaryVsBonus, setSalaryVsBonus] = React.useState<SalaryVsBonus[]>([]);
  const [bonusRatio, setBonusRatio] = React.useState<BonusRatio[]>([]);

  // Attendance data
  const [dailyTrend, setDailyTrend] = React.useState<DailyTrend[]>([]);
  const [attByDept, setAttByDept] = React.useState<AttendanceByDepartment[]>([]);
  const [attByEmp, setAttByEmp] = React.useState<AttendanceByEmployee[]>([]);
  const [attByWeekday, setAttByWeekday] = React.useState<AttendanceByWeekday[]>([]);
  const [heatmap, setHeatmap] = React.useState<AttendanceHeatmapItem[]>([]);

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
          scoreRes,
          payRes,
          distRes,
          rangeRes,
          earnersRes,
          svbRes,
          bonusRes,
          trendRes,
          deptAttRes,
          empAttRes,
          weekdayRes,
          heatRes,
        ] = await Promise.all([
          api.analytics.getHeadcountByDepartment(filters),
          api.analytics.getDepartmentScorecard(filters),
          api.analytics.getPayrollByDepartment(filters),
          api.analytics.getSalaryDistribution(filters),
          api.analytics.getSalaryRangeByDepartment(filters),
          api.analytics.getTopEarners(10, filters),
          api.analytics.getSalaryVsBonus(filters),
          api.analytics.getBonusRatio(filters),
          api.analytics.getDailyTrend(filters),
          api.analytics.getByDepartment(filters),
          api.analytics.getByEmployee(filters),
          api.analytics.getByWeekday(filters),
          api.analytics.getHeatmap(filters),
        ]);

        setHeadcount(headRes);
        setScorecard(scoreRes);
        setPayroll(payRes);
        setSalaryDist(distRes);
        setSalaryRange(rangeRes);
        setTopEarners(earnersRes);
        setSalaryVsBonus(svbRes);
        setBonusRatio(bonusRes);
        setDailyTrend(trendRes);
        setAttByDept(deptAttRes);
        setAttByEmp(empAttRes);
        setAttByWeekday(weekdayRes);
        setHeatmap(heatRes);
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

          <ChartCard
            title="Department Scorecard"
            loading={loading}
            data={scorecard}
            ariaLabel="Department scorecard radar chart"
          >
            <DepartmentScorecardRadar data={scorecard} />
          </ChartCard>
        </div>
      </section>

      {/* SECTION 2: COMPENSATION */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
          Compensation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ChartCard
            title="Salary Distribution"
            loading={loading}
            data={salaryDist}
            ariaLabel="Salary distribution histogram"
          >
            <SalaryDistributionHistogram data={salaryDist} />
          </ChartCard>

          <ChartCard
            title="Basic vs Bonus"
            loading={loading}
            data={salaryVsBonus}
            ariaLabel="Basic vs bonus grouped bar chart"
          >
            <BasicVsBonusBar data={salaryVsBonus} />
          </ChartCard>

          <ChartCard
            title="Top 10 Earners"
            loading={loading}
            data={topEarners}
            ariaLabel="Top 10 earners bar chart"
          >
            <TopEarnersBar data={topEarners} />
          </ChartCard>

          <ChartCard
            title="Average Salary"
            loading={loading}
            data={payroll}
            ariaLabel="Average salary by department bar chart"
          >
            <AverageSalaryByDeptBar data={payroll} />
          </ChartCard>

          <ChartCard
            title="Salary Range"
            loading={loading}
            data={salaryRange}
            ariaLabel="Salary range min avg max by department"
          >
            <SalaryRangeBar data={salaryRange} />
          </ChartCard>

          <ChartCard
            title="Bonus Ratio"
            loading={loading}
            data={bonusRatio}
            ariaLabel="Bonus ratio percentage bar chart"
          >
            <BonusRatioBar data={bonusRatio} />
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
            title="Department Attendance"
            loading={loading}
            data={attByDept}
            ariaLabel="Attendance rate by department radial bar"
          >
            <DepartmentRadialBar data={attByDept} />
          </ChartCard>

          <ChartCard
            title="Employee Status"
            loading={loading}
            data={attByEmp}
            ariaLabel="Attendance status per employee stacked bar"
            className="md:col-span-2 lg:col-span-3"
          >
            <EmployeeStatusStackedBar data={attByEmp} />
          </ChartCard>

          <ChartCard
            title="Attendance Heatmap"
            loading={loading}
            data={heatmap}
            ariaLabel="Employee by date attendance heatmap"
            className="md:col-span-2 lg:col-span-3"
          >
            <HeatmapChart data={heatmap} />
          </ChartCard>
        </div>
      </section>
    </div>
  );
}

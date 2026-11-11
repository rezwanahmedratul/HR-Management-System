export interface Department {
  department_id: number;
  department_name: string;
}

export interface Employee {
  employee_id: number;
  employee_name: string;
  department_id: number | null;
  email: string | null;
  department_name?: string | null;
  basic_salary?: number | null;
  bonus?: number | null;
}

export interface Salary {
  salary_id: number;
  employee_id: number;
  employee_name?: string | null;
  department_name?: string | null;
  basic_salary: number;
  bonus: number | null;
  total_compensation?: number;
}

export interface Attendance {
  attendance_id: number;
  employee_id: number;
  employee_name?: string | null;
  department_name?: string | null;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'Leave' | string;
}

export interface DashboardSummary {
  totalEmployees: number;
  totalDepartments: number;
  totalPayroll: number;
  averageSalary: number;
  overallAttendanceRate: number;
  sparklines: {
    employees: number[];
    departments: number[];
    payroll: number[];
    averageSalary: number[];
    attendanceRate: number[];
  };
}

export interface ReportRow {
  employee_name: string;
  department_name: string | null;
  email: string | null;
  basic_salary: number | null;
  bonus: number | null;
  attendance_date: string | null;
  status: string | null;
}

export interface ReportResponse {
  data: ReportRow[];
  total: number;
  page: number;
  limit: number;
}

export interface AnalyticsFilter {
  from?: string;
  to?: string;
  departmentId?: number;
}

export interface HeadcountByDepartment {
  departmentId: number;
  departmentName: string;
  headcount: number;
}

export interface PayrollByDepartment {
  departmentId: number;
  departmentName: string;
  basicTotal: number;
  bonusTotal: number;
  totalPayroll: number;
  averageSalary: number;
}

export interface SalaryDistribution {
  bin: string;
  count: number;
  min: number;
  max: number;
}

export interface SalaryRangeByDepartment {
  departmentId: number;
  departmentName: string;
  minSalary: number;
  avgSalary: number;
  maxSalary: number;
}

export interface TopEarner {
  employeeId: number;
  employeeName: string;
  departmentName: string;
  basicSalary: number;
  bonus: number;
  totalCompensation: number;
}

export interface SalaryVsBonus {
  employeeId: number;
  employeeName: string;
  departmentName: string;
  basicSalary: number;
  bonus: number;
}

export interface BonusRatio {
  employeeId: number;
  employeeName: string;
  departmentName: string;
  basicSalary: number;
  bonus: number;
  bonusRatio: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface DailyTrend {
  date: string;
  present: number;
  absent: number;
  leave: number;
  attendanceRate: number;
}

export interface AttendanceByDepartment {
  departmentId: number;
  departmentName: string;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  totalCount: number;
  attendanceRate: number;
}

export interface AttendanceByEmployee {
  employeeId: number;
  employeeName: string;
  departmentName: string;
  present: number;
  absent: number;
  leave: number;
  total: number;
  attendanceRate: number;
}

export interface AttendanceByWeekday {
  weekday: number;
  weekdayName: string;
  present: number;
  absent: number;
  leave: number;
  attendanceRate: number;
}

export interface AttendanceHeatmapItem {
  employeeId: number;
  employeeName: string;
  date: string;
  status: string;
}

export interface AttendanceFlowItem {
  from: string;
  to: string;
  value: number;
}

export interface DepartmentScorecard {
  departmentId: number;
  departmentName: string;
  headcount: number;
  avgSalary: number;
  avgBonus: number;
  attendanceRate: number;
  normalizedHeadcount: number;
  normalizedAvgSalary: number;
  normalizedAvgBonus: number;
  normalizedAttendanceRate: number;
}

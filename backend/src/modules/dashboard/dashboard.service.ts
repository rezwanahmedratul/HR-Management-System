import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface DashboardSummaryResponse {
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

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getSummary(): Promise<DashboardSummaryResponse> {
    // 1. Total employees
    const [empCount] = await this.dataSource.query(
      'SELECT COUNT(*) AS count FROM employee',
    );
    const totalEmployees = parseInt(empCount.count, 10) || 0;

    // 2. Total departments
    const [deptCount] = await this.dataSource.query(
      'SELECT COUNT(*) AS count FROM department',
    );
    const totalDepartments = parseInt(deptCount.count, 10) || 0;

    // 3. Total payroll & Average salary
    const [salaryStats] = await this.dataSource.query(`
      SELECT 
        COALESCE(SUM(basic_salary + COALESCE(bonus, 0)), 0) AS total_payroll,
        COALESCE(AVG(basic_salary), 0) AS average_salary
      FROM salary
    `);
    const totalPayroll = parseFloat(salaryStats.total_payroll) || 0;
    const averageSalary = Math.round(parseFloat(salaryStats.average_salary) || 0);

    // 4. Overall attendance rate: Present / (Present + Absent + Leave)
    const [attStats] = await this.dataSource.query(`
      SELECT 
        COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
        COUNT(CASE WHEN status IN ('Present', 'Absent', 'Leave') THEN 1 END) AS total_count
      FROM attendance
    `);
    const presentCount = parseInt(attStats.present_count, 10) || 0;
    const totalAttendanceCount = parseInt(attStats.total_count, 10) || 0;
    const overallAttendanceRate =
      totalAttendanceCount > 0
        ? Math.round((presentCount / totalAttendanceCount) * 1000) / 10
        : 0;

    // 5. Sparkline series
    // Attendance rate recent trend (up to 7 most recent dates)
    const attTrend = await this.dataSource.query(`
      SELECT 
        attendance_date,
        COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
        COUNT(CASE WHEN status IN ('Present', 'Absent', 'Leave') THEN 1 END) AS total_count
      FROM attendance
      GROUP BY attendance_date
      ORDER BY attendance_date DESC
      LIMIT 7
    `);
    const attendanceSparkline = attTrend
      .reverse()
      .map((row: any) => {
        const total = parseInt(row.total_count, 10) || 0;
        const present = parseInt(row.present_count, 10) || 0;
        return total > 0 ? Math.round((present / total) * 100) : 0;
      });

    // Payroll by department trend (sorted by department_id)
    const deptPayroll = await this.dataSource.query(`
      SELECT 
        d.department_id,
        COALESCE(SUM(s.basic_salary + COALESCE(s.bonus, 0)), 0) AS dept_payroll,
        COALESCE(AVG(s.basic_salary), 0) AS dept_avg_salary,
        COUNT(e.employee_id) AS dept_emp_count
      FROM department d
      LEFT JOIN employee e ON e.department_id = d.department_id
      LEFT JOIN salary s ON s.employee_id = e.employee_id
      GROUP BY d.department_id
      ORDER BY d.department_id ASC
    `);

    const payrollSparkline = deptPayroll.map((d: any) =>
      Math.round(parseFloat(d.dept_payroll) || 0),
    );
    const avgSalarySparkline = deptPayroll.map((d: any) =>
      Math.round(parseFloat(d.dept_avg_salary) || 0),
    );
    const employeeSparkline = deptPayroll.map((d: any) =>
      parseInt(d.dept_emp_count, 10) || 0,
    );

    // Departments sparkline: cumulative department counts or recent index points
    const deptSparkline = deptPayroll.map((_: any, idx: number) => idx + 1);

    return {
      totalEmployees,
      totalDepartments,
      totalPayroll,
      averageSalary,
      overallAttendanceRate,
      sparklines: {
        employees: employeeSparkline.length > 0 ? employeeSparkline : [totalEmployees],
        departments: deptSparkline.length > 0 ? deptSparkline : [totalDepartments],
        payroll: payrollSparkline.length > 0 ? payrollSparkline : [totalPayroll],
        averageSalary: avgSalarySparkline.length > 0 ? avgSalarySparkline : [averageSalary],
        attendanceRate:
          attendanceSparkline.length > 0
            ? attendanceSparkline
            : [overallAttendanceRate],
      },
    };
  }
}

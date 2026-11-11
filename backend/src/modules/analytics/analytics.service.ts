import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

/**
 * Attendance Rate Definition:
 * attendanceRate = Present / (Present + Absent + Leave)
 * Expressed as a percentage (0 to 100).
 */

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  async getHeadcountByDepartment(query: AnalyticsQueryDto) {
    const deptId = query.departmentId || null;
    const rows = await this.dataSource.query(
      `
      SELECT 
        d.department_id AS departmentId,
        d.department_name AS departmentName,
        COUNT(e.employee_id) AS headcount
      FROM department d
      LEFT JOIN employee e ON e.department_id = d.department_id
      WHERE (? IS NULL OR d.department_id = ?)
      GROUP BY d.department_id, d.department_name
      ORDER BY headcount DESC, d.department_name ASC
      `,
      [deptId, deptId],
    );
    return rows.map((r: any) => ({
      departmentId: Number(r.departmentId),
      departmentName: r.departmentName,
      headcount: Number(r.headcount),
    }));
  }

  async getPayrollByDepartment(query: AnalyticsQueryDto) {
    const deptId = query.departmentId || null;
    const rows = await this.dataSource.query(
      `
      SELECT 
        d.department_id AS departmentId,
        d.department_name AS departmentName,
        COALESCE(SUM(s.basic_salary), 0) AS basicTotal,
        COALESCE(SUM(COALESCE(s.bonus, 0)), 0) AS bonusTotal,
        COALESCE(SUM(s.basic_salary + COALESCE(s.bonus, 0)), 0) AS totalPayroll,
        COALESCE(AVG(s.basic_salary), 0) AS averageSalary
      FROM department d
      LEFT JOIN employee e ON e.department_id = d.department_id
      LEFT JOIN salary s ON s.employee_id = e.employee_id
      WHERE (? IS NULL OR d.department_id = ?)
      GROUP BY d.department_id, d.department_name
      ORDER BY totalPayroll DESC
      `,
      [deptId, deptId],
    );
    return rows.map((r: any) => ({
      departmentId: Number(r.departmentId),
      departmentName: r.departmentName,
      basicTotal: Math.round(Number(r.basicTotal)),
      bonusTotal: Math.round(Number(r.bonusTotal)),
      totalPayroll: Math.round(Number(r.totalPayroll)),
      averageSalary: Math.round(Number(r.averageSalary)),
    }));
  }

  async getSalaryDistribution(query: AnalyticsQueryDto) {
    const deptId = query.departmentId || null;
    const rows = await this.dataSource.query(
      `
      SELECT 
        CASE 
          WHEN s.basic_salary < 50000 THEN '< $50k'
          WHEN s.basic_salary < 70000 THEN '$50k - $70k'
          WHEN s.basic_salary < 90000 THEN '$70k - $90k'
          WHEN s.basic_salary < 110000 THEN '$90k - $110k'
          WHEN s.basic_salary < 130000 THEN '$110k - $130k'
          ELSE '$130k+'
        END AS bin,
        MIN(CASE 
          WHEN s.basic_salary < 50000 THEN 1
          WHEN s.basic_salary < 70000 THEN 2
          WHEN s.basic_salary < 90000 THEN 3
          WHEN s.basic_salary < 110000 THEN 4
          WHEN s.basic_salary < 130000 THEN 5
          ELSE 6
        END) AS binOrder,
        COUNT(s.salary_id) AS count,
        COALESCE(MIN(s.basic_salary), 0) AS min,
        COALESCE(MAX(s.basic_salary), 0) AS max
      FROM salary s
      JOIN employee e ON e.employee_id = s.employee_id
      WHERE (? IS NULL OR e.department_id = ?)
      GROUP BY bin
      ORDER BY binOrder ASC
      `,
      [deptId, deptId],
    );
    return rows.map((r: any) => ({
      bin: r.bin,
      count: Number(r.count),
      min: Math.round(Number(r.min)),
      max: Math.round(Number(r.max)),
    }));
  }

  async getSalaryRangeByDepartment(query: AnalyticsQueryDto) {
    const deptId = query.departmentId || null;
    const rows = await this.dataSource.query(
      `
      SELECT 
        d.department_id AS departmentId,
        d.department_name AS departmentName,
        COALESCE(MIN(s.basic_salary), 0) AS minSalary,
        COALESCE(AVG(s.basic_salary), 0) AS avgSalary,
        COALESCE(MAX(s.basic_salary), 0) AS maxSalary
      FROM department d
      JOIN employee e ON e.department_id = d.department_id
      JOIN salary s ON s.employee_id = e.employee_id
      WHERE (? IS NULL OR d.department_id = ?)
      GROUP BY d.department_id, d.department_name
      ORDER BY avgSalary DESC
      `,
      [deptId, deptId],
    );
    return rows.map((r: any) => ({
      departmentId: Number(r.departmentId),
      departmentName: r.departmentName,
      minSalary: Math.round(Number(r.minSalary)),
      avgSalary: Math.round(Number(r.avgSalary)),
      maxSalary: Math.round(Number(r.maxSalary)),
    }));
  }

  async getTopEarners(limit: number = 10, query: AnalyticsQueryDto) {
    const deptId = query.departmentId || null;
    const safeLimit = Math.max(1, Math.min(50, limit || 10));
    const rows = await this.dataSource.query(
      `
      SELECT 
        e.employee_id AS employeeId,
        e.employee_name AS employeeName,
        COALESCE(d.department_name, 'None') AS departmentName,
        s.basic_salary AS basicSalary,
        COALESCE(s.bonus, 0) AS bonus,
        (s.basic_salary + COALESCE(s.bonus, 0)) AS totalCompensation
      FROM employee e
      JOIN salary s ON s.employee_id = e.employee_id
      LEFT JOIN department d ON d.department_id = e.department_id
      WHERE (? IS NULL OR e.department_id = ?)
      ORDER BY totalCompensation DESC
      LIMIT ?
      `,
      [deptId, deptId, safeLimit],
    );
    return rows.map((r: any) => ({
      employeeId: Number(r.employeeId),
      employeeName: r.employeeName,
      departmentName: r.departmentName,
      basicSalary: Number(r.basicSalary),
      bonus: Number(r.bonus),
      totalCompensation: Number(r.totalCompensation),
    }));
  }

  async getSalaryVsBonus(query: AnalyticsQueryDto) {
    const deptId = query.departmentId || null;
    const rows = await this.dataSource.query(
      `
      SELECT 
        e.employee_id AS employeeId,
        e.employee_name AS employeeName,
        COALESCE(d.department_name, 'None') AS departmentName,
        s.basic_salary AS basicSalary,
        COALESCE(s.bonus, 0) AS bonus
      FROM employee e
      JOIN salary s ON s.employee_id = e.employee_id
      LEFT JOIN department d ON d.department_id = e.department_id
      WHERE (? IS NULL OR e.department_id = ?)
      ORDER BY s.basic_salary ASC
      `,
      [deptId, deptId],
    );
    return rows.map((r: any) => ({
      employeeId: Number(r.employeeId),
      employeeName: r.employeeName,
      departmentName: r.departmentName,
      basicSalary: Number(r.basicSalary),
      bonus: Number(r.bonus),
    }));
  }

  async getBonusRatio(query: AnalyticsQueryDto) {
    const deptId = query.departmentId || null;
    const rows = await this.dataSource.query(
      `
      SELECT 
        e.employee_id AS employeeId,
        e.employee_name AS employeeName,
        COALESCE(d.department_name, 'None') AS departmentName,
        s.basic_salary AS basicSalary,
        COALESCE(s.bonus, 0) AS bonus,
        ROUND((COALESCE(s.bonus, 0) / s.basic_salary) * 100, 2) AS bonusRatio
      FROM employee e
      JOIN salary s ON s.employee_id = e.employee_id
      LEFT JOIN department d ON d.department_id = e.department_id
      WHERE (? IS NULL OR e.department_id = ?)
        AND s.basic_salary > 0
      ORDER BY bonusRatio DESC
      `,
      [deptId, deptId],
    );
    return rows.map((r: any) => ({
      employeeId: Number(r.employeeId),
      employeeName: r.employeeName,
      departmentName: r.departmentName,
      basicSalary: Number(r.basicSalary),
      bonus: Number(r.bonus),
      bonusRatio: Number(r.bonusRatio),
    }));
  }

  async getAttendanceStatusDistribution(query: AnalyticsQueryDto) {
    const from = query.from || null;
    const to = query.to || null;
    const deptId = query.departmentId || null;

    const rows = await this.dataSource.query(
      `
      SELECT 
        a.status AS status,
        COUNT(a.attendance_id) AS count
      FROM attendance a
      JOIN employee e ON e.employee_id = a.employee_id
      WHERE (? IS NULL OR a.attendance_date >= ?)
        AND (? IS NULL OR a.attendance_date <= ?)
        AND (? IS NULL OR e.department_id = ?)
      GROUP BY a.status
      ORDER BY count DESC
      `,
      [from, from, to, to, deptId, deptId],
    );

    const total = rows.reduce((acc: number, r: any) => acc + Number(r.count), 0);
    return rows.map((r: any) => ({
      status: r.status,
      count: Number(r.count),
      percentage: total > 0 ? Math.round((Number(r.count) / total) * 1000) / 10 : 0,
    }));
  }

  async getAttendanceDailyTrend(query: AnalyticsQueryDto) {
    const from = query.from || null;
    const to = query.to || null;
    const deptId = query.departmentId || null;

    const rows = await this.dataSource.query(
      `
      SELECT 
        DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS date,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS present,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) AS absent,
        COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) AS \`leave\`,
        ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0), 1) AS attendanceRate
      FROM attendance a
      JOIN employee e ON e.employee_id = a.employee_id
      WHERE (? IS NULL OR a.attendance_date >= ?)
        AND (? IS NULL OR a.attendance_date <= ?)
        AND (? IS NULL OR e.department_id = ?)
      GROUP BY date
      ORDER BY date ASC
      `,
      [from, from, to, to, deptId, deptId],
    );

    return rows.map((r: any) => ({
      date: r.date,
      present: Number(r.present),
      absent: Number(r.absent),
      leave: Number(r.leave),
      attendanceRate: Number(r.attendanceRate) || 0,
    }));
  }

  async getAttendanceByDepartment(query: AnalyticsQueryDto) {
    const from = query.from || null;
    const to = query.to || null;
    const deptId = query.departmentId || null;

    const rows = await this.dataSource.query(
      `
      SELECT 
        d.department_id AS departmentId,
        d.department_name AS departmentName,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS presentCount,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) AS absentCount,
        COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) AS leaveCount,
        COUNT(a.attendance_id) AS totalCount,
        ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0), 1) AS attendanceRate
      FROM department d
      JOIN employee e ON e.department_id = d.department_id
      LEFT JOIN attendance a ON a.employee_id = e.employee_id
        AND (? IS NULL OR a.attendance_date >= ?)
        AND (? IS NULL OR a.attendance_date <= ?)
      WHERE (? IS NULL OR d.department_id = ?)
      GROUP BY d.department_id, d.department_name
      ORDER BY attendanceRate DESC
      `,
      [from, from, to, to, deptId, deptId],
    );

    return rows.map((r: any) => ({
      departmentId: Number(r.departmentId),
      departmentName: r.departmentName,
      presentCount: Number(r.presentCount),
      absentCount: Number(r.absentCount),
      leaveCount: Number(r.leaveCount),
      totalCount: Number(r.totalCount),
      attendanceRate: Number(r.attendanceRate) || 0,
    }));
  }

  async getAttendanceByEmployee(query: AnalyticsQueryDto) {
    const from = query.from || null;
    const to = query.to || null;
    const deptId = query.departmentId || null;

    const rows = await this.dataSource.query(
      `
      SELECT 
        e.employee_id AS employeeId,
        e.employee_name AS employeeName,
        COALESCE(d.department_name, 'None') AS departmentName,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS present,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) AS absent,
        COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) AS \`leave\`,
        COUNT(a.attendance_id) AS total,
        ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0), 1) AS attendanceRate
      FROM employee e
      LEFT JOIN department d ON d.department_id = e.department_id
      LEFT JOIN attendance a ON a.employee_id = e.employee_id
        AND (? IS NULL OR a.attendance_date >= ?)
        AND (? IS NULL OR a.attendance_date <= ?)
      WHERE (? IS NULL OR e.department_id = ?)
      GROUP BY e.employee_id, e.employee_name, d.department_name
      ORDER BY total DESC, e.employee_id ASC
      `,
      [from, from, to, to, deptId, deptId],
    );

    return rows.map((r: any) => ({
      employeeId: Number(r.employeeId),
      employeeName: r.employeeName,
      departmentName: r.departmentName,
      present: Number(r.present),
      absent: Number(r.absent),
      leave: Number(r.leave),
      total: Number(r.total),
      attendanceRate: Number(r.attendanceRate) || 0,
    }));
  }

  async getAttendanceByWeekday(query: AnalyticsQueryDto) {
    const from = query.from || null;
    const to = query.to || null;
    const deptId = query.departmentId || null;

    const rows = await this.dataSource.query(
      `
      SELECT 
        WEEKDAY(a.attendance_date) AS weekday,
        DAYNAME(a.attendance_date) AS weekdayName,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS present,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) AS absent,
        COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) AS \`leave\`,
        ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0), 1) AS attendanceRate
      FROM attendance a
      JOIN employee e ON e.employee_id = a.employee_id
      WHERE (? IS NULL OR a.attendance_date >= ?)
        AND (? IS NULL OR a.attendance_date <= ?)
        AND (? IS NULL OR e.department_id = ?)
      GROUP BY weekday, weekdayName
      ORDER BY weekday ASC
      `,
      [from, from, to, to, deptId, deptId],
    );

    return rows.map((r: any) => ({
      weekday: Number(r.weekday),
      weekdayName: r.weekdayName,
      present: Number(r.present),
      absent: Number(r.absent),
      leave: Number(r.leave),
      attendanceRate: Number(r.attendanceRate) || 0,
    }));
  }

  async getAttendanceHeatmap(query: AnalyticsQueryDto) {
    const from = query.from || null;
    const to = query.to || null;
    const deptId = query.departmentId || null;

    const rows = await this.dataSource.query(
      `
      SELECT 
        e.employee_id AS employeeId,
        e.employee_name AS employeeName,
        DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS date,
        a.status AS status
      FROM attendance a
      JOIN employee e ON e.employee_id = a.employee_id
      WHERE (? IS NULL OR a.attendance_date >= ?)
        AND (? IS NULL OR a.attendance_date <= ?)
        AND (? IS NULL OR e.department_id = ?)
      ORDER BY e.employee_id ASC, a.attendance_date ASC
      `,
      [from, from, to, to, deptId, deptId],
    );

    return rows.map((r: any) => ({
      employeeId: Number(r.employeeId),
      employeeName: r.employeeName,
      date: r.date,
      status: r.status,
    }));
  }

  async getAttendanceFlow(query: AnalyticsQueryDto) {
    const from = query.from || null;
    const to = query.to || null;
    const deptId = query.departmentId || null;

    const rows = await this.dataSource.query(
      `
      SELECT 
        COALESCE(d.department_name, 'No Department') AS \`from\`,
        a.status AS \`to\`,
        COUNT(a.attendance_id) AS value
      FROM attendance a
      JOIN employee e ON e.employee_id = a.employee_id
      LEFT JOIN department d ON d.department_id = e.department_id
      WHERE (? IS NULL OR a.attendance_date >= ?)
        AND (? IS NULL OR a.attendance_date <= ?)
        AND (? IS NULL OR e.department_id = ?)
      GROUP BY \`from\`, \`to\`
      ORDER BY \`from\` ASC, value DESC
      `,
      [from, from, to, to, deptId, deptId],
    );

    return rows.map((r: any) => ({
      from: r.from,
      to: r.to,
      value: Number(r.value),
    }));
  }

  async getDepartmentScorecard(query: AnalyticsQueryDto) {
    const from = query.from || null;
    const to = query.to || null;
    const deptId = query.departmentId || null;

    const rows = await this.dataSource.query(
      `
      SELECT 
        d.department_id AS departmentId,
        d.department_name AS departmentName,
        COUNT(DISTINCT e.employee_id) AS headcount,
        COALESCE(AVG(s.basic_salary), 0) AS avgSalary,
        COALESCE(AVG(COALESCE(s.bonus, 0)), 0) AS avgBonus,
        ROUND(COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0), 1) AS attendanceRate
      FROM department d
      LEFT JOIN employee e ON e.department_id = d.department_id
      LEFT JOIN salary s ON s.employee_id = e.employee_id
      LEFT JOIN attendance a ON a.employee_id = e.employee_id
        AND (? IS NULL OR a.attendance_date >= ?)
        AND (? IS NULL OR a.attendance_date <= ?)
      WHERE (? IS NULL OR d.department_id = ?)
      GROUP BY d.department_id, d.department_name
      ORDER BY d.department_id ASC
      `,
      [from, from, to, to, deptId, deptId],
    );

    const parsed = rows.map((r: any) => ({
      departmentId: Number(r.departmentId),
      departmentName: r.departmentName,
      headcount: Number(r.headcount),
      avgSalary: Math.round(Number(r.avgSalary)),
      avgBonus: Math.round(Number(r.avgBonus)),
      attendanceRate: Number(r.attendanceRate) || 0,
    }));

    if (parsed.length === 0) return [];

    const maxHeadcount = Math.max(...parsed.map((p) => p.headcount), 1);
    const maxSalary = Math.max(...parsed.map((p) => p.avgSalary), 1);
    const maxBonus = Math.max(...parsed.map((p) => p.avgBonus), 1);

    return parsed.map((item) => ({
      ...item,
      normalizedHeadcount: Math.round((item.headcount / maxHeadcount) * 100),
      normalizedAvgSalary: Math.round((item.avgSalary / maxSalary) * 100),
      normalizedAvgBonus: Math.round((item.avgBonus / maxBonus) * 100),
      normalizedAttendanceRate: Math.round(item.attendanceRate),
    }));
  }
}

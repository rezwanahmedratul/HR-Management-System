import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { Department } from '../../entities/department.entity';
import { Salary } from '../../entities/salary.entity';
import { Attendance } from '../../entities/attendance.entity';
import { ReportQueryDto } from './dto/report-query.dto';

export interface ReportRow {
  employee_name: string;
  department_name: string | null;
  email: string | null;
  basic_salary: number | null;
  bonus: number | null;
  attendance_date: string | null;
  status: string | null;
}

export interface PaginatedReportResult {
  data: ReportRow[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ReportService {
  constructor(private readonly dataSource: DataSource) {}

  private buildQuery(query: ReportQueryDto) {
    const qb = this.dataSource
      .createQueryBuilder()
      .from(Employee, 'e')
      .leftJoin(Department, 'd', 'd.department_id = e.department_id')
      .leftJoin(Salary, 's', 's.employee_id = e.employee_id')
      .leftJoin(Attendance, 'a', 'a.employee_id = e.employee_id');

    if (query.search) {
      qb.andWhere(
        '(LOWER(e.employee_name) LIKE :search OR LOWER(e.email) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }

    if (query.departmentId) {
      qb.andWhere('d.department_id = :departmentId', {
        departmentId: query.departmentId,
      });
    }

    if (query.status) {
      qb.andWhere('a.status = :status', { status: query.status });
    }

    if (query.from) {
      qb.andWhere('a.attendance_date >= :from', { from: query.from });
    }

    if (query.to) {
      qb.andWhere('a.attendance_date <= :to', { to: query.to });
    }

    return qb;
  }

  async getReport(query: ReportQueryDto): Promise<PaginatedReportResult> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 10));
    const offset = (page - 1) * limit;

    const countQb = this.buildQuery(query);
    const countResult = await countQb
      .select('COUNT(*)', 'total')
      .getRawOne();
    const total = parseInt(countResult?.total || '0', 10);

    const dataQb = this.buildQuery(query);
    dataQb.select([
      'e.employee_name AS employee_name',
      'd.department_name AS department_name',
      'e.email AS email',
      's.basic_salary AS basic_salary',
      's.bonus AS bonus',
      'DATE_FORMAT(a.attendance_date, "%Y-%m-%d") AS attendance_date',
      'a.status AS status',
    ]);

    const sortMap: Record<string, string> = {
      employee_name: 'e.employee_name',
      department_name: 'd.department_name',
      email: 'e.email',
      basic_salary: 's.basic_salary',
      bonus: 's.bonus',
      attendance_date: 'a.attendance_date',
      status: 'a.status',
      employee_id: 'e.employee_id',
    };

    const sortOrder =
      query.sortOrder && query.sortOrder.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    if (query.sortBy && sortMap[query.sortBy]) {
      dataQb.orderBy(sortMap[query.sortBy], sortOrder);
      if (query.sortBy !== 'attendance_date') {
        dataQb.addOrderBy('a.attendance_date', 'ASC');
      }
    } else {
      dataQb.orderBy('e.employee_id', 'ASC').addOrderBy('a.attendance_date', 'ASC');
    }

    dataQb.offset(offset).limit(limit);

    const rawRows = await dataQb.getRawMany();

    const data: ReportRow[] = rawRows.map((row) => ({
      employee_name: row.employee_name,
      department_name: row.department_name ?? null,
      email: row.email ?? null,
      basic_salary: row.basic_salary !== null ? parseFloat(row.basic_salary) : null,
      bonus: row.bonus !== null ? parseFloat(row.bonus) : null,
      attendance_date: row.attendance_date ?? null,
      status: row.status ?? null,
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async exportCsv(query: ReportQueryDto): Promise<string> {
    const dataQb = this.buildQuery(query);
    dataQb.select([
      'e.employee_name AS employee_name',
      'd.department_name AS department_name',
      'e.email AS email',
      's.basic_salary AS basic_salary',
      's.bonus AS bonus',
      'DATE_FORMAT(a.attendance_date, "%Y-%m-%d") AS attendance_date',
      'a.status AS status',
    ]);

    const sortMap: Record<string, string> = {
      employee_name: 'e.employee_name',
      department_name: 'd.department_name',
      email: 'e.email',
      basic_salary: 's.basic_salary',
      bonus: 's.bonus',
      attendance_date: 'a.attendance_date',
      status: 'a.status',
      employee_id: 'e.employee_id',
    };

    const sortOrder =
      query.sortOrder && query.sortOrder.toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    if (query.sortBy && sortMap[query.sortBy]) {
      dataQb.orderBy(sortMap[query.sortBy], sortOrder);
      if (query.sortBy !== 'attendance_date') {
        dataQb.addOrderBy('a.attendance_date', 'ASC');
      }
    } else {
      dataQb.orderBy('e.employee_id', 'ASC').addOrderBy('a.attendance_date', 'ASC');
    }

    const rawRows = await dataQb.getRawMany();

    const headers = [
      'employee_name',
      'department_name',
      'email',
      'basic_salary',
      'bonus',
      'attendance_date',
      'status',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = rawRows.map((r) => [
      escapeCsv(r.employee_name),
      escapeCsv(r.department_name),
      escapeCsv(r.email),
      escapeCsv(r.basic_salary !== null ? parseFloat(r.basic_salary).toFixed(2) : ''),
      escapeCsv(r.bonus !== null ? parseFloat(r.bonus).toFixed(2) : ''),
      escapeCsv(r.attendance_date),
      escapeCsv(r.status),
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
}

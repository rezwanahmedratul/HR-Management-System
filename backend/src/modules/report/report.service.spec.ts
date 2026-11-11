import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let mockDataSource: any;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    mockQueryBuilder = {
      from: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '8' }),
      getRawMany: jest.fn().mockResolvedValue([
        {
          employee_name: 'Alice Smith',
          department_name: 'Human Resources',
          email: 'alice@company.com',
          basic_salary: '50000.00',
          bonus: '5000.00',
          attendance_date: '2025-04-01',
          status: 'Present',
        },
        {
          employee_name: 'Alice Smith',
          department_name: 'Human Resources',
          email: 'alice@company.com',
          basic_salary: '50000.00',
          bonus: '5000.00',
          attendance_date: '2025-04-02',
          status: 'Present',
        },
      ]),
    };

    mockDataSource = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReport', () => {
    it('should return paginated report data with defaults', async () => {
      const result = await service.getReport({});

      expect(result).toBeDefined();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(8);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({
        employee_name: 'Alice Smith',
        department_name: 'Human Resources',
        email: 'alice@company.com',
        basic_salary: 50000,
        bonus: 5000,
        attendance_date: '2025-04-01',
        status: 'Present',
      });
      expect(mockQueryBuilder.from).toHaveBeenCalled();
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledTimes(6); // 3 for count, 3 for data
    });

    it('should apply search filter when provided', async () => {
      await service.getReport({ search: 'alice' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(LOWER(e.employee_name) LIKE :search OR LOWER(e.email) LIKE :search)',
        { search: '%alice%' },
      );
    });

    it('should apply departmentId filter when provided', async () => {
      await service.getReport({ departmentId: 1 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'd.department_id = :departmentId',
        { departmentId: 1 },
      );
    });

    it('should apply status, from, to filters when provided', async () => {
      await service.getReport({
        status: 'Present',
        from: '2025-04-01',
        to: '2025-04-30',
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.status = :status',
        { status: 'Present' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.attendance_date >= :from',
        { from: '2025-04-01' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'a.attendance_date <= :to',
        { to: '2025-04-30' },
      );
    });

    it('should apply custom sorting when valid sortBy is passed', async () => {
      await service.getReport({ sortBy: 'employee_name', sortOrder: 'DESC' });

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'e.employee_name',
        'DESC',
      );
    });
  });

  describe('exportCsv', () => {
    it('should format rows into CSV string with header', async () => {
      const csv = await service.exportCsv({});

      expect(csv).toBeDefined();
      const lines = csv.split('\n');
      expect(lines[0]).toBe(
        'employee_name,department_name,email,basic_salary,bonus,attendance_date,status',
      );
      expect(lines[1]).toBe(
        'Alice Smith,Human Resources,alice@company.com,50000.00,5000.00,2025-04-01,Present',
      );
      expect(lines[2]).toBe(
        'Alice Smith,Human Resources,alice@company.com,50000.00,5000.00,2025-04-02,Present',
      );
    });

    it('should escape strings with commas or quotes properly', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        {
          employee_name: 'Doe, Jane "JD"',
          department_name: 'Marketing',
          email: 'jane@company.com',
          basic_salary: '60000.00',
          bonus: null,
          attendance_date: '2025-04-01',
          status: 'Leave',
        },
      ]);

      const csv = await service.exportCsv({});
      const lines = csv.split('\n');
      expect(lines[1]).toContain('"Doe, Jane ""JD"""');
    });
  });
});

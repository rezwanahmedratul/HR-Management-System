import {
  Department,
  Employee,
  Salary,
  Attendance,
  DashboardSummary,
  ReportResponse,
  AnalyticsFilter,
  HeadcountByDepartment,
  PayrollByDepartment,
  SalaryDistribution,
  SalaryRangeByDepartment,
  TopEarner,
  SalaryVsBonus,
  BonusRatio,
  StatusDistribution,
  DailyTrend,
  AttendanceByDepartment,
  AttendanceByEmployee,
  AttendanceByWeekday,
  AttendanceHeatmapItem,
  AttendanceFlowItem,
  DepartmentScorecard,
} from '../types';

export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return (
      process.env.API_URL_INTERNAL ||
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://backend:4000/api'
    );
  }
  // If explicitly configured
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In local development or Docker compose on localhost, hit backend port 4000 directly
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:4000/api';
  }
  // Cloud deployment runtime proxy
  return '/api-proxy';
};

const fetchJson = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = `${getBaseUrl()}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.message) {
        errorMsg = Array.isArray(errJson.message)
          ? errJson.message.join(', ')
          : errJson.message;
      }
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return res.json();
};

const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
};

export const api = {
  departments: {
    getAll: () => fetchJson<Department[]>('/departments'),
    getOne: (id: number) => fetchJson<Department>(`/departments/${id}`),
    create: (data: Partial<Department>) =>
      fetchJson<Department>('/departments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Department>) =>
      fetchJson<Department>(`/departments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchJson<{ success: boolean; message: string }>(`/departments/${id}`, {
        method: 'DELETE',
      }),
  },

  employees: {
    getAll: () => fetchJson<Employee[]>('/employees'),
    getOne: (id: number) => fetchJson<Employee>(`/employees/${id}`),
    create: (data: Partial<Employee>) =>
      fetchJson<Employee>('/employees', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Employee>) =>
      fetchJson<Employee>(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchJson<{ success: boolean; message: string }>(`/employees/${id}`, {
        method: 'DELETE',
      }),
  },

  salaries: {
    getAll: () => fetchJson<Salary[]>('/salaries'),
    getOne: (id: number) => fetchJson<Salary>(`/salaries/${id}`),
    create: (data: Partial<Salary>) =>
      fetchJson<Salary>('/salaries', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Salary>) =>
      fetchJson<Salary>(`/salaries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchJson<{ success: boolean; message: string }>(`/salaries/${id}`, {
        method: 'DELETE',
      }),
  },

  attendance: {
    getAll: (params?: { from?: string; to?: string; employeeId?: number; status?: string }) =>
      fetchJson<Attendance[]>(`/attendance${buildQueryString(params || {})}`),
    getOne: (id: number) => fetchJson<Attendance>(`/attendance/${id}`),
    create: (data: Partial<Attendance>) =>
      fetchJson<Attendance>('/attendance', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Attendance>) =>
      fetchJson<Attendance>(`/attendance/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchJson<{ success: boolean; message: string }>(`/attendance/${id}`, {
        method: 'DELETE',
      }),
  },

  dashboard: {
    getSummary: () => fetchJson<DashboardSummary>('/dashboard/summary'),
  },

  analytics: {
    getHeadcountByDepartment: (filter?: AnalyticsFilter) =>
      fetchJson<HeadcountByDepartment[]>(`/analytics/headcount-by-department${buildQueryString(filter || {})}`),
    getPayrollByDepartment: (filter?: AnalyticsFilter) =>
      fetchJson<PayrollByDepartment[]>(`/analytics/payroll-by-department${buildQueryString(filter || {})}`),
    getSalaryDistribution: (filter?: AnalyticsFilter) =>
      fetchJson<SalaryDistribution[]>(`/analytics/salary-distribution${buildQueryString(filter || {})}`),
    getSalaryRangeByDepartment: (filter?: AnalyticsFilter) =>
      fetchJson<SalaryRangeByDepartment[]>(`/analytics/salary-range-by-department${buildQueryString(filter || {})}`),
    getTopEarners: (limit = 10, filter?: AnalyticsFilter) =>
      fetchJson<TopEarner[]>(`/analytics/top-earners${buildQueryString({ limit, ...(filter || {}) })}`),
    getSalaryVsBonus: (filter?: AnalyticsFilter) =>
      fetchJson<SalaryVsBonus[]>(`/analytics/salary-vs-bonus${buildQueryString(filter || {})}`),
    getBonusRatio: (filter?: AnalyticsFilter) =>
      fetchJson<BonusRatio[]>(`/analytics/bonus-ratio${buildQueryString(filter || {})}`),
    getStatusDistribution: (filter?: AnalyticsFilter) =>
      fetchJson<StatusDistribution[]>(`/analytics/attendance/status-distribution${buildQueryString(filter || {})}`),
    getDailyTrend: (filter?: AnalyticsFilter) =>
      fetchJson<DailyTrend[]>(`/analytics/attendance/daily-trend${buildQueryString(filter || {})}`),
    getByDepartment: (filter?: AnalyticsFilter) =>
      fetchJson<AttendanceByDepartment[]>(`/analytics/attendance/by-department${buildQueryString(filter || {})}`),
    getByEmployee: (filter?: AnalyticsFilter) =>
      fetchJson<AttendanceByEmployee[]>(`/analytics/attendance/by-employee${buildQueryString(filter || {})}`),
    getByWeekday: (filter?: AnalyticsFilter) =>
      fetchJson<AttendanceByWeekday[]>(`/analytics/attendance/by-weekday${buildQueryString(filter || {})}`),
    getHeatmap: (filter?: AnalyticsFilter) =>
      fetchJson<AttendanceHeatmapItem[]>(`/analytics/attendance/heatmap${buildQueryString(filter || {})}`),
    getFlow: (filter?: AnalyticsFilter) =>
      fetchJson<AttendanceFlowItem[]>(`/analytics/attendance/flow${buildQueryString(filter || {})}`),
    getDepartmentScorecard: (filter?: AnalyticsFilter) =>
      fetchJson<DepartmentScorecard[]>(`/analytics/department-scorecard${buildQueryString(filter || {})}`),
  },

  report: {
    getReport: (params?: Record<string, any>) =>
      fetchJson<ReportResponse>(`/report${buildQueryString(params || {})}`),
    getExportUrl: (params?: Record<string, any>) =>
      `${getBaseUrl()}/report/export${buildQueryString(params || {})}`,
  },
};

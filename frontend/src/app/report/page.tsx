'use client';

import * as React from 'react';
import {
  Download,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { ReportRow, Department } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrencyDetailed, formatDate } from '@/lib/utils';

export default function ReportPage() {
  const [data, setData] = React.useState<ReportRow[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [loading, setLoading] = React.useState(true);

  // Filters
  const [search, setSearch] = React.useState('');
  const [departmentId, setDepartmentId] = React.useState<number | ''>('');
  const [status, setStatus] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  // Sorting
  const [sortBy, setSortBy] = React.useState<string>('employee_id');
  const [sortOrder, setSortOrder] = React.useState<'ASC' | 'DESC'>('ASC');

  // Load departments
  React.useEffect(() => {
    api.departments.getAll().then(setDepartments).catch(console.error);
  }, []);

  // Fetch report data
  const fetchReport = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.report.getReport({
        search: search.trim() || undefined,
        departmentId: departmentId === '' ? undefined : departmentId,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
        page,
        limit,
        sortBy,
        sortOrder,
      });
      setData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  }, [search, departmentId, status, from, to, page, limit, sortBy, sortOrder]);

  React.useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentId('');
    setStatus('');
    setFrom('');
    setTo('');
    setSortBy('employee_id');
    setSortOrder('ASC');
    setPage(1);
  };

  const handleExportCsv = () => {
    const exportUrl = api.report.getExportUrl({
      search: search.trim() || undefined,
      departmentId: departmentId === '' ? undefined : departmentId,
      status: status || undefined,
      from: from || undefined,
      to: to || undefined,
      sortBy,
      sortOrder,
    });
    window.open(exportUrl, '_blank');
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 ml-1 inline" />;
    }
    return sortOrder === 'ASC' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[var(--foreground)] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[var(--foreground)] ml-1 inline" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters and Export Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-8 text-xs"
            />
          </div>

          {/* Department Filter */}
          <div className="w-40">
            <Select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(
                  e.target.value ? Number(e.target.value) : '',
                );
                setPage(1);
              }}
              className="h-8 text-xs"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-32">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-8 text-xs"
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </Select>
          </div>

          {/* Date Range: From */}
          <div className="w-32">
            <Input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              className="h-8 text-xs"
              aria-label="From Date"
            />
          </div>

          {/* Date Range: To */}
          <div className="w-32">
            <Input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              className="h-8 text-xs"
              aria-label="To Date"
            />
          </div>

          {/* Reset Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-8 text-xs gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>

        {/* Export CSV Button */}
        <Button onClick={handleExportCsv} size="sm" className="gap-1.5 h-8">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Main HR Report Data Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                onClick={() => handleSort('employee_name')}
              >
                Employee Name {renderSortIcon('employee_name')}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                onClick={() => handleSort('department_name')}
              >
                Department Name {renderSortIcon('department_name')}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                onClick={() => handleSort('email')}
              >
                Email {renderSortIcon('email')}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                onClick={() => handleSort('basic_salary')}
              >
                Basic Salary {renderSortIcon('basic_salary')}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                onClick={() => handleSort('bonus')}
              >
                Bonus {renderSortIcon('bonus')}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                onClick={() => handleSort('attendance_date')}
              >
                Attendance Date {renderSortIcon('attendance_date')}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-[var(--muted-foreground)]"
                >
                  Empty
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    {row.employee_name}
                  </TableCell>
                  <TableCell>{row.department_name || '—'}</TableCell>
                  <TableCell className="text-xs text-[var(--muted-foreground)] font-mono">
                    {row.email || '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrencyDetailed(row.basic_salary)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-[var(--muted-foreground)]">
                    {row.bonus !== null ? formatCurrencyDetailed(row.bonus) : '—'}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatDate(row.attendance_date)}
                  </TableCell>
                  <TableCell>
                    {row.status ? <Badge status={row.status} /> : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <Select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="h-7 w-16 text-xs"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Select>
          <span>
            Total: <strong className="text-[var(--foreground)] font-semibold">{total}</strong> rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              aria-label="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

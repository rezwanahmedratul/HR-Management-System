'use client';

import * as React from 'react';
import { Plus, Search, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';
import { Attendance, Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
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
import { formatDate } from '@/lib/utils';

export default function AttendancePage() {
  const [attendances, setAttendances] = React.useState<Attendance[]>([]);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Filters
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingAtt, setEditingAtt] = React.useState<Attendance | null>(null);
  const [formEmpId, setFormEmpId] = React.useState<number | ''>('');
  const [formDate, setFormDate] = React.useState('');
  const [formStatus, setFormStatus] = React.useState<'Present' | 'Absent' | 'Leave'>('Present');

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [attRes, empRes] = await Promise.all([
        api.attendance.getAll({
          from: fromDate || undefined,
          to: toDate || undefined,
          status: statusFilter || undefined,
        }),
        api.employees.getAll(),
      ]);
      setAttendances(attRes);
      setEmployees(empRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, statusFilter]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAdd = () => {
    setEditingAtt(null);
    setFormEmpId(employees.length > 0 ? employees[0].employee_id : '');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStatus('Present');
    setDialogOpen(true);
  };

  const handleOpenEdit = (a: Attendance) => {
    setEditingAtt(a);
    setFormEmpId(a.employee_id);
    setFormDate(a.attendance_date.split('T')[0]);
    setFormStatus(a.status as any);
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmpId || !formDate || !formStatus) return;

    try {
      const payload = {
        employee_id: Number(formEmpId),
        attendance_date: formDate,
        status: formStatus,
      };

      if (editingAtt) {
        await api.attendance.update(editingAtt.attendance_id, payload);
      } else {
        await api.attendance.create(payload);
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.attendance.delete(deletingId);
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setFromDate('');
    setToDate('');
  };

  const filtered = attendances.filter(
    (a) =>
      (a.employee_name &&
        a.employee_name.toLowerCase().includes(search.toLowerCase())) ||
      (a.department_name &&
        a.department_name.toLowerCase().includes(search.toLowerCase())) ||
      String(a.employee_id).includes(search),
  );

  return (
    <div className="space-y-4">
      {/* Filters & Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-xs"
            />
          </div>

          <div className="w-32">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 text-xs"
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </Select>
          </div>

          <div className="w-32">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-8 text-xs"
              aria-label="From Date"
            />
          </div>

          <div className="w-32">
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-8 text-xs"
              aria-label="To Date"
            />
          </div>

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

        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 h-8">
          <Plus className="w-3.5 h-3.5" />
          Log Attendance
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-[var(--muted-foreground)]">
                  Empty
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a.attendance_id}>
                  <TableCell className="font-mono text-xs">{a.attendance_id}</TableCell>
                  <TableCell className="font-medium">
                    {a.employee_name || `#${a.employee_id}`}
                  </TableCell>
                  <TableCell>{a.department_name || '—'}</TableCell>
                  <TableCell className="font-mono text-xs">{formatDate(a.attendance_date)}</TableCell>
                  <TableCell>
                    <Badge status={a.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(a)}
                        className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(a.attendance_id);
                          setDeleteOpen(true);
                        }}
                        className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingAtt ? 'Edit Attendance' : 'Log Attendance'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
              Employee
            </label>
            <Select
              value={formEmpId}
              onChange={(e) => setFormEmpId(Number(e.target.value))}
              required
            >
              {employees.map((e) => (
                <option key={e.employee_id} value={e.employee_id}>
                  {e.employee_name} (#{e.employee_id})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
              Date
            </label>
            <Input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
              Status
            </label>
            <Select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as any)}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Attendance Record"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Are you sure you want to delete this attendance record?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDelete}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

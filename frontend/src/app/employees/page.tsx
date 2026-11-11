'use client';

import * as React from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Employee, Department } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingEmp, setEditingEmp] = React.useState<Employee | null>(null);
  const [formName, setFormName] = React.useState('');
  const [formDept, setFormDept] = React.useState<number | ''>('');
  const [formEmail, setFormEmail] = React.useState('');

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        api.employees.getAll(),
        api.departments.getAll(),
      ]);
      setEmployees(empRes);
      setDepartments(deptRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setFormName('');
    setFormDept('');
    setFormEmail('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setFormName(emp.employee_name);
    setFormDept(emp.department_id ?? '');
    setFormEmail(emp.email ?? '');
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      const payload = {
        employee_name: formName.trim(),
        department_id: formDept === '' ? null : Number(formDept),
        email: formEmail.trim() || null,
      };

      if (editingEmp) {
        await api.employees.update(editingEmp.employee_id, payload);
      } else {
        await api.employees.create(payload);
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
      await api.employees.delete(deletingId);
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      (e.email && e.email.toLowerCase().includes(search.toLowerCase())) ||
      (e.department_name &&
        e.department_name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
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
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-[var(--muted-foreground)]">
                  Empty
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((emp) => (
                <TableRow key={emp.employee_id}>
                  <TableCell className="font-mono text-xs">{emp.employee_id}</TableCell>
                  <TableCell className="font-medium">{emp.employee_name}</TableCell>
                  <TableCell>{emp.department_name || '—'}</TableCell>
                  <TableCell className="text-[var(--muted-foreground)] text-xs">
                    {emp.email || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(emp)}
                        className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(emp.employee_id);
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
        title={editingEmp ? 'Edit Employee' : 'Add Employee'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
              Full Name
            </label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Alice Smith"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
              Department
            </label>
            <Select
              value={formDept}
              onChange={(e) =>
                setFormDept(e.target.value ? Number(e.target.value) : '')
              }
            >
              <option value="">None</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
              Email
            </label>
            <Input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="e.g. alice@company.com"
            />
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
        title="Delete Employee"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Are you sure? This will remove the employee and associated records.
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

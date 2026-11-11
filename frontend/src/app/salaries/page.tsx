'use client';

import * as React from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Salary, Employee } from '@/types';
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
import { formatCurrencyDetailed } from '@/lib/utils';

export default function SalariesPage() {
  const [salaries, setSalaries] = React.useState<Salary[]>([]);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingSalary, setEditingSalary] = React.useState<Salary | null>(null);
  const [formEmpId, setFormEmpId] = React.useState<number | ''>('');
  const [formBasic, setFormBasic] = React.useState('');
  const [formBonus, setFormBonus] = React.useState('');

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [salRes, empRes] = await Promise.all([
        api.salaries.getAll(),
        api.employees.getAll(),
      ]);
      setSalaries(salRes);
      setEmployees(empRes);
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
    setEditingSalary(null);
    setFormEmpId(employees.length > 0 ? employees[0].employee_id : '');
    setFormBasic('');
    setFormBonus('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (s: Salary) => {
    setEditingSalary(s);
    setFormEmpId(s.employee_id);
    setFormBasic(String(s.basic_salary));
    setFormBonus(s.bonus !== null ? String(s.bonus) : '');
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmpId || !formBasic) return;

    try {
      const payload = {
        employee_id: Number(formEmpId),
        basic_salary: parseFloat(formBasic),
        bonus: formBonus ? parseFloat(formBonus) : null,
      };

      if (editingSalary) {
        await api.salaries.update(editingSalary.salary_id, payload);
      } else {
        await api.salaries.create(payload);
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
      await api.salaries.delete(deletingId);
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = salaries.filter(
    (s) =>
      (s.employee_name &&
        s.employee_name.toLowerCase().includes(search.toLowerCase())) ||
      (s.department_name &&
        s.department_name.toLowerCase().includes(search.toLowerCase())) ||
      String(s.employee_id).includes(search),
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search salaries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Salary
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
              <TableHead className="text-right">Basic Salary</TableHead>
              <TableHead className="text-right">Bonus</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-[var(--muted-foreground)]">
                  Empty
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.salary_id}>
                  <TableCell className="font-mono text-xs">{s.salary_id}</TableCell>
                  <TableCell className="font-medium">
                    {s.employee_name || `#${s.employee_id}`}
                  </TableCell>
                  <TableCell>{s.department_name || '—'}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrencyDetailed(s.basic_salary)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-[var(--muted-foreground)]">
                    {s.bonus !== null ? formatCurrencyDetailed(s.bonus) : '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatCurrencyDetailed(s.total_compensation)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(s.salary_id);
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
        title={editingSalary ? 'Edit Salary' : 'Add Salary'}
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
              Basic Salary ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={formBasic}
              onChange={(e) => setFormBasic(e.target.value)}
              placeholder="e.g. 60000.00"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase">
              Bonus ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={formBonus}
              onChange={(e) => setFormBonus(e.target.value)}
              placeholder="e.g. 5000.00"
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
        title="Delete Salary"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Are you sure you want to delete this salary record?
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

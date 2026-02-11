'use client';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
import { PageHeader } from '@/src/component/common/PageHeader';
import { DataTable } from '@/src/component/common/DataTable';
import { SearchInput } from '@/src/component/common/SearchInput';
import { ConfirmDialog } from '@/src/component/common/ConfirmDialog';
import { EmptyState } from '@/src/component/common/EmptyState';
import { EmployeeModal } from '@/src/component/employees/Employee-Modal';
import { Button } from '@/components/ui/button';
import { mockEmployees } from '@/src/mockdata/mockdata';
import { Employee } from '@/src/types/index';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) )
      // emp.position.toLowerCase().includes(query)
    
  }, [employees, searchQuery]);

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (selectedEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee.id ? { ...employeeData, id: emp.id } : emp
      ));
    } else {
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now(),
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteEmployee) {
      setEmployees(prev => prev.filter(emp => emp.id !== deleteEmployee.id));
      setDeleteEmployee(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Employee',
      render: (emp: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {emp.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{emp.name}</p>
            <p className="text-sm text-muted-foreground">{emp.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (emp: Employee) => (
        <span className="text-foreground">{emp.department}</span>
      ),
    },
    // {
    //   key: 'position',
    //   header: 'Position',
    //   render: (emp: Employee) => (
    //     <span className="text-muted-foreground">{emp.position}</span>
    //   ),
    // },
    {
      key: 'dateOfBirth',
      header: 'Birthday',
      render: (emp: Employee) => (
        <span className="text-muted-foreground">
          {format(new Date(emp.dateOfBirth), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (emp: Employee) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditEmployee(emp);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteEmployee(emp);
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Employees"
        subtitle={`Manage your team of ${employees.length} employees`}
        actions={
          <Button onClick={handleCreateEmployee} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        }
      />

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search employees by name, email, department..."
        />
      </div>

      {filteredEmployees.length > 0 ? (
        <DataTable
          data={filteredEmployees}
          columns={columns}
        />
      ) : (
        <EmptyState
          icon={Users}
          title="No employees found"
          description={searchQuery ? 'Try adjusting your search query' : 'Get started by adding your first employee'}
          action={!searchQuery ? { label: 'Add Employee', onClick: handleCreateEmployee } : undefined}
        />
      )}

      <EmployeeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />

      <ConfirmDialog
        open={!!deleteEmployee}
        onOpenChange={(open) => !open && setDeleteEmployee(null)}
        title="Delete Employee"
        description={`Are you sure you want to delete ${deleteEmployee?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
}

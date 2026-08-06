


// 'use client';
// import { Plus, Edit2, Trash2, Users } from 'lucide-react';
// import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
// import { PageHeader } from '@/src/component/common/PageHeader';
// import { DataTable } from '@/src/component/common/DataTable';
// import { SearchInput } from '@/src/component/common/SearchInput';
// import { ConfirmDialog } from '@/src/component/common/ConfirmDialog';
// import { EmptyState } from '@/src/component/common/EmptyState';
// import { EmployeeModal } from '@/src/component/employees/Employee-Modal';
// import { Button } from '@/components/ui/button';
// import { mockEmployees } from '@/src/mockdata/mockdata';
// import { Employee } from '@/src/types/index';
// import { format } from 'date-fns';
// import { useMemo, useState } from 'react';

// export default function Employees() {
//   const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

//   const filteredEmployees = useMemo(() => {
//     if (!searchQuery) return employees;
//     const query = searchQuery.toLowerCase();
//     return employees.filter(emp =>
//       emp.name.toLowerCase().includes(query) ||
//       emp.email.toLowerCase().includes(query) ||
//       emp.department.toLowerCase().includes(query) )
//       // emp.position.toLowerCase().includes(query)

//   }, [employees, searchQuery]);

//   const handleCreateEmployee = () => {
//     setSelectedEmployee(null);
//     setIsModalOpen(true);
//   };

//   const handleEditEmployee = (employee: Employee) => {
//     setSelectedEmployee(employee);
//     setIsModalOpen(true);
//   };

//   const handleSaveEmployee = (employeeData: Omit<Employee, 'id'>) => {
//     if (selectedEmployee) {
//       setEmployees(prev => prev.map(emp =>
//         emp.id === selectedEmployee.id ? { ...employeeData, id: emp.id } : emp
//       ));
//     } else {
//       const newEmployee: Employee = {
//         ...employeeData,
//         id: Date.now(),
//       };
//       setEmployees(prev => [...prev, newEmployee]);
//     }
//     setIsModalOpen(false);
//   };

//   const handleDeleteConfirm = () => {
//     if (deleteEmployee) {
//       setEmployees(prev => prev.filter(emp => emp.id !== deleteEmployee.id));
//       setDeleteEmployee(null);
//     }
//   };

//   const columns = [
//     {
//       key: 'name',
//       header: 'Employee',
//       render: (emp: Employee) => (
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//             <span className="text-sm font-medium text-primary">
//               {emp.name.split(' ').map(n => n[0]).join('')}
//             </span>
//           </div>
//           <div>
//             <p className="font-medium text-foreground">{emp.name}</p>
//             <p className="text-sm text-muted-foreground">{emp.email}</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: 'department',
//       header: 'Department',
//       render: (emp: Employee) => (
//         <span className="text-foreground">{emp.department}</span>
//       ),
//     },
//     // {
//     //   key: 'position',
//     //   header: 'Position',
//     //   render: (emp: Employee) => (
//     //     <span className="text-muted-foreground">{emp.position}</span>
//     //   ),
//     // },
//     {
//       key: 'dateOfBirth',
//       header: 'Birthday',
//       render: (emp: Employee) => (
//         <span className="text-muted-foreground">
//           {format(new Date(emp.dateOfBirth), 'MMM d, yyyy')}
//         </span>
//       ),
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       className: 'text-right',
//       render: (emp: Employee) => (
//         <div className="flex items-center justify-end gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEditEmployee(emp);
//             }}
//             className="text-muted-foreground hover:text-foreground"
//           >
//             <Edit2 className="w-4 h-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={(e) => {
//               e.stopPropagation();
//               setDeleteEmployee(emp);
//             }}
//             className="text-muted-foreground hover:text-destructive"
//           >
//             <Trash2 className="w-4 h-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Employees"
//         subtitle={`Manage your team of ${employees.length} employees`}
//         actions={
//           <Button onClick={handleCreateEmployee} className="btn-primary">
//             <Plus className="w-4 h-4" />
//             Add Employee
//           </Button>
//         }
//       />

//       <div className="mb-6">
//         <SearchInput
//           value={searchQuery}
//           onChange={setSearchQuery}
//           placeholder="Search employees by name, email, department..."
//         />
//       </div>

//       {filteredEmployees.length > 0 ? (
//         <DataTable
//           data={filteredEmployees}
//           columns={columns}
//         />
//       ) : (
//         <EmptyState
//           icon={Users}
//           title="No employees found"
//           description={searchQuery ? 'Try adjusting your search query' : 'Get started by adding your first employee'}
//           action={!searchQuery ? { label: 'Add Employee', onClick: handleCreateEmployee } : undefined}
//         />
//       )}

//       <EmployeeModal
//         open={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         employee={selectedEmployee}
//         onSave={handleSaveEmployee}
//       />

//       <ConfirmDialog
//         open={!!deleteEmployee}
//         onOpenChange={(open) => !open && setDeleteEmployee(null)}
//         title="Delete Employee"
//         description={`Are you sure you want to delete ${deleteEmployee?.name}? This action cannot be undone.`}
//         confirmLabel="Delete"
//         variant="destructive"
//         onConfirm={handleDeleteConfirm}
//       />
//     </DashboardLayout>
//   );
// }

// "use client";

// import { useState } from "react";
// import { format } from "date-fns";
// import { Plus, Edit2, Trash2, Users, UserRoundPlus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { DashboardLayout } from "@/src/component/Layout/DashboardLayout";
// import { PageHeader } from "@/src/component/common/PageHeader";
// import { DataTable } from "@/src/component/common/DataTable";
// import { SearchInput } from "@/src/component/common/SearchInput";
// import { ConfirmDialog } from "@/src/component/common/ConfirmDialog";
// import { EmptyState } from "@/src/component/common/EmptyState";
// import { Employee } from "@/src/types";
// import {
//   useEmployees,
//   useDeleteEmployee,
//   useCreateEmployee,
//   useUpdateEmployee,
// } from "@/src/hooks/useEmployeeAPI";
// import { useDebounce } from "@/src/hooks/useDebounce";
// import { EmployeeModal } from "@/src/component/employees/Employee-Modal";
// import { AppButton } from "@/src/component/common/AppButton";

// export default function Employees() {
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
//     null,
//   );

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const debouncedSearch = useDebounce(search, 500);

//   const { data, isLoading } = useEmployees(debouncedSearch, page);
//   const deleteMutation = useDeleteEmployee();
//   const createMutation = useCreateEmployee();
//   const updateMutation = useUpdateEmployee();

//   const employees = data?.data || [];
//   const meta = data?.meta;

//   const handleDelete = async () => {
//     if (!deleteEmployee) return;
//     await deleteMutation.mutateAsync(deleteEmployee.id);
//     setDeleteEmployee(null);
//   };

//   const handleSaveEmployee = async (formData: any) => {
//     if (selectedEmployee) {
//       await updateMutation.mutateAsync({
//         id: selectedEmployee.id,
//         ...formData,
//       });
//     } else {
//       await createMutation.mutateAsync(formData);
//     }

//     setIsModalOpen(false);
//     setSelectedEmployee(null);
//   };

//   const columns = [
//     {
//       key: "name",
//       header: "Employee",
//       render: (emp: Employee) => (
//         <div>
//           <p className="font-medium">{emp.name}</p>
//           <p className="text-sm text-muted-foreground">{emp.email}</p>
//         </div>
//       ),
//     },
//     {
//       key: "department",
//       header: "Department",
//     },
//     {
//       key: "dob",
//       header: "Birthday",
//       render: (emp: Employee) => format(new Date(emp.dob), "MMM d, yyyy"),
//     },
//     {
//       key: "actions",
//       header: "Actions",
//       render: (emp: Employee) => (
//         <div className="flex gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => {
//               setSelectedEmployee(emp);
//               setIsModalOpen(true);
//             }}
//           >
//             <Edit2 className="w-4 h-4" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setDeleteEmployee(emp)}
//           >
//             <Trash2 className="w-4 h-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Employees"
//         subtitle={`Manage your Team of ${meta?.total || 0} Employees`}
//         actions={
//           // <Button
//           //   onClick={() => {
//           //     setSelectedEmployee(null);
//           //     setIsModalOpen(true);
//           //   }}
//           // >
//           //   <Plus className="w-4 h-4 mr-2" />
//           //   Add Employee
//           // </Button>
//           <AppButton
//             onClick={() => {
//               setSelectedEmployee(null);
//               setIsModalOpen(true);
//             }}
//             icon={<UserRoundPlus className="w-8 h-8"  size={25} />}
//           >
//             Add Employee
//           </AppButton>
//         }
//       />

//       <div className="mb-6">
//         <SearchInput
//           value={search}
//           onChange={(val) => {
//             setSearch(val);
//             setPage(1);
//           }}
//           placeholder="Search employees..."
//         />
//       </div>

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : employees.length ? (
//         <>
//           <DataTable data={employees} columns={columns} />

//           <div className="flex justify-between items-center mt-6">
//             <Button
//               disabled={page === 1}
//               onClick={() => setPage((prev) => prev - 1)}
//             >
//               Previous
//             </Button>

//             <span>
//               Page {meta?.page} of {meta?.totalPages}
//             </span>

//             <Button
//               disabled={page === meta?.totalPages}
//               onClick={() => setPage((prev) => prev + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       ) : (
//         <EmptyState
//           icon={Users}
//           title="No employees found"
//           description="Try adjusting your search"
//         />
//       )}

//       <ConfirmDialog
//         open={!!deleteEmployee}
//         onOpenChange={() => setDeleteEmployee(null)}
//         title="Delete Employee"
//         description={`Are you sure you want to delete ${deleteEmployee?.name}?`}
//         confirmLabel="Delete"
//         variant="destructive"
//         onConfirm={handleDelete}
//       />

//       {/* ✅ Employee Modal */}
//       <EmployeeModal
//         open={isModalOpen}
//         onOpenChange={(open) => {
//           setIsModalOpen(open);
//           if (!open) setSelectedEmployee(null);
//         }}
//         employee={selectedEmployee}
//         onSave={() => {}} // you don’t need this actually, modal handles saving internally
//       />
//     </DashboardLayout>
//   );
// }



"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Users, UserRoundPlus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/src/component/Layout/DashboardLayout";
import { PageHeader } from "@/src/component/common/PageHeader";
import { DataTable } from "@/src/component/common/DataTable";
import { SearchInput } from "@/src/component/common/SearchInput";
import { ConfirmDialog } from "@/src/component/common/ConfirmDialog";
import { EmptyState } from "@/src/component/common/EmptyState";
import { Employee } from "@/src/types";
import {
  useEmployees,
  useDeleteEmployee,
  useCreateEmployee,
} from "@/src/hooks/useEmployeeAPI";
import { useDebounce } from "@/src/hooks/useDebounce";

import { AppButton } from "@/src/component/common/AppButton";
import { EmployeeModal } from "@/src/component/employees/Employee-Modal";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader } from "@/src/component/common/Loader";


export default function Employees() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useEmployees(debouncedSearch, page);
  const deleteMutation = useDeleteEmployee();
  const createMutation = useCreateEmployee();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const employees: Employee[] = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = async () => {
    if (!deleteEmployee) return;
    await deleteMutation.mutateAsync(deleteEmployee.id);
    setDeleteEmployee(null);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .filter(Boolean);

    if (lines.length < 2) {
      window.alert("CSV file must include a header row and at least one employee record.");
      event.target.value = "";
      return;
    }

    // Parse CSV header more robustly
    const headerLine = lines[0];
    const header = headerLine
      .split(",")
      .map((col) => col.trim().toLowerCase());

    console.log("Found headers:", header);

    const requiredHeaders = ["name", "email", "department", "dob"];
    const missingHeaders = requiredHeaders.filter(
      (required) => !header.includes(required),
    );

    if (missingHeaders.length) {
      window.alert(
        `CSV is missing required columns.\n\nFound: ${header.join(", ")}\n\nRequired: ${requiredHeaders.join(", ")}\n\nMissing: ${missingHeaders.join(", ")}`,
      );
      event.target.value = "";
      return;
    }

    const importedRows = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return header.reduce<Record<string, string>>((row, key, index) => {
        row[key] = values[index] ?? "";
        return row;
      }, {});
    });

    const createdEmployees = [];
    const failedRows: string[] = [];

    for (const row of importedRows) {
      const name = row.name?.trim();
      const email = row.email?.trim();
      const department = row.department?.trim();
      const dob = row.dob?.trim();
      const role = row.role?.trim().toUpperCase() || "USER";
      const password = row.password?.trim() || undefined;

      if (!name || !email || !department || !dob) {
        failedRows.push(JSON.stringify(row));
        continue;
      }

      const parsedDob = new Date(dob);
      if (isNaN(parsedDob.getTime())) {
        failedRows.push(JSON.stringify(row));
        continue;
      }

      try {
        await createMutation.mutateAsync({
          name,
          email,
          department,
          dob: parsedDob,
          role,
          password,
        });
        createdEmployees.push(name);
      } catch (error) {
        failedRows.push(name || JSON.stringify(row));
      }
    }

    const summary = [];
    if (createdEmployees.length) {
      summary.push(`${createdEmployees.length} employee(s) imported successfully.`);
    }
    if (failedRows.length) {
      summary.push(`${failedRows.length} row(s) failed to import.`);
    }

    if (summary.length) {
      window.alert(summary.join(" "));
    }

    event.target.value = "";
  };

  const escapeCsvValue = (value: string | number | undefined | null) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const handleExport = () => {
    const headers = ["Name", "Email", "Department", "Role", "Birthday"];
    const rows: string[][] = employees.map((emp: Employee) => [
      escapeCsvValue(emp.name),
      escapeCsvValue(emp.email),
      escapeCsvValue(emp.department),
      escapeCsvValue(emp.role),
      escapeCsvValue(emp.dob ? format(new Date(emp.dob), "yyyy-MM-dd") : ""),
    ]);

    const csv = [headers.join(","), ...rows.map((row: string[]) => row.join(","))].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "employees.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: "no",
      header: "No",
      render: (_: Employee, index: number) => (
        <span className="text-muted-foreground">
          {(page - 1) * (meta?.limit ?? 10) + index + 1}
        </span>
      ),
    },
    {
      key: "name",
      header: "Employee",
      render: (emp: Employee) => (
        <div>
          <p className="font-medium">{emp.name}</p>
          <p className="text-sm text-muted-foreground">{emp.email}</p>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
    },
    {
      key: "role",
      header: "Role",
      render: (emp: Employee) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            emp.role === "ADMIN"
              ? "bg-red-100 text-[#CE1B22]"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {emp.role || "USER"}
        </span>
      ),
    },
    {
      key: "dob",
      header: "Birthday",
      render: (emp: Employee) =>
        emp.dob ? format(new Date(emp.dob), "MMM d, yyyy") : "—",
    },
    {
      key: "actions",
      header: "Actions",
      render: (emp: Employee) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEmployee(emp);
              setIsModalOpen(true);
            }}
             className="text-[#CE1B22] hover:text-[#CE1B22] hover:bg-red-100"
           >
             <Edit2 className="w-4 h-4" />
           </Button>

           <Button
             variant="ghost"
             size="sm"
             onClick={() => setDeleteEmployee(emp)}
             className="text-[#CE1B22] hover:text-[#CE1B22] hover:bg-red-100"
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
        subtitle={`Manage your Team of ${meta?.total ?? 0} Employees`}
        actions={
          <div className="flex flex-wrap gap-2">
            <AppButton
              onClick={() => {
                setSelectedEmployee(null);
                setIsModalOpen(true);
              }}
              icon={<UserRoundPlus size={20} />}
            >
              Add Employee
            </AppButton>
            <Button variant="outline" size="sm" onClick={handleImportClick}>
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleImportFile}
      />

      <div className="mb-6">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search employees..."
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-100">
          <Loader />
        </div>
      ) : employees.length ? (
        <>
          <DataTable data={employees} columns={columns} />

          {/* <div className="flex justify-end items-center mt-6">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <span>
              Page {meta?.page} of {meta?.totalPages}
            </span>

            <Button
              disabled={page === meta?.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div> */}

          {/* <div className="flex justify-end mt-6">
  <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-md px-3 py-2">

    <Button
      size="sm"
      variant="ghost"
      disabled={page === 1}
      onClick={() => setPage((prev) => prev - 1)}
    >
      ←
    </Button>

    {[...Array(meta?.totalPages || 1)].map((_, i) => {
      const pageNumber = i + 1;
      return (
        <button
          key={pageNumber}
          onClick={() => setPage(pageNumber)}
          className={`px-3 py-1 text-sm rounded-md transition
            ${
              page === pageNumber
                ? "bg-black text-white"
                : "hover:bg-gray-100 text-gray-600"
            }`}
        >
          {pageNumber}
        </button>
      );
    })}

    <Button
      size="sm"
      variant="ghost"
      disabled={page === meta?.totalPages}
      onClick={() => setPage((prev) => prev + 1)}
    >
      →
    </Button>
  </div>
</div> */}

          {/* Shadcn Pagination */}
          {/* Shadcn Pagination */}
          <div className="flex justify-end mt-6">
            <Pagination>
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page === 1) return;
                      setPage(page - 1);
                    }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {[...Array(meta?.totalPages || 1)].map((_, i) => {
                  const pageNumber = i + 1;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* Optional Ellipsis (only visual, not functional here) */}
                {meta?.totalPages && meta.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page === meta?.totalPages) return;
                      setPage(page + 1);
                    }}
                    className={
                      page === meta?.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="No employees found"
          description="Try adjusting your search"
        />
      )}

      {/* <ConfirmDialog
        open={!!deleteEmployee}
        onOpenChange={() => setDeleteEmployee(null)}
        title="Delete Employee"
        description={`Are you sure you want to delete ${deleteEmployee?.name}?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      /> */}
      <ConfirmDialog
        open={!!deleteEmployee}
        onOpenChange={() => setDeleteEmployee(null)}
        title="Delete Employee"
        description={`Are you sure you want to delete ${deleteEmployee?.name}?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <EmployeeModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />
    </DashboardLayout>
  );
}
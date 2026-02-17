// 'use client';
// import { useState, useEffect } from 'react';
// import { Employee } from '@/src/types';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// import { useEmployeeForm } from '@/src/hooks/useEmployees';
// import { useCreateEmployee, useUpdateEmployee } from '@/src/hooks/useEmployeeAPI';

// interface EmployeeModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   employee: Employee | null;
//   // onSave: (employee: Omit<Employee, 'id'>) => void;
// }

// const initialFormData = {
//   name: '',
//   email: '',
//   department: '',
//   position: '',
//   dateOfBirth: '',
//   joinDate: '',
//   phone: '',
// };

// export const EmployeeModal = ({ open, onOpenChange, employee }: EmployeeModalProps) => {
//   // const [formData, setFormData] = useState(initialFormData);
//   const { formData, handleChange } = useEmployeeForm(employee);
//   // const { addEmployee, updateEmployee } = useEmployees();
//   // ✅ Correct usage
//   const { mutateAsync: createEmployee, isPending: isCreating } =
//     useCreateEmployee();

//   const { mutateAsync: updateEmployee, isPending: isUpdating } =
//     useUpdateEmployee();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (employee) await updateEmployee({
//   id: employee.id,
//   data: formData,
// });

//     else await createEmployee(formData);
//     onOpenChange(false);
//   };


//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="bg-card max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {employee ? 'Edit Employee' : 'Add New Employee'}
//           </DialogTitle>
//         </DialogHeader>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-2 space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="John Doe"
//                 required
//               />
//             </div>

//             <div className="col-span-2 space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleChange('email', e.target.value)}
//                 placeholder="john@company.com"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="department">Department</Label>
//               <Input
//                 id="department"
//                 value={formData.department}
//                 onChange={(e) => handleChange('department', e.target.value)}
//                 placeholder="Engineering"
//                 required
//               />
//             </div>

//             {/* <div className="space-y-2">
//               <Label htmlFor="position">Position</Label>
//               <Input
//                 id="position"
//                 value={formData.position}
//                 onChange={(e) => handleChange('position', e.target.value)}
//                 placeholder="Developer"
//                 required
//               />
//             </div> */}

//             <div className="space-y-2">
//               <Label htmlFor="dateOfBirth">Date of Birth</Label>
//               <Input
//                 id="dateOfBirth"
//                 type="date"
//                 value={formData.dob}
//                 onChange={(e) => handleChange('dob', e.target.value)}
//                 required
//               />
//             </div>

//             {/* <div className="space-y-2">
//               <Label htmlFor="joinDate">Join Date</Label>
//               <Input
//                 id="joinDate"
//                 type="date"
//                 value={formData.joinDate}
//                 onChange={(e) => handleChange('joinDate', e.target.value)}
//                 required
//               />
//             </div> */}

//             {/* <div className="col-span-2 space-y-2">
//               <Label htmlFor="phone">Phone</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) => handleChange('phone', e.target.value)}
//                 placeholder="+1 234 567 8900"
//               />
//             </div> */}
//           </div>

//           <div className="flex justify-end gap-3 pt-4">
//             <Button 
//               type="button" 
//               variant="outline" 
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" className="btn-primary">
//               {employee ? 'Save Changes' : 'Add Employee'}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import { Employee } from "@/src/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEmployeeForm } from "@/src/hooks/useEmployees";
import {
  useCreateEmployee,
  useUpdateEmployee,
} from "@/src/hooks/useEmployeeAPI";

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export const EmployeeModal = ({
  open,
  onOpenChange,
  employee,
}: EmployeeModalProps) => {
  const { formData, handleChange } = useEmployeeForm(employee);

  const { mutateAsync: createEmployee, isPending: isCreating } =
    useCreateEmployee();

  const { mutateAsync: updateEmployee, isPending: isUpdating } =
    useUpdateEmployee();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (employee) {
      await updateEmployee({
        id: employee.id,
        ...formData, // ✅ matches updated mutation
      });
    } else {
      await createEmployee(formData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name ?? ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email ?? ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department ?? ""}
                onChange={(e) =>
                  handleChange("department", e.target.value)
                }
                placeholder="Engineering"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob ?? ""}
                onChange={(e) =>
                  handleChange("dob", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : employee
                ? "Save Changes"
                : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
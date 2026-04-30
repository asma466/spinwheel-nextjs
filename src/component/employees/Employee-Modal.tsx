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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { selectItemStyle } from "@/src/types/className";
import { PasswordField } from "../common/Password";


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

  const { formData, handleChange , setFormData } = useEmployeeForm(employee);

  const { mutateAsync: createEmployee, isPending: isCreating } =
    useCreateEmployee();

  const { mutateAsync: updateEmployee, isPending: isUpdating } =
    useUpdateEmployee();
const [showPassword, setShowPassword] = useState(false);
  const isSubmitting = isCreating || isUpdating;

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (employee) {
  //     await updateEmployee({
  //       id: employee.id,
  //       ...formData, // ✅ matches updated mutation
  //     });
  //   } else {
  //     await createEmployee(formData);
  //   }

  //   onOpenChange(false);
  // };

  //  const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Basic validation for ADMIN
  //   if (formData.role === "ADMIN" && !formData.password && !employee) {
  //     alert("Password is required for Admin");
  //     return;
  //   }

  //   if (employee) {
  //     await updateEmployee({
  //       id: employee.id,
  //       ...formData,
  //     });
  //   } else {
  //     await createEmployee(formData);
  //   }

  //   onOpenChange(false);
  // };

   // ✅ Reset form when modal opens (important fix)
  useEffect(() => {
    if (open && !employee) {
      setFormData({
        name: "",
        email: "",
        department: "",
        dob: "",
        role: "USER", // ✅ default
        password: "",
      });
    }
  }, [open, employee, setFormData]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Check if user is logged in
    // const { data: session } = useSession();


    // // ADMIN password validation
    // if (formData.role === "ADMIN" && !formData.password && !employee) {
    //   alert("Password is required for Admin");
    //   return;
    // }

     // ADMIN password validation
  // if (formData.role === "ADMIN" && !formData.password && !employee) {
  //   toast.error("Password is required for Admin");
  //   return;
  // }

if (!employee && formData.role !== "ADMIN" && !formData.password) {
  toast.error("Password is required");
  return;
}

    // try {
    //   if (employee) {
    //     await updateEmployee({ id: employee.id, ...formData });
    //   } else {
    //     await createEmployee(formData);
    //   }
    //   onOpenChange(false);
    // } catch (err: any) {
    //   alert(err?.response?.data?.message || "Error creating employee");
    // }  
     try {
    if (employee) {
      await updateEmployee({ id: employee.id, ...formData });
      toast.success("Employee updated successfully ✅");
    } else {
      await createEmployee(formData);
      toast.success("Employee created successfully 🎉");
    }

    onOpenChange(false);
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Something went wrong ❌");
  }

  };

  // const showPasswordField =
  // formData.role === "ADMIN" &&
  // (!employee || employee?.isPasswordSet !== true);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md  border border-transparent shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#CE1B22]">
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
                // placeholder="John Doe"
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
                // placeholder="Enter email"
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
                // placeholder="Enter department"
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
            {/* Role */}
            {/* <div className="col-span-2 space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white 
             focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              >
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div> */}


            {/* Role */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="role">Role</Label>

              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger className="w-full border border-gray-300">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>

                {/* ✅ THIS is where your class goes */}
                <SelectContent className="hover:text-[#CE1B22]">
                  <SelectItem value="ADMIN"  
                className={selectItemStyle}
   >
                    Admin
                  </SelectItem>
                  <SelectItem value="USER"  className={selectItemStyle}>
                    User
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password (Only if ADMIN) */}
            {/* {formData.role === "ADMIN" && (
              <div className="col-span-2 space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required={!employee} // required only when creating
                />
              </div> */}
  {/* Password (ADMIN only, and not if already exists in edit mode) */}
{formData.role === "ADMIN" && (!employee || !employee.password) && (
  <div className="col-span-2 space-y-2 relative">
    
    <PasswordField
      label="Password"
      value={formData.password}
      onChange={(value) => handleChange("password", value)}
      placeholder="Enter password"
      showPassword={showPassword}
      toggleShow={() => setShowPassword(!showPassword)}
      required={!employee}
    />

  </div>
)}        
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
              // className="btn-primary"
              className="bg-[#CE1B22] hover:bg-[#CE1B22]"
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
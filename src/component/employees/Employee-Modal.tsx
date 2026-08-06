


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

  const { formData, handleChange, setFormData } = useEmployeeForm(employee);

  const { mutateAsync: createEmployee, isPending: isCreating } =
    useCreateEmployee();

  const { mutateAsync: updateEmployee, isPending: isUpdating } =
    useUpdateEmployee();
  const [showPassword, setShowPassword] = useState(false);
  const isSubmitting = isCreating || isUpdating;

const isPromotingToAdmin =
  employee?.role === "USER" &&
  formData.role === "ADMIN";

const showPasswordField =
  (!employee && formData.role === "ADMIN") ||
  isPromotingToAdmin;

  const getEmployeeFormData = (employee?: any) => ({
  name: employee?.name ?? "",
  email: employee?.email ?? "",
  department: employee?.department ?? "",
  dob: employee?.dob
    ? new Date(employee.dob).toISOString().split("T")[0]
    : "",
  role: employee?.role ?? "USER",
  password: "",
});
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
    if (open) {
      const nextFormData = getEmployeeFormData(employee);
      setFormData({
        ...nextFormData,
        role: nextFormData.role || "USER",
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
    //   toast.error("Password is required for Admin");
    //   return;
    // }

    // ADMIN password validation
    // if (!employee && formData.role === "ADMIN" && !formData.password) {
    //   toast.error("Password is required for Admin");
    //   return;
    // }

    const requiresPassword =
  (!employee && formData.role === "ADMIN") ||
  isPromotingToAdmin;

if (requiresPassword && !formData.password.trim()) {
  toast.error("Password is required for Admin");
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
        // await updateEmployee({ id: employee.id, ...formData });
        await updateEmployee({
          id: employee.id,
          ...formData,
          dob: new Date(formData.dob),
        });
        toast.success("Employee updated successfully ✅");
      } else {
        // await createEmployee(formData);
        // dob: new Date(formData.dob),
        await createEmployee({
          ...formData,
          dob: new Date(formData.dob),
        });
        toast.success("Employee created successfully 🎉");
      }

      onOpenChange(false);
    } catch (err: unknown) {
      // const message =
      //   err instanceof Error ? err.message : "Something went wrong while saving the employee";
      // toast.error(message);
      toast.error(`User "${formData.email}" already exists.`);
    }

  };

  // const showPasswordField =
  // formData.role === "ADMIN" &&
  // (!employee || employee?.isPasswordSet !== true);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md  border border-transparent shadow-xl ">

        <DialogHeader>
          <DialogTitle className="text-[#CE1B22]">
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" >
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
                  <SelectItem value="USER" className={selectItemStyle}>
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
            {/* Password only shown for ADMIN role */}
            {/* {formData.role === "ADMIN" && (
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
            )} */}

            {/* Password */}
{showPasswordField && (
  <div className="col-span-2 space-y-2">
    <PasswordField
      label="Password"
      value={formData.password}
      onChange={(value) => handleChange("password", value)}
      placeholder={
        employee
          ? "Set password for new Admin"
          : "Enter password"
      }
      showPassword={showPassword}
      toggleShow={() => setShowPassword(!showPassword)}
      required
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
              className="text-red-700 border-red-700 hover:text-red-800 hover:border-red-800 hover:bg-red-50"
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

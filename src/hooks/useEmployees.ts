// import { useState } from "react";
// import axios from "axios";
// import { Employee } from "@/src/types";

// interface CreateEmployeePayload {
//   name: string;
//   email: string;
//   department: string;
//   // position: string;
//   dateOfBirth: string;
//   // joinDate: string;
//   // phone: string;
// }

// export const useCreateEmployee = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const createEmployee = async (data: CreateEmployeePayload): Promise<Employee | null> => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post("/api/employees", data);
//       setLoading(false);

//       if (response.data.success) {
//         return response.data.employee; // Return created employee
//       } else {
//         setError(response.data.message || "Failed to create employee");
//         return null;
//       }
//     } catch (err: any) {
//       console.error("Create employee error:", err);
//       setError(err.response?.data?.message || err.message || "Something went wrong");
//       setLoading(false);
//       return null;
//     }
//   };

//   return { createEmployee, loading, error };
// }


import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/src/types';

interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  // position: string;
  dateOfBirth: string;
  // joinDate: string;
  // phone: string;
}

export const useEmployeeForm = (employee: Employee | null = null) => {
  const initialFormData: EmployeeFormData = {
    name: '',
    email: '',
    department: '',
  
    dateOfBirth: '',
    // joinDate: '',
    // phone: '',
  };

  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);

  // useEffect(() => {
  //   if (employee) setFormData({ ...employee });
  //   else setFormData(initialFormData);
  // }, [employee]);
  useEffect(() => {
  if (!employee) {
    setFormData(initialFormData);
    return;
  }

  setFormData({
    name: employee.name ?? '',
    email: employee.email ?? '',
    department: employee.department ?? '',

    dateOfBirth: employee.dateOfBirth ?? '',
  });
}, [employee]);


  const handleChange = useCallback((field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return { formData, handleChange, setFormData };
};

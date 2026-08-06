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


// import { useState, useEffect, useCallback } from 'react';
// import { Employee } from '@/src/types';

// interface EmployeeFormData {
//   name: string;
//   email: string;
//   department: string;
//   // position: string;
//   dob: string;
//   role: string;
//   // joinDate: string;
//   // phone: string;
// }

// export const useEmployeeForm = (employee: Employee | null = null) => {
//   const initialFormData: EmployeeFormData = {
//     name: '',
//     email: '',
//     department: '',
  
//     dob: '',
//       role: ''
//     // joinDate: '',
//     // phone: '',
//   };

//   const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);

//   // useEffect(() => {
//   //   if (employee) setFormData({ ...employee });
//   //   else setFormData(initialFormData);
//   // }, [employee]);
// //   useEffect(() => {
// //   if (!employee) {
// //     setFormData(initialFormData);
// //     return;
// //   }

// //   setFormData({
// //     name: employee.name ?? '',
// //     email: employee.email ?? '',
// //     department: employee.department ?? '',

// //     dob: employee.dob ?? '',
// //   });
// // }, [employee]);

//  useEffect(() => {
//     if (employee) {
//       setFormData({
//         name: employee.name ?? "",
//         email: employee.email ?? "",
//         department: employee.department ?? "",
//         dob: employee.dob
//           ? new Date(employee.dob).toISOString().split("T")[0]
//           : "",
//           role: employee.role ?? '', // ✅ FIXED
//       });
//     } else {
//       setFormData({
//         name: "",
//         email: "",
//         department: "",
//         dob: "",
//          role: '', 
//       });
//     }
//   }, [employee]);


//   const handleChange = useCallback((field: keyof EmployeeFormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   return { formData, handleChange, setFormData };
// };



// import { useState, useEffect, useCallback } from 'react';
// import { Employee } from '@/src/types';

// interface EmployeeFormData {
//   name: string;
//   email: string;
//   department: string;
//   dob: string;
//   role: string;
//   password?: string; 
// }

// const emptyForm: EmployeeFormData = {
//   name: '',
//   email: '',
//   department: '',
//   dob: '',
//   role: '',
//   password: ''
// };

// export const useEmployeeForm = (employee: Employee | null = null) => {
//   const [formData, setFormData] = useState<EmployeeFormData>(emptyForm);

//   // useEffect(() => {
//   //   if (!employee) {
//   //     setFormData(emptyForm);
//   //     return;
//   //   }

//   //   setFormData({
//   //     name: employee.name ?? '',
//   //     email: employee.email ?? '',
//   //     department: employee.department ?? '',
//   //     dob: employee.dob
//   //       ? new Date(employee.dob).toISOString().split('T')[0]
//   //       : '',
//   //     role: employee.role ?? '',
//   //   });
//   // }, [employee]);

//   useEffect(() => {
//   if (!employee) return setFormData(emptyForm);

//   const { name, email, department, dob, role } = employee;

//   setFormData({
//     name: name ?? '',
//     email: email ?? '',
//     department: department ?? '',
//     dob: dob ? new Date(dob).toISOString().split('T')[0] : '',
//     role: role ?? '',
//     password: '', // always empty for security
//   });
// }, [employee]);
//   // const handleChange = useCallback(
//   //   (field: keyof EmployeeFormData, value: string) => {
//   //     setFormData((prev) => ({ ...prev, [field]: value }));
//   //   },
//   //   []
//   // );


//     const handleChange = useCallback(
//     (field: keyof EmployeeFormData, value: string) => {
//       setFormData((prev) => {
//         if (field === "role" && value !== "ADMIN") {
//           return { ...prev, role: value, password: "" };
//         }
//         return { ...prev, [field]: value };
//       });
//     },
//     []
//   );
//   return { formData, handleChange, setFormData };
// };


'use client';

import { useState, useEffect, useCallback } from "react";
import { Employee } from "@/src/types";

interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  dob: string;
  role: "ADMIN" | "USER" | "";
  password: string;
}

const emptyForm: EmployeeFormData = {
  name: "",
  email: "",
  department: "",
  dob: "",
  role: "",
  password: "",
};

export const useEmployeeForm = (employee: Employee | null = null) => {
  const [formData, setFormData] = useState<EmployeeFormData>(emptyForm);

  useEffect(() => {
    if (!employee) {
      setFormData(emptyForm);
      return;
    }

    setFormData({
      name: employee.name ?? "",
      email: employee.email ?? "",
      department: employee.department ?? "",
      dob: employee.dob
        ? new Date(employee.dob).toISOString().split("T")[0]
        : "",
      role: (employee.role as "ADMIN" | "USER") ?? "",
      password: "", // never preload password
    });
  }, [employee]);

  const handleChange = useCallback(
    (field: keyof EmployeeFormData, value: string) => {
      setFormData((prev) => {
        // Clear password if switching away from ADMIN
        if (field === "role" && value !== "ADMIN") {
          return { ...prev, role: value as any, password: "" };
        }

        return { ...prev, [field]: value };
      });
    },
    []
  );

  return { formData, handleChange, setFormData };
};

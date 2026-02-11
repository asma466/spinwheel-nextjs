// 'use client'
// import { createContext, useContext, ReactNode } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { Employee } from '@/src/types';

// interface EmployeeContextType {
//   employees: Employee[];
//   isLoading: boolean;
//   error: string | null;
//   addEmployee: (data: Omit<Employee, 'id'>) => Promise<void>;
//   updateEmployee: (id: number, data: Partial<Employee>) => Promise<void>;
//   deleteEmployee: (id: number) => Promise<void>;
// }

// const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

// export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
//   const queryClient = useQueryClient();

//   // Fetch employees
//   const { data, isLoading, error } = useQuery<Employee[], Error>({
//     queryKey: ['employees'],
//     queryFn: async () => {
//       const res = await axios.get('/api/employees');
//       return res.data.employees;
//     },
//   });

//   // Add Employee
//   const addMutation = useMutation({
//     mutationFn: (data: Omit<Employee, 'id'>) => axios.post('/api/employees', data),
//  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
//   });

//   // Update Employee
//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }: { id: number; data: Partial<Employee> }) =>
//       axios.put(`/api/employees/${id}`, data),
//     // onSuccess: () => queryClient.invalidateQueries(['employees']),
//      onSuccess: () => {
//       // Invalidate the 'employees' query to refetch the list after a successful update
//       queryClient.invalidateQueries({ queryKey: ['employees'] });
//       // Optionally, you might want to invalidate a specific employee's query if you have one
//       // queryClient.invalidateQueries({ queryKey: ['employee', id] });
//       console.log('Employee updated successfully!');
//     },
//   });

//   // Delete Employee
//   const deleteMutation = useMutation({
//     mutationFn: (id: number) => axios.delete(`/api/employees/${id}`),
//      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
//   });

//   // const addEmployee = async (data: Omit<Employee, 'id'>) => addMutation.mutateAsync(data);
  
//   const addEmployee = async (data: Omit<Employee, 'id'>): Promise<void> => {
//   await addMutation.mutateAsync(data); // await and discard result
// };
// // const updateEmployee = async (id: number, data: Partial<Employee>) =>
// //     updateMutation.mutateAsync({ id, data });

// const updateEmployee = async (id: number, data: Partial<Employee>): Promise<void> => {
//   await updateMutation.mutateAsync({ id, data });
// };

//   // const deleteEmployee = async (id: number) => deleteMutation.mutateAsync(id);
//   const deleteEmployee = async (id: number): Promise<void> => {
//     await deleteMutation.mutateAsync(id);
//   };
//   return (
//     <EmployeeContext.Provider
//       value={{
//         employees: data || [],
//         isLoading,
//         error: error?.message || null,
//         addEmployee,
//         updateEmployee,
//         deleteEmployee,
//       }}
//     >
//       {children}
//     </EmployeeContext.Provider>
//   );
// };

// export const useEmployees = () => {
//   const context = useContext(EmployeeContext);
//   if (!context) throw new Error('useEmployees must be used within EmployeeProvider');
//   return context;
// };

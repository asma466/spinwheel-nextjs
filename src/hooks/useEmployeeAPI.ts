// 'use client';

// import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
// import axios from 'axios';
// import { Employee } from '@/src/types';

// // export const useEmployees = () =>
// //   useQuery<Employee[]>({
// //     queryKey: ['employees'],
// //     queryFn: async () => {
// //       const res = await axios.get('/api/employees');
// //          return res.data.data; // ✅ FIXED
// //     },
// //   });


//   export const useEmployees = (search: string, page: number) =>
//   useQuery({
//     queryKey: ['employees', search, page],
//     queryFn: async () => {
//       const res = await axios.get('/api/employees', {
//         params: { search, page, limit: 10 },
//       });
//       return res.data;
//     },
//     placeholderData: keepPreviousData, // ✅ v5 way
//   });

// export const useCreateEmployee = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: Omit<Employee, 'id'>) =>
//       axios.post('/api/employees', data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['employees'] });
//     },
//   });
// };

// // export const useUpdateEmployee = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ id, data }: { id: number; data: Partial<Employee> }) =>
// //       axios.put(`/api/employees/${id}`, data),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['employees'] });
// //     },
// //   });
// // };
// export const useUpdateEmployee = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, ...data }: { id: number } & Partial<Employee>) =>
//       axios.put(`/api/employees/${id}`, data),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['employees'] });
//     },
//   });
// };

// // export const useDeleteEmployee = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: (id: number) => axios.delete(`/api/employees/${id}`),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['employees'] });
// //     },
// //   });
// // };


// export const useDeleteEmployee = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: number) =>
//       axios.delete(`/api/employees/${id}`),

//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey: ['employees'] });

//       const previousData = queryClient.getQueryData(['employees']);

//       queryClient.setQueryData(['employees'], (old: any) => {
//         if (!old) return old;
//         return {
//           ...old,
//           data: old.data.filter((emp: any) => emp.id !== id),
//         };
//       });

//       return { previousData };
//     },

//     onError: (_err, _id, context) => {
//       queryClient.setQueryData(['employees'], context?.previousData);
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['employees'] });
//     },
//   });
// };



'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
import { Employee } from '@/src/types';
import { api } from '@/lib/axios';

export const useEmployees = (search: string, page: number) =>
  useQuery({
    queryKey: ['employees', search, page],
    queryFn: async () => {
      const res = await api.get('/employees', {
        params: { search, page, limit: 10 },
      });
      return res.data;
         // 👇 IMPORTANT
      // return res.data.employees; 
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1 minute
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Employee, 'id'>) =>
      // axios.post('/api/employees', data),
    api.post('/employees', data, {
  withCredentials: true,
}),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<Employee>) =>
      api.put(`/employees/${id}`, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/employees/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
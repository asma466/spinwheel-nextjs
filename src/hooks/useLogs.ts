
'use client';

import { api } from '@/lib/axios';
import { useQuery , useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface ActivityLog {
  id: number;
  userId?: string | null;
  userName: string;
  userEmail: string;
  action: string;
  module: string;
  description: string;
  changes?: Record<string, { before: any; after: any }> | null; // JSON object containing field changes
  createdAt: string;
}

interface LogsResponse {
  success: boolean;
  data: ActivityLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useLogs(
  search: string = '',
  page: number = 1,
  limit: number = 10,
  action: string = '',
  moduleName: string = ''
) {
  const query = useQuery<LogsResponse>({
    queryKey: ['logs', search, page, limit, action, moduleName],
    queryFn: async () => {
      const { data } = await axios.get<LogsResponse>('/api/activity_logs', {
        params: {
          search,
          page,
          limit,
          action: action || undefined,
          module: moduleName || undefined,
        },
      });

      return data;
    },

    placeholderData: (previousData) => previousData,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

// ✅ Logout Activity Hook
export function useLogoutActivity() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/activity-logout");
      return data;
    },
  });
}


export function useLoginActivity() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/activity-login");
      return data;
    },
  });
}
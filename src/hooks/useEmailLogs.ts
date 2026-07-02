'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface EmailLog {
  id: string;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
}

interface EmailLogsResponse {
  success: boolean;
  total: number;
  data: EmailLog[];
}

interface EmailLogsFilters {
  status?: string;
  employeeId?: number;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

function buildEmailLogsUrl(filters?: EmailLogsFilters): string {
  const queryParams = new URLSearchParams();

  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.employeeId) queryParams.append('employeeId', String(filters.employeeId));
  if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
  if (filters?.limit) queryParams.append('limit', String(filters.limit));

  const query = queryParams.toString();
  return query ? `/api/send-birthday-emails?${query}` : '/api/send-birthday-emails';
}

export function useEmailLogs(filters?: EmailLogsFilters) {
  const url = buildEmailLogsUrl(filters);

  const query = useQuery<EmailLogsResponse>({
    queryKey: ['email-logs', filters],
    queryFn: async () => {
      const response = await axios.get<EmailLogsResponse>(url);
      return response.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    emailLogs: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useEmailStats() {
  const { emailLogs, isLoading, error } = useEmailLogs({ limit: 1000 });

  const sentCount = emailLogs.filter((log) => log.status === 'sent').length;
  const failedCount = emailLogs.filter((log) => log.status === 'failed').length;
  const pendingCount = emailLogs.filter((log) => log.status === 'pending').length;

  return {
    stats: {
      total: emailLogs.length,
      sent: sentCount,
      failed: failedCount,
      pending: pendingCount,
      successRate:
        emailLogs.length > 0 ? ((sentCount / emailLogs.length) * 100).toFixed(1) : '0.0',
    },
    isLoading,
    error,
  };
}

export function useSendBirthdayEmails() {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/send-birthday-emails', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    },
  });

  return {
    trigger: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}

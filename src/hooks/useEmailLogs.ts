'use client';

import useSWR from 'swr';
import { useState } from 'react';
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

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data);

/**
 * Hook to fetch email logs with optional filters
 */
export function useEmailLogs(filters?: EmailLogsFilters) {
  const queryParams = new URLSearchParams();

  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.employeeId) queryParams.append('employeeId', String(filters.employeeId));
  if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
  if (filters?.limit) queryParams.append('limit', String(filters.limit));

  const query = queryParams.toString();
  const url = query ? `/api/send-birthday-emails?${query}` : '/api/send-birthday-emails';

  const { data, error, isLoading, mutate } = useSWR<EmailLogsResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      focusThrottleInterval: 300000, // 5 minutes
    }
  );

  return {
    emailLogs: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to get email statistics
 */
export function useEmailStats() {
  const { emailLogs, isLoading, error } = useEmailLogs({ limit: 1000 });

  const stats = {
    total: emailLogs.length,
    sent: emailLogs.filter((log: EmailLog) => log.status === 'sent').length,
    failed: emailLogs.filter((log: EmailLog) => log.status === 'failed').length,
    pending: emailLogs.filter((log: EmailLog) => log.status === 'pending').length,
    successRate: emailLogs.length > 0
      ? ((emailLogs.filter((log: EmailLog) => log.status === 'sent').length / emailLogs.length) * 100).toFixed(1)
      : 0,
  };

  return {
    stats,
    isLoading,
    error,
  };
}

/**
 * Hook to manually trigger birthday email sending
 */
export function useSendBirthdayEmails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trigger = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/send-birthday-emails', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send emails';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { trigger, loading, error };
}

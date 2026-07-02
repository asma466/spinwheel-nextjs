'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { AlertCircle, Cake, Check, Gift, Mail, Send } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { toast } from 'sonner';

import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
import { PageHeader } from '@/src/component/common/PageHeader';
import { DataTable } from '@/src/component/common/DataTable';
import { SearchInput } from '@/src/component/common/SearchInput';
import { StatusBadge } from '@/src/component/common/StatusBadge';
import { EmptyState } from '@/src/component/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployees } from '@/src/hooks/useEmployeeAPI';
import { useBirthdayRecords, useSendBirthdayEmail } from '@/src/hooks/useBirthdayRecord';
import { useDebounce } from '@/src/hooks/useDebounce';
import type { BirthdayRecord, Employee, Gift as GiftType } from '@/src/types';

type BirthdayFilterStatus = 'all' | 'today' | 'pending' | 'completed';

interface EmployeesResponse {
  data?: Employee[];
}

interface BirthdayDashboardRow {
  id: number | string;
  employee: Employee;
  birthdayDate: Date | null;
  isBirthdayToday: boolean;
  emailSent: boolean;
  spinCompleted: boolean;
  giftReceived: GiftType | null;
  pastGifts: number;
}

const FILTER_VALUES: BirthdayFilterStatus[] = ['all', 'today', 'pending', 'completed'];

function isBirthdayFilterStatus(value: string): value is BirthdayFilterStatus {
  return FILTER_VALUES.includes(value as BirthdayFilterStatus);
}

export default function BirthdayDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<BirthdayFilterStatus>('all');

  const today = new Date();
  const currentYear = today.getFullYear();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: employeeResponse, isLoading: loadingEmployees } = useEmployees(debouncedSearch, 1);
  const { data: records = [], isLoading: loadingRecords } = useBirthdayRecords();
  const sendEmailMutation = useSendBirthdayEmail();

  const employees = useMemo(
    () => (Array.isArray((employeeResponse as EmployeesResponse | undefined)?.data) ? (employeeResponse as EmployeesResponse).data ?? [] : []),
    [employeeResponse]
  );

  const recordMap = useMemo(
    () => new Map(records.map((record: BirthdayRecord) => [record.employeeId, record])),
    [records]
  );

  const employeeBirthdayData = useMemo<BirthdayDashboardRow[]>(() => {
    return [...employees]
      .map((employee) => {
        const record = recordMap.get(employee.id);
        const birthdayDate = employee.dob ? new Date(employee.dob) : null;
        const birthdayThisYear =
          birthdayDate && !Number.isNaN(birthdayDate.getTime())
            ? new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate())
            : null;

        return {
          id: record?.id ?? `temp-${employee.id}`,
          employee,
          birthdayDate: birthdayThisYear,
          isBirthdayToday: birthdayThisYear ? isToday(birthdayThisYear) : false,
          emailSent: record?.emailSent ?? false,
          spinCompleted: record?.spinCompleted ?? false,
          giftReceived: record?.giftReceived ?? null,
          pastGifts: 0,
        };
      })
      .sort((left, right) => {
        if (!left.birthdayDate) return 1;
        if (!right.birthdayDate) return -1;
        return left.birthdayDate.getTime() - right.birthdayDate.getTime();
      });
  }, [currentYear, employees, recordMap]);

  const filteredData = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return employeeBirthdayData.filter((item) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.employee.name.toLowerCase().includes(normalizedQuery) ||
        (item.employee.department ?? '').toLowerCase().includes(normalizedQuery);

      if (!matchesSearch) {
        return false;
      }

      switch (filterStatus) {
        case 'today':
          return item.isBirthdayToday;
        case 'pending':
          return !item.emailSent && item.isBirthdayToday;
        case 'completed':
          return item.spinCompleted;
        default:
          return true;
      }
    });
  }, [employeeBirthdayData, filterStatus, searchQuery]);

  const handleSendEmail = useCallback(
    (employeeId: number) => {
      sendEmailMutation.mutate(employeeId, {
        onSuccess: () => toast.success('Birthday email sent'),
        onError: () => toast.error('Failed to send birthday email'),
      });
    },
    [sendEmailMutation]
  );

  const columns = useMemo(
    () => [
      {
        key: 'employee',
        header: 'Employee',
        render: (item: BirthdayDashboardRow) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {(item.employee.name || '')
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="font-medium">{item.employee.name}</div>
              <div className="text-sm text-muted-foreground">{item.employee.department || ''}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'birthday',
        header: 'Birthday',
        render: (item: BirthdayDashboardRow) => (
          <div className="flex items-center gap-2">
            <div className="font-medium">{item.birthdayDate ? format(item.birthdayDate, 'MMM d') : '-'}</div>
            {item.isBirthdayToday ? (
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                Today
              </span>
            ) : null}
          </div>
        ),
      },
      {
        key: 'emailStatus',
        header: 'Email Status',
        render: (item: BirthdayDashboardRow) =>
          item.emailSent ? (
            <StatusBadge status="success">
              <Check className="mr-1 h-3 w-3" />
              Sent
            </StatusBadge>
          ) : (
            <StatusBadge status="pending">
              <Mail className="mr-1 h-3 w-3" />
              Pending
            </StatusBadge>
          ),
      },
      {
        key: 'giftStatus',
        header: 'Gift Status',
        render: (item: BirthdayDashboardRow) =>
          item.spinCompleted && item.giftReceived ? (
            <StatusBadge status="success">
              <Gift className="mr-1 h-3 w-3" />
              {item.giftReceived.name}
            </StatusBadge>
          ) : item.emailSent ? (
            <StatusBadge status="warning">
              <AlertCircle className="mr-1 h-3 w-3" />
              Awaiting Spin
            </StatusBadge>
          ) : (
            <StatusBadge status="pending">-</StatusBadge>
          ),
      },
      {
        key: 'pastGifts',
        header: 'Past Gifts',
        render: (item: BirthdayDashboardRow) => (
          <span className="text-sm text-muted-foreground">
            {item.pastGifts > 0 ? `${item.pastGifts} gift(s) received` : 'No history'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: '',
        className: 'text-right',
        render: (item: BirthdayDashboardRow) =>
          item.isBirthdayToday && !item.emailSent ? (
            <Button size="sm" onClick={() => handleSendEmail(item.employee.id)}>
              <Send className="mr-1 h-4 w-4" />
              Send Email
            </Button>
          ) : null,
      },
    ],
    [handleSendEmail]
  );

  const todayCount = employeeBirthdayData.filter((item) => item.isBirthdayToday).length;
  const pendingCount = employeeBirthdayData.filter((item) => !item.emailSent && item.isBirthdayToday).length;
  const isLoading = loadingEmployees || loadingRecords;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="Birthday Tracking"
            subtitle={`${todayCount} birthdays today • ${pendingCount} emails pending`}
          />

          <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
            <div className="rounded-lg bg-card p-3 text-center">
              <div className="text-sm text-muted-foreground">Today&apos;s Birthdays</div>
              <div className="text-2xl font-semibold">{todayCount}</div>
            </div>
            <div className="rounded-lg bg-card p-3 text-center">
              <div className="text-sm text-muted-foreground">Pending Emails</div>
              <div className="text-2xl font-semibold">{pendingCount}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name or department..."
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={filterStatus}
              onValueChange={(value) => {
                if (isBirthdayFilterStatus(value)) {
                  setFilterStatus(value);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="today">Today&apos;s</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : filteredData.length > 0 ? (
          <DataTable data={filteredData} columns={columns} />
        ) : (
          <EmptyState
            icon={Cake}
            title="No birthdays found"
            description="Try adjusting filters or add employees"
          />
        )}
      </div>
    </DashboardLayout>
  );
}

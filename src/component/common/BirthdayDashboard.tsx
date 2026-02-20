"use client";

import React, { useMemo, useState } from 'react';
import { Cake, Mail, Send, Gift, Check, AlertCircle } from 'lucide-react';
import { format, isToday, startOfDay } from 'date-fns';
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

export default function BirthdayDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'pending' | 'completed'>('all');

  const today = new Date();
  const currentYear = today.getFullYear();

  const { data: empRes, isLoading: loadingEmployees } = useEmployees(searchQuery, 1);
  const employees = Array.isArray(empRes?.data) ? empRes.data : [];

  const { data: records = [], isLoading: loadingRecords } = useBirthdayRecords();
  const sendEmailMutation = useSendBirthdayEmail();
  const isLoading = loadingEmployees || loadingRecords;

  const recordMap = useMemo(() => new Map(records.map((r: any) => [r.employeeId, r])), [records]);

  const employeeBirthdayData = useMemo(() => {
    return employees.map((emp: any) => {
      const record = recordMap.get(emp.id);
      let birthdayThisYear: Date | null = null;
      if (emp.dob) {
        const d = new Date(emp.dob);
        birthdayThisYear = new Date(currentYear, d.getMonth(), d.getDate());
      }
      const isBirthdayToday = birthdayThisYear ? isToday(birthdayThisYear) : false;

      return {
        id: record?.id || `temp-${emp.id}`,
        employee: emp,
        birthdayDate: birthdayThisYear,
        isBirthdayToday,
        emailSent: record?.emailSent || false,
        spinCompleted: record?.spinCompleted || false,
        giftReceived: record?.giftReceived || null,
        pastGifts: record?.pastGiftsCount || 0,
      };
    }).sort((a: any, b: any) => {
      if (!a.birthdayDate) return 1;
      if (!b.birthdayDate) return -1;
      return a.birthdayDate.getTime() - b.birthdayDate.getTime();
    });
  }, [employees, recordMap, currentYear]);

  const filteredData = useMemo(() => {
    let filtered = employeeBirthdayData;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((i: any) => i.employee.name.toLowerCase().includes(q) || (i.employee.department || '').toLowerCase().includes(q));
    }
    switch (filterStatus) {
      case 'today':
        filtered = filtered.filter((i: any) => i.isBirthdayToday);
        break;
      case 'pending':
        filtered = filtered.filter((i: any) => !i.emailSent && i.isBirthdayToday);
        break;
      case 'completed':
        filtered = filtered.filter((i: any) => i.spinCompleted);
        break;
    }
    return filtered;
  }, [employeeBirthdayData, searchQuery, filterStatus]);

  const handleSendEmail = (employeeId: string) => {
    sendEmailMutation.mutate(employeeId, {
      onSuccess: () => toast.success('Email sent'),
      onError: () => toast.error('Failed to send email'),
    });
  };

  const columns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">{(item.employee.name || '').split(' ').map((n: string) => n[0]).slice(0,2).join('')}</div>
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
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <div className="font-medium">{item.birthdayDate ? format(item.birthdayDate, 'MMM d') : '-'}</div>
          {item.isBirthdayToday && <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">Today 🎉</span>}
        </div>
      ),
    },
    {
      key: 'emailStatus',
      header: 'Email Status',
      render: (item: any) => (
        item.emailSent ? (
          <StatusBadge status="success"><Check className="w-3 h-3 mr-1" />Sent</StatusBadge>
        ) : (
          <StatusBadge status="pending"><Mail className="w-3 h-3 mr-1" />Pending</StatusBadge>
        )
      ),
    },
    {
      key: 'giftStatus',
      header: 'Gift Status',
      render: (item: any) => (
        item.spinCompleted && item.giftReceived ? (
          <StatusBadge status="success"><Gift className="w-3 h-3 mr-1" />{item.giftReceived.name}</StatusBadge>
        ) : item.emailSent ? (
          <StatusBadge status="warning"><AlertCircle className="w-3 h-3 mr-1" />Awaiting Spin</StatusBadge>
        ) : (
          <StatusBadge status="pending">-</StatusBadge>
        )
      ),
    },
    {
      key: 'pastGifts',
      header: 'Past Gifts',
      render: (item: any) => (
        <span className="text-sm text-muted-foreground">{item.pastGifts ? `${item.pastGifts} gift(s) received` : 'No history'}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (item: any) => (
        item.isBirthdayToday && !item.emailSent ? (
          <Button size="sm" onClick={() => handleSendEmail(item.employee.id)}><Send className="w-4 h-4 mr-1" />Send Email</Button>
        ) : null
      ),
    },
  ];

  const todayCount = employeeBirthdayData.filter((i: any) => i.isBirthdayToday).length;
  const pendingCount = employeeBirthdayData.filter((i: any) => !i.emailSent && i.isBirthdayToday).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <PageHeader title="Birthday Tracking" subtitle={`${todayCount} birthdays today • ${pendingCount} emails pending`} />

          <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
            <div className="p-3 bg-card rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Today's Birthdays</div>
              <div className="text-2xl font-semibold">{todayCount}</div>
            </div>
            <div className="p-3 bg-card rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Pending Emails</div>
              <div className="text-2xl font-semibold">{pendingCount}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex-1">
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or department..." />
          </div>

          <div className="w-full sm:w-48">
            <Select value={filterStatus} onValueChange={v => setFilterStatus(v as any)}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="today">Today's</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          filteredData.length ? (
            <DataTable data={filteredData} columns={columns} />
          ) : (
            <EmptyState icon={Cake} title="No birthdays found" description="Try adjusting filters or add employees" />
          )
        )}
      </div>
    </DashboardLayout>
  );
}

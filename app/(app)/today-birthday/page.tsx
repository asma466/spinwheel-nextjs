'use client';
import { useState, useMemo } from 'react';
import { Cake, Mail, Send, Gift, Check, AlertCircle } from 'lucide-react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { PageHeader } from '@/component/common/PageHeader';
// import { DataTable } from '@/components/common/DataTable';
// import { SearchInput } from '@/components/common/SearchInput';
// import { StatusBadge } from '@/components/common/StatusBadge';
// import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { mockEmployees, mockBirthdayRecords, mockGiftHistory } from '@/src/mockdata/mockdata';
import { Employee, BirthdayRecord } from '@/src/types';
import { format, isToday, isBefore, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/src/component/common/StatusBadge';
import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
import { PageHeader } from '@/src/component/common/PageHeader';
import { SearchInput } from '@/src/component/common/SearchInput';
import { DataTable } from '@/src/component/common/DataTable';
import { EmptyState } from '@/src/component/common/EmptyState';

export default function Birthdays() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'pending' | 'completed'>('all');
  const [records, setRecords] = useState<BirthdayRecord[]>(mockBirthdayRecords);

  const today = new Date();
  const currentYear = today.getFullYear();

  // Get all employees with their birthday status for current year
  const employeeBirthdayData = useMemo(() => {
    return mockEmployees.map(emp => {
      const existingRecord = records.find(r => r.employeeId === emp.id && r.year === currentYear);
      const birthdayThisYear = new Date(`${currentYear}-${emp.dateOfBirth.slice(5)}`);
      const isBirthdayToday = isToday(birthdayThisYear);
      const isPast = isBefore(birthdayThisYear, startOfDay(today)) && !isBirthdayToday;
      
      // Get gift history for this employee
      const giftHistory = mockGiftHistory.filter(gh => gh.employeeId === emp.id);
      
      return {
        id: existingRecord?.id || `temp-${emp.id}`,
        employee: emp,
        birthdayDate: birthdayThisYear,
        isBirthdayToday,
        isPast,
        emailSent: existingRecord?.emailSent || false,
        spinCompleted: existingRecord?.spinCompleted || false,
        giftReceived: existingRecord?.giftReceived,
        giftHistory,
      };
    });
  }, [records, currentYear]);

  const filteredData = useMemo(() => {
    let filtered = employeeBirthdayData;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.employee.name.toLowerCase().includes(query) ||
        item.employee.department.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (filterStatus) {
      case 'today':
        filtered = filtered.filter(item => item.isBirthdayToday);
        break;
      case 'pending':
        filtered = filtered.filter(item => !item.emailSent && (item.isBirthdayToday || !item.isPast));
        break;
      case 'completed':
        filtered = filtered.filter(item => item.spinCompleted);
        break;
    }

    // Sort by birthday date
    return filtered.sort((a, b) => a.birthdayDate.getTime() - b.birthdayDate.getTime());
  }, [employeeBirthdayData, searchQuery, filterStatus]);

  const handleSendEmail = (employeeId: string) => {
    setRecords(prev => {
      const existing = prev.find(r => r.employeeId === employeeId && r.year === currentYear);
      if (existing) {
        return prev.map(r => 
          r.id === existing.id 
            ? { ...r, emailSent: true, emailSentAt: new Date().toISOString() }
            : r
        );
      }
      const emp = mockEmployees.find(e => e.id === employeeId)!;
      return [...prev, {
        id: Date.now().toString(),
        employeeId,
        employee: emp,
        date: format(today, 'yyyy-MM-dd'),
        emailSent: true,
        emailSentAt: new Date().toISOString(),
        spinCompleted: false,
        year: currentYear,
      }];
    });
    toast.success('Birthday email sent successfully!');
  };

  const columns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (item: typeof filteredData[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {item.employee.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{item.employee.name}</p>
            <p className="text-sm text-muted-foreground">{item.employee.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'birthday',
      header: 'Birthday',
      render: (item: typeof filteredData[0]) => (
        <div className="flex items-center gap-2">
          <span className="text-foreground">
            {format(item.birthdayDate, 'MMM d')}
          </span>
          {item.isBirthdayToday && (
            <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
              Today 🎉
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'emailStatus',
      header: 'Email Status',
      render: (item: typeof filteredData[0]) => (
        item.emailSent ? (
          <StatusBadge status="success">
            <Check className="w-3 h-3 mr-1" />
            Sent
          </StatusBadge>
        ) : (
          <StatusBadge status="pending">
            <Mail className="w-3 h-3 mr-1" />
            Pending
          </StatusBadge>
        )
      ),
    },
    {
      key: 'giftStatus',
      header: 'Gift Status',
      render: (item: typeof filteredData[0]) => (
        item.spinCompleted && item.giftReceived ? (
          <div className="flex items-center gap-2">
            <StatusBadge status="success">
              <Gift className="w-3 h-3 mr-1" />
              {item.giftReceived.name}
            </StatusBadge>
          </div>
        ) : item.emailSent ? (
          <StatusBadge status="warning">
            <AlertCircle className="w-3 h-3 mr-1" />
            Awaiting Spin
          </StatusBadge>
        ) : (
          <StatusBadge status="pending">-</StatusBadge>
        )
      ),
    },
    {
      key: 'pastGifts',
      header: 'Past Gifts',
      render: (item: typeof filteredData[0]) => (
        <span className="text-sm text-muted-foreground">
          {item.giftHistory.length > 0 
            ? `${item.giftHistory.length} gift(s) received`
            : 'No history'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (item: typeof filteredData[0]) => (
        <div className="flex items-center justify-end">
          {!item.emailSent && (item.isBirthdayToday || !item.isPast) && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSendEmail(item.employee.id);
              }}
              className="btn-primary"
            >
              <Send className="w-4 h-4 mr-1" />
              Send Email
            </Button>
          )}
        </div>
      ),
    },
  ];

  const todayCount = employeeBirthdayData.filter(i => i.isBirthdayToday).length;
  const pendingCount = employeeBirthdayData.filter(i => !i.emailSent && (i.isBirthdayToday || !i.isPast)).length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Birthday Tracking"
        subtitle={`${todayCount} birthday${todayCount !== 1 ? 's' : ''} today • ${pendingCount} email${pendingCount !== 1 ? 's' : ''} pending`}
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or department..."
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="w-full sm:w-48 bg-background">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">All Employees</SelectItem>
            <SelectItem value="today">Today's Birthdays</SelectItem>
            <SelectItem value="pending">Pending Emails</SelectItem>
            <SelectItem value="completed">Completed Spins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredData.length > 0 ? (
        <DataTable
          data={filteredData}
          columns={columns}
        />
      ) : (
        <EmptyState
          icon={Cake}
          title="No birthdays found"
          description={filterStatus !== 'all' ? 'Try changing your filter selection' : 'No employees match your search criteria'}
        />
      )}
    </DashboardLayout>
  );
}

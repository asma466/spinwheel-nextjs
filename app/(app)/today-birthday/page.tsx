// "use client";

// import { useState, useMemo } from 'react';
// import { Cake, Send } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { format, isToday, startOfDay } from 'date-fns';
// import { toast } from 'sonner';

// import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
// import { PageHeader } from '@/src/component/common/PageHeader';
// import { SearchInput } from '@/src/component/common/SearchInput';
// import { DataTable } from '@/src/component/common/DataTable';
// import { EmptyState } from '@/src/component/common/EmptyState';
// import { useEmployees } from '@/src/hooks/useEmployeeAPI';
// import { useBirthdayRecords, useSendBirthdayEmail } from '@/src/hooks/useBirthdayRecord';
// import { BirthdaySpinwheelLoader } from '@/src/component/common/Loader';

// function InitialsAvatar({ name }: { name: string }) {
//   const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
//   return (
//     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
//       {initials}
//     </div>
//   );
// }

// export default function Birthdays() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'pending' | 'completed'>('all');

//   const today = new Date();
//   const currentYear = today.getFullYear();

//   const { data, isLoading: loadingEmployees } = useEmployees(searchQuery, 1);
//   const employees = Array.isArray(data?.data) ? data.data : [];

//   const { data: records = [], isLoading: loadingRecords } = useBirthdayRecords();
//   const sendEmailMutation = useSendBirthdayEmail();
//   const isLoading = loadingEmployees || loadingRecords;

//   const recordMap = useMemo(() => new Map(records.map((r: any) => [r.employeeId, r])), [records]);

//   const employeeBirthdayData = useMemo(() => {
//     return employees
//       .map((emp: any) => {
//         const record = recordMap.get(emp.id);
//         let birthdayThisYear: Date | null = null;
//         if (emp.dob) {
//           const d = new Date(emp.dob);
//           birthdayThisYear = new Date(currentYear, d.getMonth(), d.getDate());
//         }
//         const isBirthdayToday = birthdayThisYear ? isToday(birthdayThisYear) : false;
//         const isPast = birthdayThisYear ? (birthdayThisYear < startOfDay(today) && !isBirthdayToday) : false;

//         return {
//           id: record?.id || `temp-${emp.id}`,
//           employee: emp,
//           birthdayDate: birthdayThisYear,
//           isBirthdayToday,
//           isPast,
//           emailSent: record?.emailSent || false,
//           emailSentAt: record?.emailSentAt || null,
//           spinCompleted: record?.spinCompleted || false,
//           giftReceived: record?.giftReceived,
//           giftReceivedAt: record?.giftReceivedAt || null,
//           pastGifts: record?.pastGiftsCount || 0,
//         };
//       })
//       .sort((a: any, b: any) => {
//         if (!a.birthdayDate) return 1;
//         if (!b.birthdayDate) return -1;
//         return a.birthdayDate.getTime() - b.birthdayDate.getTime();
//       });
//   }, [employees, recordMap, currentYear, today]);

//   const filteredData = useMemo(() => {
//     let filtered = employeeBirthdayData;
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       filtered = filtered.filter((i: any) => i.employee.name.toLowerCase().includes(q) || (i.employee.department || '').toLowerCase().includes(q));
//     }
//     switch (filterStatus) {
//       case 'today':
//         filtered = filtered.filter((i: any) => i.isBirthdayToday);
//         break;
//       case 'pending':
//         filtered = filtered.filter((i: any) => !i.emailSent && i.isBirthdayToday);
//         break;
//       case 'completed':
//         filtered = filtered.filter((i: any) => i.spinCompleted);
//         break;
//     }
//     return filtered;
//   }, [employeeBirthdayData, searchQuery, filterStatus]);

//   const todayCount = employeeBirthdayData.filter((i: any) => i.isBirthdayToday).length;
//   const pendingCount = employeeBirthdayData.filter((i: any) => !i.emailSent && i.isBirthdayToday).length;

//   const columns = [
//     {
//       key: 'employee',
//       header: 'Employee',
//       render: (item: any) => (
//         <div className="flex items-center gap-3">
//           <InitialsAvatar name={item.employee.name} />
//           <div>
//             <div className="font-medium">{item.employee.name}</div>
//             <div className="text-sm text-muted-foreground">{item.employee.department || ''}</div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: 'birthday',
//       header: 'Birthday',
//       render: (item: any) => (
//         <div className="flex items-center gap-2">
//           <div className="font-medium">{item.birthdayDate ? format(item.birthdayDate, 'MMM d') : '-'}</div>
//           {item.isBirthdayToday && <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">Today 🎉</span>}
//         </div>
//       ),
//     },
//     {
//       key: 'email',
//       header: 'Email',
//       render: (item: any) => (
//         <div className="text-sm">
//           {item.emailSent ? (
//             <div className="text-green-600">Sent{item.emailSentAt ? ` • ${format(new Date(item.emailSentAt), 'MMM d, yyyy')}` : ''}</div>
//           ) : (
//             <div className="text-muted-foreground">Not sent</div>
//           )}
//         </div>
//       ),
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (item: any) => (
//         <div className="text-sm">
//           {item.spinCompleted ? <span className="text-green-600">Gift sent</span> : (item.emailSent ? <span className="text-amber-600">Awaiting Spin</span> : <span className="text-muted-foreground">Pending</span>)}
//         </div>
//       ),
//     },
//     // {
//     //   key: 'past',
//     //   header: 'History',
//     //   render: (item: any) => (
//     //     item.giftReceived ? (
//     //       <div className="text-sm">
//     //         Received: {item.giftReceived.name}{item.giftReceivedAt ? ` • ${format(new Date(item.giftReceivedAt), 'MMM d, yyyy')}` : ''}
//     //       </div>
//     //     ) : item.pastGifts ? (
//     //       <div className="text-sm">{item.pastGifts} gift(s) received</div>
//     //     ) : (
//     //       <div className="text-sm text-muted-foreground">No history</div>
//     //     )
//     //   ),
//     // },
//     {
  // key: 'past',
  // header: 'History',
  // render: (item: any) => {
  //   if (item.giftReceived) {
  //     return (
  //       <div className="text-sm">
  //         <div className="font-medium text-green-600">
  //           🎁 {item.giftReceived.name}
  //         </div>
  //         {item.giftReceivedAt && (
  //           <div className="text-muted-foreground text-xs">
  //             {format(new Date(item.giftReceivedAt), 'MMM d, yyyy')}
  //           </div>
  //         )}
  //       </div>
  //     );
  //   }

//     return (
//       <div className="text-sm text-muted-foreground">
//         No history
//       </div>
//     );
//   },
// },
//     {
//       key: 'actions',
//       header: '',
//       className: 'text-right',
//       render: (item: any) => (
//         item.isBirthdayToday ? (
//           <Button 
//             size="sm" 
//             onClick={() => sendEmailMutation.mutate(item.employee.id, { 
//               onSuccess: () => toast.success('Email sent successfully!') 
//             })}
//             variant={item.emailSent ? "outline" : "default"}
//           >
//             <Send className="w-4 h-4 mr-1" /> 
//             {item.emailSent ? 'Resend' : 'Send'}
//           </Button>
//         ) : null
//       ),
//     },
//   ];

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between gap-4">
//           <PageHeader title="Birthday Tracking" subtitle={`${todayCount} today • ${pendingCount} pending`} />
//           <div className="flex items-center gap-3">
//             <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
//               <div className="p-3 bg-card rounded-lg text-center">
//                 <div className="text-sm text-muted-foreground">Today's Birthdays</div>
//                 <div className="text-2xl font-semibold">{todayCount}</div>
//               </div>
//               <div className="p-3 bg-card rounded-lg text-center">
//                 <div className="text-sm text-muted-foreground">Pending Emails</div>
//                 <div className="text-2xl font-semibold">{pendingCount}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
//           <div className="flex-1">
//             <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or department..." />
//           </div>

//           <div className="w-full sm:w-48">
//             <Select value={filterStatus} onValueChange={v => setFilterStatus(v as any)}>
//               <SelectTrigger className="w-full bg-background">
//                 <SelectValue placeholder="Filter" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="today">Today's</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {isLoading ? (
//           // <div className="p-8 text-center">Loading...</div>
//           <BirthdaySpinwheelLoader />
//         ) : (
//           filteredData.length ? (
//             <DataTable data={filteredData} columns={columns} />
//           ) : (
//             <EmptyState icon={Cake} title="No birthdays found" description="Try adjusting filters or add employees" />
//           )
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Cake, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isToday, startOfDay } from 'date-fns';
import { toast } from 'sonner';

import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
import { PageHeader } from '@/src/component/common/PageHeader';
import { SearchInput } from '@/src/component/common/SearchInput';
import { DataTable } from '@/src/component/common/DataTable';
import { EmptyState } from '@/src/component/common/EmptyState';
import { useEmployees } from '@/src/hooks/useEmployeeAPI';
import { useBirthdayRecords, useSendBirthdayEmail } from '@/src/hooks/useBirthdayRecord';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Loader } from '@/src/component/common/Loader';

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
      {initials}
    </div>
  );
}

export default function Birthdays() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'pending' | 'completed'>('all');

  const today = new Date();
  const currentYear = today.getFullYear();
  const [page, setPage] = useState(1); // ✅ pagination state

  // const { data, isLoading: loadingEmployees } = useEmployees(searchQuery, 1);
 const { data, isLoading: loadingEmployees } = useEmployees(searchQuery, page);
 const employees = Array.isArray(data?.data) ? data.data : [];
const meta = data?.meta;
  // const employees = Array.isArray(data?.data) ? data.data : [];

  const { data: records = [], isLoading: loadingRecords } = useBirthdayRecords();
  const sendEmailMutation = useSendBirthdayEmail();
  const isLoading = loadingEmployees || loadingRecords;

  // Map birthday records by employeeId for fast lookup
  const recordMap = useMemo(() => new Map(records.map((r: any) => [r.employeeId, r])), [records]);

  // Build employee birthday data with today check
  const employeeBirthdayData = useMemo(() => {
    return employees.map((emp: any) => {
      const record = recordMap.get(emp.id);
      let birthdayThisYear: Date | null = null;

      if (emp.dob) {
        const dob = new Date(emp.dob);
        birthdayThisYear = new Date(currentYear, dob.getMonth(), dob.getDate());
      }

      const isBirthdayToday = birthdayThisYear ? isToday(birthdayThisYear) : false;
      const isPast = birthdayThisYear ? birthdayThisYear < startOfDay(today) && !isBirthdayToday : false;

      return {
        id: record?.id || `temp-${emp.id}`,
        employee: emp,
        birthdayDate: birthdayThisYear,
        isBirthdayToday,
        isPast,
            // ✅ FIXED MAPPING
        emailSent: record?.emailSent || false,
        autoEmail: record?.autoEmail || false,
        emailSentAt: record?.emailSentAt || null,

        // emailSent: record?.emailSent || false,
        spinCompleted: record?.spinCompleted || false,
        giftReceived: record?.giftReceived || null,
giftReceivedAt: record?.giftReceivedAt || null,
      };
    });
  }, [employees, recordMap, currentYear, today]);

  // Filter and sort data for table
  const filteredAndSorted = useMemo(() => {
    let data = employeeBirthdayData;

    // Apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (i: any) =>
          i.employee.name.toLowerCase().includes(q) ||
          (i.employee.department || '').toLowerCase().includes(q)
      );
    }

    // Apply status filter
    switch (filterStatus) {
      case 'today':
        data = data.filter((i: any) => i.isBirthdayToday);
        break;
      case 'pending':
        data = data.filter((i: any) => !i.emailSent && i.isBirthdayToday);
        break;
      case 'completed':
        data = data.filter((i: any) => i.spinCompleted);
        break;
    }

    // Sort birthdays: today first, then upcoming, then others
    data = data.sort((a: any, b: any) => {
      if (a.isBirthdayToday && !b.isBirthdayToday) return -1;
      if (!a.isBirthdayToday && b.isBirthdayToday) return 1;

      if (a.birthdayDate && b.birthdayDate) return a.birthdayDate.getTime() - b.birthdayDate.getTime();
      if (!a.birthdayDate) return 1;
      if (!b.birthdayDate) return -1;
      return 0;
    });

    return data;
  }, [employeeBirthdayData, searchQuery, filterStatus]);

//   useEffect(() => {
//   employeeBirthdayData.forEach((emp: any) => {
//     // Auto-send only if birthday is today or tomorrow and email not yet sent
//     if ((emp.isBirthdayToday || emp.isBirthdayTomorrow) && !emp.emailSent) {
//       sendEmailMutation.mutate(emp.employee.id, {
//         onSuccess: () =>
//           toast.success(`Birthday email sent to ${emp.employee.name}`),
//       });
//     }
//   });
// }, [employeeBirthdayData, sendEmailMutation]);
  const todayCount = employeeBirthdayData.filter((i: any) => i.isBirthdayToday).length;
  const pendingCount = employeeBirthdayData.filter((i: any) => !i.emailSent && i.isBirthdayToday).length;


  // const currentYear = new Date().getFullYear();
const previousYear = currentYear - 1;

// const { data: records = [] } = useBirthdayRecords();

// Map employeeId -> last year gift
const lastYearGiftMap = useMemo(() => {
  const map = new Map<number, string>();

  records.forEach((record: any) => {
    if (!record.giftReceived) return;

    const year = record.year ?? new Date(record.createdAt).getFullYear();

    if (year === previousYear) {
      map.set(Number(record.employeeId), record.giftReceived.name);
    }
  });

  return map;
}, [records, previousYear]);
//   const columns = [
//     {
//       key: 'employee',
//       header: 'Employee',
//       render: (item: any) => (
//         <div className="flex items-center gap-3">
//           <InitialsAvatar name={item.employee.name} />
//           <div>
//             <div className="font-medium">{item.employee.name}</div>
//             <div className="text-sm text-muted-foreground">{item.employee.department || ''}</div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: 'birthday',
//       header: 'Birthday',
//       render: (item: any) => (
//         <div className="flex items-center gap-2">
//           <div className="font-medium">{item.birthdayDate ? format(item.birthdayDate, 'MMM d') : '-'}</div>
//           {item.isBirthdayToday && (
//             <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
//               Today 🎉
//             </span>
//           )}
//         </div>
//       ),
//     },
// //     {
// //   key: 'email',
// //   header: 'Email',
// //   render: (item: any) => (
// //     <div className="text-sm">
// //       {item.emailSent ? (
// //         <span className="text-green-600 font-medium">Sent ✓</span>
// //       ) : (
// //         <span className="text-red-500">Pending</span>
// //       )}
// //     </div>
// //   ),
// // },
// {
//   key: 'emailTime',
//   header: 'Email Time',
//   render: (item: any) =>
//     item.emailSentAt
//       ? format(new Date(item.emailSentAt), "MMM d, HH:mm")
//       : "-"
// },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (item: any) => (
//         <div className="text-sm">
//           {item.spinCompleted ? (
//             <span className="text-green-600">Gift sent</span>
//           ) : item.emailSent ? (
//             <span className="text-amber-600">Awaiting Spin</span>
//           ) : (
//             <span className="text-muted-foreground">Pending</span>
//           )}
//         </div>
//       ),
//     },
// //     {
// //   key: 'history',
// //   header: 'History',
// //   render: (item: any) => (
// //     <div className="text-sm">
// //       {item.spinCompleted ? (
// //         <div>
// //           <div className="font-medium">{item.giftReceived?.name || 'Gift Assigned'}</div>
// //           {item.giftReceivedAt && (
// //             <div className="text-xs text-muted-foreground">
// //               {format(new Date(item.giftReceivedAt), 'MMM d, yyyy')}
// //             </div>
// //           )}
// //         </div>
// //       ) : (
// //         <span className="text-muted-foreground text-xs">No history</span>
// //       )}
// //     </div>
// //   ),
// // },

// {
//   key: 'history',
//   header: 'Last Year Gift',
//   render: (item: any) => {
//     const lastGift = lastYearGiftMap.get(item.employee.id);
//     return lastGift ? lastGift : '-';
//   }
// },
//     {
//       key: 'actions',
//       header: '',
//       className: 'text-right',
//       render: (item: any) =>
//         item.isBirthdayToday ? (
//           <Button
//             size="sm"
//             variant={item.emailSent ? 'outline' : 'default'}
//             onClick={() =>
//               sendEmailMutation.mutate(item.employee.id, {
//                 onSuccess: () => toast.success('Email sent successfully!'),
//               })
//             }
//           >
//             <Send className="w-4 h-4 mr-1" /> {item.emailSent ? 'Resend' : 'Send'}
//           </Button>
//         ) : null,
//     },
//   ];

const columns = [
  {
    key: 'employee',
    header: 'Employee',
    render: (item: any) => (
      <div className="flex items-center gap-3">
        <InitialsAvatar name={item.employee.name} />
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
        {item.isBirthdayToday && (
          <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
            Today 🎉
          </span>
        )}
      </div>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (item: any) => (
      <div className="text-sm flex flex-col">
        {item.emailSent ? (
          <span className={`font-medium ${item.autoEmail ? 'text-blue-600' : 'text-green-600'}`}>
            {item.autoEmail ? 'Auto Sent ✓' : 'Sent ✓'}
          </span>
        ) : (
          <span className="text-red-500">Pending</span>
        )}
        {item.emailSentAt && (
          <span className="text-xs text-muted-foreground">
            {format(new Date(item.emailSentAt), 'MMM d, HH:mm')}
          </span>
        )}
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (item: any) => (
      <div className="text-sm">
        {item.spinCompleted ? (
          <span className="text-green-600">Gift sent</span>
        ) : item.emailSent ? (
          <span className="text-amber-600">Awaiting Spin</span>
        ) : (
          <span className="text-muted-foreground">Pending</span>
        )}
      </div>
    ),
  },
  // {
  //   key: 'history',
  //   header: 'Last Year Gift',
  //   render: (item: any) => {
  //     const lastGift = lastYearGiftMap.get(item.employee.id);
  //     return lastGift ? (
  //       <div className="text-sm">{lastGift}</div>
  //     ) : (
  //       <div className="text-sm text-muted-foreground">-</div>
  //     );
  //   },
  // },
  {
   key: 'past',
  header: 'History',
  render: (item: any) => {
    if (item.giftReceived) {
      return (
        <div className="text-sm">
          <div className="font-medium text-green-600">
            🎁 {item.giftReceived.name}
          </div>
          {item.giftReceivedAt && (
            <div className="text-muted-foreground text-xs">
              {format(new Date(item.giftReceivedAt), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      );
    }
  } },
  // {
  //   key: 'actions',
  //   header: '',
  //   className: 'text-right',
  //   render: (item: any) =>
  //     item.isBirthdayToday ? (
  //       <Button
  //         size="sm"
  //         variant={item.emailSent ? 'outline' : 'default'}
  //         onClick={() =>
  //           sendEmailMutation.mutate(item.employee.id, {
  //             onSuccess: () => toast.success('Email sent successfully!'),
  //           })
  //         }
  //       >
  //         <Send className="w-4 h-4 mr-1" /> {item.emailSent ? 'Resend' : 'Send'}
  //       </Button>
  //     ) : null,
  // },

  {
  key: 'actions',
  header: '',
  className: 'text-right',
  render: (item: any) => {
    // 🎯 Show button if:
    // 1. Birthday is today
    // 2. OR birthday is past but email NOT sent

    const showButton =
      item.isBirthdayToday ||
      (item.isPast && !item.emailSent);

    if (!showButton) return null;

    return (
      <Button
        size="sm"
        variant={item.emailSent ? 'outline' : 'default'}
        onClick={() =>
          sendEmailMutation.mutate(item.employee.id, {
            onSuccess: () =>
              toast.success(`Email sent to ${item.employee.name}`),
          })
        }
      >
        <Send className="w-4 h-4 mr-1" />
        {item.emailSent ? 'Resend' : 'Send'}
      </Button>
    );
  },
}
];
  // if (isLoading) {
  //   return (
  //     <DashboardLayout>
  //       <div className="p-8 text-center"><Loader/>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <PageHeader title="Birthday Tracking" subtitle={`${todayCount} today • ${pendingCount} pending`} />
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
            {/* <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or department..." /> */}
            <SearchInput
  value={searchQuery}
  onChange={(val) => {
    setSearchQuery(val);
    setPage(1); // ✅ reset page
  }}
  placeholder="Search by name or department..."
/>
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

        {/* {filteredAndSorted.length ? (
          <DataTable data={filteredAndSorted} columns={columns} />
        ) : (
          <EmptyState icon={Cake} title="No birthdays found" description="Try adjusting filters or add employees" />
        )} */}
       
       
       {isLoading ? (
  <div className="p-6 flex justify-center items-center min-h-75">
    <Loader />
  </div>
) :
 filteredAndSorted.length ? (
  <>
    <DataTable data={filteredAndSorted} columns={columns} />

    {/* ✅ Pagination */}
    <div className="flex justify-end mt-6">
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page === 1) return;
                setPage(page - 1);
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {[...Array(meta?.totalPages || 1)].map((_, i) => {
            const pageNumber = i + 1;

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={page === pageNumber}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page === meta?.totalPages) return;
                setPage(page + 1);
              }}
              className={
                page === meta?.totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </>
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



// 'use client';
// import { useState, useMemo } from 'react';
// import { Cake, Mail, Send, Gift, Check, AlertCircle } from 'lucide-react';
// // import { DashboardLayout } from '@/components/layout/DashboardLayout';
// // import { PageHeader } from '@/component/common/PageHeader';
// // import { DataTable } from '@/components/common/DataTable';
// // import { SearchInput } from '@/components/common/SearchInput';
// // import { StatusBadge } from '@/components/common/StatusBadge';
// // import { EmptyState } from '@/components/common/EmptyState';
// import { Button } from '@/components/ui/button';
// import { mockEmployees, mockBirthdayRecords, mockGiftHistory } from '@/src/mockdata/mockdata';
// import { Employee, BirthdayRecord } from '@/src/types';
// import { format, isToday, isBefore, startOfDay } from 'date-fns';
// import { toast } from 'sonner';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { StatusBadge } from '@/src/component/common/StatusBadge';
// import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
// import { PageHeader } from '@/src/component/common/PageHeader';
// import { SearchInput } from '@/src/component/common/SearchInput';
// import { DataTable } from '@/src/component/common/DataTable';
// import { EmptyState } from '@/src/component/common/EmptyState';

// export default function Birthdays() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'pending' | 'completed'>('all');
//   const [records, setRecords] = useState<BirthdayRecord[]>(mockBirthdayRecords);

//   const today = new Date();
//   const currentYear = today.getFullYear();

//   // Get all employees with their birthday status for current year
//   const employeeBirthdayData = useMemo(() => {
//     return mockEmployees.map(emp => {
//       const existingRecord = records.find(r => r.employeeId === emp.id && r.year === currentYear);
//       const birthdayThisYear = new Date(`${currentYear}-${emp.dateOfBirth.slice(5)}`);
//       const isBirthdayToday = isToday(birthdayThisYear);
//       const isPast = isBefore(birthdayThisYear, startOfDay(today)) && !isBirthdayToday;
      
//       // Get gift history for this employee
//       const giftHistory = mockGiftHistory.filter(gh => gh.employeeId === emp.id);
      
//       return {
//         id: existingRecord?.id || `temp-${emp.id}`,
//         employee: emp,
//         birthdayDate: birthdayThisYear,
//         isBirthdayToday,
//         isPast,
//         emailSent: existingRecord?.emailSent || false,
//         spinCompleted: existingRecord?.spinCompleted || false,
//         giftReceived: existingRecord?.giftReceived,
//         giftHistory,
//       };
//     });
//   }, [records, currentYear]);

//   const filteredData = useMemo(() => {
//     let filtered = employeeBirthdayData;

//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(item =>
//         item.employee.name.toLowerCase().includes(query) ||
//         item.employee.department.toLowerCase().includes(query)
//       );
//     }

//     // Apply status filter
//     switch (filterStatus) {
//       case 'today':
//         filtered = filtered.filter(item => item.isBirthdayToday);
//         break;
//       case 'pending':
//         filtered = filtered.filter(item => !item.emailSent && (item.isBirthdayToday || !item.isPast));
//         break;
//       case 'completed':
//         filtered = filtered.filter(item => item.spinCompleted);
//         break;
//     }

//     // Sort by birthday date
//     return filtered.sort((a, b) => a.birthdayDate.getTime() - b.birthdayDate.getTime());
//   }, [employeeBirthdayData, searchQuery, filterStatus]);

//   const handleSendEmail = (employeeId: string) => {
//     setRecords(prev => {
//       const existing = prev.find(r => r.employeeId === employeeId && r.year === currentYear);
//       if (existing) {
//         return prev.map(r => 
//           r.id === existing.id 
//             ? { ...r, emailSent: true, emailSentAt: new Date().toISOString() }
//             : r
//         );
//       }
//       const emp = mockEmployees.find(e => e.id === employeeId)!;
//       return [...prev, {
//         id: Date.now().toString(),
//         employeeId,
//         employee: emp,
//         date: format(today, 'yyyy-MM-dd'),
//         emailSent: true,
//         emailSentAt: new Date().toISOString(),
//         spinCompleted: false,
//         year: currentYear,
//       }];
//     });
//     toast.success('Birthday email sent successfully!');
//   };

//   const columns = [
//     {
//       key: 'employee',
//       header: 'Employee',
//       render: (item: typeof filteredData[0]) => (
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//             <span className="text-sm font-medium text-primary">
//               {item.employee.name.split(' ').map(n => n[0]).join('')}
//             </span>
//           </div>
//           <div>
//             <p className="font-medium text-foreground">{item.employee.name}</p>
//             <p className="text-sm text-muted-foreground">{item.employee.department}</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: 'birthday',
//       header: 'Birthday',
//       render: (item: typeof filteredData[0]) => (
//         <div className="flex items-center gap-2">
//           <span className="text-foreground">
//             {format(item.birthdayDate, 'MMM d')}
//           </span>
//           {item.isBirthdayToday && (
//             <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
//               Today 🎉
//             </span>
//           )}
//         </div>
//       ),
// 'use client';

// import { useState, useMemo } from 'react';
// import { Cake, Send } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { format, isToday, startOfDay } from 'date-fns';
// import { toast } from 'sonner';

// import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
// import { PageHeader } from '@/src/component/common/PageHeader';
// import { SearchInput } from '@/src/component/common/SearchInput';
// import { DataTable } from '@/src/component/common/DataTable';
// import { EmptyState } from '@/src/component/common/EmptyState';
// import { useEmployees } from '@/src/hooks/useEmployeeAPI';
// import { useBirthdayRecords, useSendBirthdayEmail } from '@/src/hooks/useBirthdayRecord';

// function InitialsAvatar2({ name }: { name: string }) {
//   const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
//   return (
//     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">{initials}</div>
//   );
// }

// export default function Birthdays() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'pending' | 'completed'>('all');

//   const today = new Date();
//   const currentYear = today.getFullYear();

//   const { data, isLoading: loadingEmployees } = useEmployees(searchQuery, 1);
//   const employees = Array.isArray(data?.data) ? data.data : [];

//   const { data: records = [], isLoading: loadingRecords } = useBirthdayRecords();
//   const sendEmailMutation = useSendBirthdayEmail();
//   const isLoading = loadingEmployees || loadingRecords;

//   const recordMap = useMemo(() => new Map(records.map((r: any) => [r.employeeId, r])), [records]);

//   const employeeBirthdayData = useMemo(() => {
//     return employees.map((emp: any) => {
//       const record = recordMap.get(emp.id);
//       let birthdayThisYear: Date | null = null;
//       if (emp.dob) {
//         const d = new Date(emp.dob);
//         birthdayThisYear = new Date(currentYear, d.getMonth(), d.getDate());
//       }
//       const isBirthdayToday = birthdayThisYear ? isToday(birthdayThisYear) : false;
//       const isPast = birthdayThisYear ? (birthdayThisYear < startOfDay(today) && !isBirthdayToday) : false;

//       return {
//         id: record?.id || `temp-${emp.id}`,
//         employee: emp,
//         birthdayDate: birthdayThisYear,
//         isBirthdayToday,
//         isPast,
//         emailSent: record?.emailSent || false,
//         spinCompleted: record?.spinCompleted || false,
//         giftReceived: record?.giftReceived,
//       };
//     }).sort((a: any, b: any) => {
//       if (!a.birthdayDate) return 1;
//       if (!b.birthdayDate) return -1;
//       return a.birthdayDate.getTime() - b.birthdayDate.getTime();
//     });
//   }, [employees, recordMap, currentYear, today]);

//   const filteredData = useMemo(() => {
//     let filtered = employeeBirthdayData;
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       filtered = filtered.filter((i: any) => i.employee.name.toLowerCase().includes(q) || i.employee.department.toLowerCase().includes(q));
//     }
//     switch (filterStatus) {
//       case 'today': filtered = filtered.filter((i: any) => i.isBirthdayToday); break;
//       case 'pending': filtered = filtered.filter((i: any) => !i.emailSent && i.isBirthdayToday); break;
//       case 'completed': filtered = filtered.filter((i: any) => i.spinCompleted); break;
//     }
//     return filtered;
//   }, [employeeBirthdayData, searchQuery, filterStatus]);

//   const todayCount = employeeBirthdayData.filter((i: any) => i.isBirthdayToday).length;
//   const pendingCount = employeeBirthdayData.filter((i: any) => !i.emailSent && i.isBirthdayToday).length;

//   const columns = [
//     {
//       key: 'employee',
//       header: 'Employee',
//       render: (item: any) => (
//         <div className="flex items-center gap-3">
//           <InitialsAvatar name={item.employee.name} />
//           <div>
//             <div className="font-medium">{item.employee.name}</div>
//             <div className="text-sm text-muted-foreground">{item.employee.department}</div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: 'birthday',
//       header: 'Birthday',
//       render: (item: any) => (
//         <div className="flex items-center gap-2">
//           <div className="font-medium">{item.birthdayDate ? format(item.birthdayDate, 'MMM d') : '-'}</div>
//           {item.isBirthdayToday && <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">Today 🎉</span>}
//         </div>
//       ),
//     },
//     {
//       key: 'status',
//       header: 'Status',
//       render: (item: any) => (
//         <div className="text-sm">
//           {item.spinCompleted ? <span className="text-green-600">Gift sent</span> : (item.emailSent ? <span className="text-amber-600">Awaiting Spin</span> : <span className="text-muted-foreground">Pending</span>)}
//         </div>
//       ),
//     },
//     {
//       key: 'actions',
//       header: '',
//       className: 'text-right',
//       render: (item: any) => (
//         item.isBirthdayToday && !item.emailSent ? (
//           <Button size="sm" onClick={() => {
//             sendEmailMutation.mutate(item.employee.id, {
//               onSuccess: () => toast.success('Email sent')
//             });
//           }}>
//             <Send className="w-4 h-4 mr-1" /> Send
//           </Button>
//         ) : null
//       ),
//     },
//   ];

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between gap-4">
//           <PageHeader title="Birthday Tracking" subtitle={`${todayCount} today • ${pendingCount} pending`} />
//           <div className="flex items-center gap-3">
//             <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
//               <div className="p-3 bg-card rounded-lg text-center">
//                 <div className="text-sm text-muted-foreground">Today's Birthdays</div>
//                 <div className="text-2xl font-semibold">{todayCount}</div>
//               </div>
//               <div className="p-3 bg-card rounded-lg text-center">
//                 <div className="text-sm text-muted-foreground">Pending Emails</div>
//                 <div className="text-2xl font-semibold">{pendingCount}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
//           <div className="flex-1">
//             <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or department..." />
//           </div>

//           <div className="w-full sm:w-48">
//             <Select value={filterStatus} onValueChange={v => setFilterStatus(v as any)}>
//               <SelectTrigger className="w-full bg-background">
//                 <SelectValue placeholder="Filter" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="today">Today's</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="p-8 text-center">Loading...</div>
//         ) : (
//           filteredData.length ? (
//             <DataTable data={filteredData} columns={columns} />
//           ) : (
//             <EmptyState icon={Cake} title="No birthdays found" description="Try adjusting filters or add employees" />
//           )
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
// //   const [records, setRecords] = useState<BirthdayRecord[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [filterStatus, setFilterStatus] = useState<
// //     'all' | 'today' | 'pending' | 'completed'
// //   >('all');

// //   const today = new Date();
// //   const currentYear = today.getFullYear();

// //   // 🔥 Fetch employees from API
// //   useEffect(() => {
// //     async function fetchData() {
// //       try {
// //         const res = await fetch('/api/employees');
// //         const data = await res.json();
// //         setEmployees(data);

// //         // If you also have birthday records endpoint:
// //         const recRes = await fetch('/api/birthday-records');
// //         const recData = await recRes.json();
// //         setRecords(recData);
// //       } catch (err) {
// //         console.error(err);
// //         toast.error('Failed to load data');
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchData();
// //   }, []);

// //   // 🔎 Build birthday dataset
// //   // const employeeBirthdayData = useMemo(() => {
// //   //   return employees.map((emp) => {
// //   //     const existingRecord = records.find(
// //   //       (r) => r.employeeId === emp.id && r.year === currentYear
// //   //     );

// //   //     // Safe local birthday parsing
// //   //     const [month, day] = emp.dateOfBirth.slice(5).split('-');
// //   //     const birthdayThisYear = new Date(
// //   //       currentYear,
// //   //       Number(month) - 1,
// //   //       Number(day)
// //   //     );

// //   //     const isBirthdayToday = isToday(birthdayThisYear);
// //   //     const isPast =
// //   //       birthdayThisYear < startOfDay(today) && !isBirthdayToday;

// //   //     return {
// //   //       id: existingRecord?.id || `temp-${emp.id}`,
// //   //       employee: emp,
// //   //       birthdayDate: birthdayThisYear,
// //   //       isBirthdayToday,
// //   //       isPast,
// //   //       emailSent: existingRecord?.emailSent || false,
// //   //       spinCompleted: existingRecord?.spinCompleted || false,
// //   //       giftReceived: existingRecord?.giftReceived,
// //   //     };
// //   //   });
// //   // }, [employees, records, currentYear, today]);


// //     // 🔎 Build birthday dataset (SAFE)
// //   const employeeBirthdayData = useMemo(() => {
// //     if (!Array.isArray(employees)) return [];

// //     return employees.map((emp) => {
// //       const existingRecord = records.find(
// //         (r) => r.employeeId === emp.id && r.year === currentYear
// //       );

// //       const [month, day] = emp.dateOfBirth.slice(5).split('-');

// //       const birthdayThisYear = new Date(
// //         currentYear,
// //         Number(month) - 1,
// //         Number(day)
// //       );

// //       const isBirthdayToday = isToday(birthdayThisYear);
// //       const isPast =
// //         birthdayThisYear < startOfDay(today) && !isBirthdayToday;

// //       return {
// //         id: existingRecord?.id || `temp-${emp.id}`,
// //         employee: emp,
// //         birthdayDate: birthdayThisYear,
// //         isBirthdayToday,
// //         isPast,
// //         emailSent: existingRecord?.emailSent || false,
// //         spinCompleted: existingRecord?.spinCompleted || false,
// //         giftReceived: existingRecord?.giftReceived,
// //       };
// //     });
// //   }, [employees, records, currentYear, today]);

// //   // 🔍 Filtering
// //   const filteredData = useMemo(() => {
// //     let filtered = employeeBirthdayData;

// //     if (searchQuery) {
// //       const query = searchQuery.toLowerCase();
// //       filtered = filtered.filter(
// //         (item) =>
// //           item.employee.name.toLowerCase().includes(query) ||
// //           item.employee.department.toLowerCase().includes(query)
// //       );
// //     }

// //     switch (filterStatus) {
// //       case 'today':
// //         filtered = filtered.filter((item) => item.isBirthdayToday);
// //         break;
// //       case 'pending':
// //         filtered = filtered.filter(
// //           (item) => !item.emailSent && item.isBirthdayToday
// //         );
// //         break;
// //       case 'completed':
// //         filtered = filtered.filter((item) => item.spinCompleted);
// //         break;
// //     }

// //     return filtered.sort(
// //       (a, b) => a.birthdayDate.getTime() - b.birthdayDate.getTime()
// //     );
// //   }, [employeeBirthdayData, searchQuery, filterStatus]);

// //   // 📧 Send Email
// //   const handleSendEmail = async (employeeId: string) => {
// //     try {
// //       await fetch('/api/send-birthday-email', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ employeeId }),
// //       });

// //       toast.success('Birthday email sent!');

// //       // refresh records
// //       const recRes = await fetch('/api/birthday-records');
// //       const recData = await recRes.json();
// //       setRecords(recData);
// //     } catch {
// //       toast.error('Failed to send email');
// //     }
// //   };

// //   const todayCount = employeeBirthdayData.filter(
// //     (i) => i.isBirthdayToday
// //   ).length;

// //   const pendingCount = employeeBirthdayData.filter(
// //     (i) => !i.emailSent && i.isBirthdayToday
// //   ).length;

// //   if (loading) {
// //     return (
// //       <DashboardLayout>
// //         <div className="p-8 text-center">Loading...</div>
// //       </DashboardLayout>
// //     );
// //   }

// //   return (
// //     <DashboardLayout>
// //       <PageHeader
// //         title="Birthday Tracking"
// //         subtitle={`${todayCount} birthday${
// //           todayCount !== 1 ? 's' : ''
// //         } today • ${pendingCount} email${
// //           pendingCount !== 1 ? 's' : ''
// //         } pending`}
// //       />

// //       <div className="flex flex-col sm:flex-row gap-4 mb-6">
// //         <div className="flex-1">
// //           <SearchInput
// //             value={searchQuery}
// //             onChange={setSearchQuery}
// //             placeholder="Search by name or department..."
// //           />
// //         </div>

// //         <Select
// //           value={filterStatus}
// //           onValueChange={(v) =>
// //             setFilterStatus(v as typeof filterStatus)
// //           }
// //         >
// //           <SelectTrigger className="w-full sm:w-48 bg-background">
// //             <SelectValue placeholder="Filter by status" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="all">All Employees</SelectItem>
// //             <SelectItem value="today">Today's Birthdays</SelectItem>
// //             <SelectItem value="pending">Pending Emails</SelectItem>
// //             <SelectItem value="completed">Completed Spins</SelectItem>
// //           </SelectContent>
// //         </Select>
// //       </div>

// //       {filteredData.length > 0 ? (
// //         <DataTable data={filteredData} columns={[
// //           {
// //             key: 'employee',
// //             header: 'Employee',
// //             render: (item: any) => item.employee.name,
// //           },
// //           {
// //             key: 'birthday',
// //             header: 'Birthday',
// //             render: (item: any) =>
// //               format(item.birthdayDate, 'MMM d'),
// //           },
// //           {
// //             key: 'actions',
// //             header: 'Actions',
// //             render: (item: any) =>
// //               item.isBirthdayToday && !item.emailSent ? (
// //                 <Button
// //                   size="sm"
// //                   onClick={() =>
// //                     handleSendEmail(item.employee.id)
// //                   }
// //                 >
// //                   <Send className="w-4 h-4 mr-1" />
// //                   Send Email
// //                 </Button>
// //               ) : null,
// //           },
// //         ]} />
// //       ) : (
// //         <EmptyState
// //           icon={Cake}
// //           title="No birthdays found"
// //           description="Try adjusting filters"
// //         />
// //       )}
// //     </DashboardLayout>
// //   );
// // }



// // 'use client';

// // import { useState, useMemo } from 'react';
// // import { Cake, Send } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { format, isToday, startOfDay } from 'date-fns';
// // import { toast } from 'sonner';

// // import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
// // import { PageHeader } from '@/src/component/common/PageHeader';
// // import { SearchInput } from '@/src/component/common/SearchInput';
// // import { DataTable } from '@/src/component/common/DataTable';
// // import { EmptyState } from '@/src/component/common/EmptyState';
// // import { useEmployees } from '@/src/hooks/useEmployeeAPI';
// // import { useBirthdayRecords, useSendBirthdayEmail } from '@/src/hooks/useBirthdayRecord';



// export default function Birthday() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'pending' | 'completed'>('all');

//   const today = new Date();
//   const currentYear = today.getFullYear();

//   // Employees from React Query
//   // const { data: employees = [], isLoading: loadingEmployees } = useEmployees(searchQuery, 1);
//   const { data, isLoading: loadingEmployees } = useEmployees(searchQuery, 1);

//   const employees = Array.isArray(data?.data)
//     ? data.data
//     : [];

//   // Birthday Records from React Query
//   const { data: records = [], isLoading: loadingRecords } = useBirthdayRecords();


//   console.log('employeesData:', employees);
// console.log('recordsData:', records);
//   const sendEmailMutation = useSendBirthdayEmail();

//   const isLoading = loadingEmployees || loadingRecords;

//     // Map records for faster lookup by employeeId
//   const recordMap = useMemo(() => {
//     return new Map(records.map(r => [r.employeeId, r]));
//   }, [records]);


  
//   // Build birthday data
// //   const employeeBirthdayData = useMemo(() => {
// //     return (employees || []).map((emp: any) => {
// //       const record = recordMap.get(emp.id);

// //       // const [month, day] = emp.dob.slice(5).split('-');
// //       // const birthdayThisYear = new Date(currentYear, Number(month) - 1, Number(day));

// //           // Parse DOB safely
// //       // let birthdayThisYear: Date | null = null;
// //       // if (emp.dob) {
// //       //   const [yearStr, monthStr, dayStr] = emp.dob.split('-');
// //       //   if (monthStr && dayStr) {
// //       //     birthdayThisYear = new Date(currentYear, Number(monthStr) - 1, Number(dayStr));
// //       //   }
// //       // }
// //       let birthdayThisYear: Date | null = null;
// // if (emp.dob) {
// //   const dobDate = new Date(emp.dob); // works if emp.dob is Date object or ISO string
// //   birthdayThisYear = new Date(currentYear, dobDate.getMonth(), dobDate.getDate());
// // }
// //       // const isBirthdayToday = isToday(birthdayThisYear);
// //       // const isPast = birthdayThisYear < startOfDay(today) && !isBirthdayToday;

// //         const isBirthdayToday = birthdayThisYear ? isToday(birthdayThisYear) : false;
// //       const isPast = birthdayThisYear ? birthdayThisYear < startOfDay(today) && !isBirthdayToday : false;
// //       return {
// //         id: record?.id || `temp-${emp.id}`,
// //         employee: emp,
// //         birthdayDate: birthdayThisYear,
// //         isBirthdayToday,
// //         isPast,
// //         emailSent: record?.emailSent || false,
// //         spinCompleted: record?.spinCompleted || false,
// //         giftReceived: record?.giftReceived,
// //       };
// //     });
// //   }, [employees, records, currentYear, today]);


// const employeeBirthdayData = useMemo(() => {
//   return employees.map((emp: any) => {
//     const record = recordMap.get(emp.id);

//     let birthdayThisYear: Date | null = null;
//     if (emp.dob) {
//       const dobDate = new Date(emp.dob); // ✅ Works for Prisma Date
//       birthdayThisYear = new Date(currentYear, dobDate.getMonth(), dobDate.getDate());
//     }

//     const isBirthdayToday = birthdayThisYear ? isToday(birthdayThisYear) : false;
//     const isPast = birthdayThisYear ? birthdayThisYear < startOfDay(today) && !isBirthdayToday : false;

//     return {
//       id: record?.id || `temp-${emp.id}`,
//       employee: emp,
//       birthdayDate: birthdayThisYear,
//       isBirthdayToday,
//       isPast,
//       emailSent: record?.emailSent || false,
//       spinCompleted: record?.spinCompleted || false,
//       giftReceived: record?.giftReceived,
//     };
//   });
// }, [employees, records, currentYear, today]);
//   // Filtering
//   const filteredData = useMemo(() => {
//     let filtered = employeeBirthdayData;

//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (i: any) => i.employee.name.toLowerCase().includes(q) || i.employee.department.toLowerCase().includes(q)
//       );
//     }

//     switch (filterStatus) {
//       case 'today':
//         filtered = filtered.filter((i: any) => i.isBirthdayToday);
//         break;
//       case 'pending':
//         filtered = filtered.filter((i: any) => !i.emailSent && i.isBirthdayToday);
//         break;
//       case 'completed':
//         filtered = filtered.filter((i: any) => i.spinCompleted);
//         break;
//     }

//   //   return filtered.sort((a:any, b:any) => a.birthdayDate.getTime() - b.birthdayDate.getTime());
//   // }, [employeeBirthdayData, searchQuery, filterStatus]);


//     // Sort by birthday
//     return filtered.sort((a: any, b: any) => {
//       if (!a.birthdayDate) return 1;
//       if (!b.birthdayDate) return -1;
//       return a.birthdayDate.getTime() - b.birthdayDate.getTime();
//     });
//   }, [employeeBirthdayData, searchQuery, filterStatus]);
//   if (isLoading) return <DashboardLayout><div className="p-8 text-center">Loading...</div></DashboardLayout>;

//   const todayCount = employeeBirthdayData.filter((i: any) => i.isBirthdayToday).length;
//   const pendingCount = employeeBirthdayData.filter((i: any) => !i.emailSent && i.isBirthdayToday).length;

//   console.log('Employee birthdays:', employees.map((emp: any)=> ({
//   name: emp.name,
//   dob: emp.dob,
//   birthdayThisYear: new Date(currentYear, new Date(emp.dob).getMonth(), new Date(emp.dob).getDate()),
//   isToday: isToday(new Date(currentYear, new Date(emp.dob).getMonth(), new Date(emp.dob).getDate()))
// })));
//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Birthday Tracking"
//         subtitle={`${todayCount} birthday${todayCount !== 1 ? 's' : ''} today • ${pendingCount} email${pendingCount !== 1 ? 's' : ''} pending`}
//       />

//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <div className="flex-1">
//           <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or department..." />
//         </div>

//         <Select value={filterStatus} onValueChange={v => setFilterStatus(v as typeof filterStatus)}>
//           <SelectTrigger className="w-full sm:w-48 bg-background">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Employees</SelectItem>
//             <SelectItem value="today">Today's Birthdays</SelectItem>
//             <SelectItem value="pending">Pending Emails</SelectItem>
//             <SelectItem value="completed">Completed Spins</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {filteredData.length ? (
//         <DataTable
//           data={filteredData}
//           columns={[
//             { key: 'employee', header: 'Employee', render: (item: any) => item.employee.name },
//             { key: 'birthday', header: 'Birthday', render: (item: any) => format(item.birthdayDate, 'MMM d') },
//             { key: 'actions', header: 'Actions', render: (item: any) =>
//               item.isBirthdayToday && !item.emailSent ? (
//                 <Button size="sm" onClick={() => sendEmailMutation.mutate(item.employee.id)}>
//                   <Send className="w-4 h-4 mr-1" /> Send Email
//                 </Button>
//               ) : null,
//             },
//           ]}
//         />
//       ) : (
//         <EmptyState icon={Cake} title="No birthdays found" description="Try adjusting filters" />
//       )}
//     </DashboardLayout>
//   );
// }
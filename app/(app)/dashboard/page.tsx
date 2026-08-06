


'use client';

import {
  Users,
  Cake,
  Gift,
  CheckCircle,
  Mail,
  Clock,
  LoaderPinwheel,
} from 'lucide-react';

import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
import { StatCard } from '@/src/component/common/StatCard';
import { PageHeader } from '@/src/component/common/PageHeader';
import { StatusBadge } from '@/src/component/common/StatusBadge';

import { format } from 'date-fns';
import { useDashboardStats } from '@/src/hooks/useDashboard';
import { Loader } from '@/src/component/common/Loader';
import { Employee } from '@/src/types';

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();
//  if (isLoading) {
//   return <Loader className="w-10 h-10 text-primary animate-spin" />
//  }
  const today = new Date();
  const currentYear = today.getFullYear();

  /* ---------------- TODAY BIRTHDAY IDS ---------------- */
  const todayBirthdayIds = new Set(
    data?.todayBirthdays?.map((emp: any) => emp.id) || []
  );

  /* ---------------- RECENT GIFTS (TODAY ONLY) ---------------- */
  // const recentGiftToday = data?.recentGiftActivity
  //   ?.filter((r: any) => {
  //     if (!r.giftReceived) return false;
  //     if (!todayBirthdayIds.has(r.employee.id)) return false;

  //     const receivedAt = new Date(r.giftReceivedAt);
  //     return (
  //       new Date().getTime() - receivedAt.getTime() <=
  //       1000 * 60 * 60 * 24
  //     );
  //   })
  //   .slice(0, 5);

  const recentGiftToday =
  data?.recentGiftActivity
    ?.filter((r: any) => {
      if (!r.giftReceivedId) return false;
      if (!todayBirthdayIds.has(r.employee.id)) return false;

      return true;
    })
    .slice(0, 5) || [];

  /* ---------------- PENDING EMAILS ---------------- */
  const pendingEmailEmployees =
    data?.todayBirthdays?.filter((emp: any) => {
      const record = data?.birthdayRecords?.find(
        (r: any) =>
          r.employeeId === emp.id && r.year === currentYear
      );
      return !record?.emailSent;
    }) || [];

  /* ---------------- NOT SPUN YET ---------------- */
  const notSpunEmployees =
    data?.todayBirthdays?.filter((emp: Employee) => {
      const record = data?.birthdayRecords?.find(
        (r: any) =>
          r.employeeId === emp.id && r.year === currentYear
      );

      return record?.emailSent && !record?.spinCompleted;
    }) || [];

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back! Here's what's happening today.`}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-100">
          <Loader />
        </div>
      ) : (
        <>
          {/* ---------------- STATS ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Total Employees"
              value={data?.totalEmployees ?? 0}
              icon={Users}
              variant="primary"
               
            />

            <StatCard
              title="Today's Birthdays"
              value={data?.todayBirthdays?.length ?? 0}
              icon={Cake}
              variant="success"
              
            />
             <StatCard
          title="Available Gifts"
          value={data?.availableGifts ?? 0}

          subtitle={`of ${data?.totalGifts ?? 0} total`}
          icon={Gift}
          variant="default"
         
        />

            <StatCard
              title="Pending Emails"
              value={pendingEmailEmployees.length}
              icon={Mail}
             
            />

            <StatCard
              title="Pending Spins"
              value={notSpunEmployees.length}
              icon={LoaderPinwheel}
              variant="warning"
               
            />
             
          </div>

          {/* ---------------- MAIN GRID ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ---------------- TODAY BIRTHDAYS ---------------- */}
            <div className="bg-card rounded-xl shadow-card border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-success/10">
                  <Cake className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Today's Birthday Celebrants
                </h3>
              </div>

              {data?.todayBirthdays?.length > 0 ? (
                <div className="space-y-3">
                  {data.todayBirthdays.map((emp: Employee) => {
                    const record = data?.birthdayRecords?.find(
                      (r: any) =>
                        r.employeeId === emp.id &&
                        r.year === currentYear
                    );

                    return (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {emp.name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                            </span>
                          </div>

                          <div>
                            <p className="font-medium text-foreground">
                              {emp.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {emp.department}
                            </p>
                          </div>
                        </div>

                        <div>
                          {record?.spinCompleted ? (
                            <StatusBadge status="success">
                              Gift Selected
                            </StatusBadge>
                          ) : record?.emailSent ? (
                            <StatusBadge status="success">
                              Email Sent
                            </StatusBadge>
                          ) : (
                            <StatusBadge status="pending">
                              Email Not Sent
                            </StatusBadge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No birthdays today
                </p>
              )}
            </div>

            {/* ---------------- RECENT ACTIVITY ---------------- */}
            <div className="bg-card rounded-xl shadow-card border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Recent Gift Activity
                </h3>
              </div>

              <div className="space-y-3">
                {recentGiftToday && recentGiftToday.length > 0 ? (
                  recentGiftToday.map((record: any) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>

                        <div>
                          <p className="font-medium text-foreground">
                            {record.employee.name}
                          </p>
                          {/* <p className="text-sm text-muted-foreground">
                            Received: {record.giftReceived?.name}
                          </p> */}

                          <p className="text-sm text-muted-foreground">
  Won: {record.gift?.name}
</p>
                        </div>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {record.giftReceivedAt &&
                          format(
                            new Date(record.giftReceivedAt),
                            'MMM d, HH:mm'
                          )}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No recent gifts for today's birthdays
                  </p>
                )}
              </div>
            </div>

            {/* ---------------- NOT SPUN YET ---------------- */}
            <div className="bg-card rounded-xl shadow-card border border-border/50 p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-warning/10">
                  <LoaderPinwheel className="w-5 h-5 text-warning" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Pending Spins
                </h3>
              </div>

              {notSpunEmployees.length > 0 ? (
                <div className="space-y-3">
                  {notSpunEmployees.map((emp: Employee) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-warning">
                            {emp.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </span>
                        </div>

                        <div>
                          <p className="font-medium text-foreground">
                            {emp.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {emp.department}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status="warning">
                        Not Spun Yet
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Everyone has spun 🎉
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
'use client';
import { Users, Cake, Gift, CheckCircle, Mail, Clock } from 'lucide-react';
import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
import { StatCard } from '@/src/component/common/StatCard';
import { PageHeader } from '@/src/component/common/PageHeader';
import { StatusBadge } from '@/src/component/common/StatusBadge';
import { mockEmployees, mockBirthdayRecords, mockGifts } from '@/src/mockdata/mockdata';
import { format } from 'date-fns';

export default function Dashboard() {
  const today = new Date();
  const todayStr = format(today, 'MM-dd');
  
  const todayBirthdays = mockEmployees.filter(emp => {
    const empBday = emp.dateOfBirth.slice(5);
    return empBday === todayStr;
  });

  const pendingEmails = mockBirthdayRecords.filter(r => !r.emailSent && r.year === today.getFullYear()).length;
  const completedSpins = mockBirthdayRecords.filter(r => r.spinCompleted).length;
  const availableGifts = mockGifts.filter(g => g.available).length;

  return (
    <DashboardLayout>
      <PageHeader 
        title="Dashboard" 
        subtitle={`Welcome back! Here's what's happening today.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Employees"
          value={mockEmployees.length}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Today's Birthdays"
          value={todayBirthdays.length}
          icon={Cake}
          variant="success"
        />
        <StatCard
          title="Pending Emails"
          value={pendingEmails}
          icon={Mail}
          variant="warning"
        />
        <StatCard
          title="Available Gifts"
          value={availableGifts}
          subtitle={`of ${mockGifts.length} total`}
          icon={Gift}
          variant="default"
        />
      </div>

      {/* Today's Birthdays Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Birthday Celebrants */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/10">
              <Cake className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Today's Birthday Celebrants</h3>
          </div>
          
          {todayBirthdays.length > 0 ? (
            <div className="space-y-3">
              {todayBirthdays.map((emp) => {
                const record = mockBirthdayRecords.find(r => r.employeeId === emp.id && r.year === today.getFullYear());
                return (
                  <div key={emp.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{emp.name}</p>
                        <p className="text-sm text-muted-foreground">{emp.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {record?.emailSent ? (
                        <StatusBadge status="success">Email Sent</StatusBadge>
                      ) : (
                        <StatusBadge status="pending">Pending</StatusBadge>
                      )}
                      {record?.spinCompleted && (
                        <StatusBadge status="success">Gift Selected</StatusBadge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No birthdays today</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Recent Gift Activity</h3>
          </div>
          
          <div className="space-y-3">
            {mockBirthdayRecords.filter(r => r.giftReceived).slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{record.employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Received: {record.giftReceived?.name || 'Gift'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {record.giftReceivedAt && format(new Date(record.giftReceivedAt), 'MMM d, HH:mm')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

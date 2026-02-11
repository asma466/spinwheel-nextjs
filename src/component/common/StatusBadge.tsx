'use client';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'pending' | 'error';
  children: React.ReactNode;
}

const statusStyles = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  pending: 'bg-muted text-muted-foreground',
  error: 'bg-destructive/10 text-destructive',
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span className={cn('status-badge', statusStyles[status])}>
      {children}
    </span>
  );
}

// components/ui/AppButton.tsx
'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppButtonProps extends React.ComponentProps<typeof Button> {
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

export const AppButton = ({ children, icon, loading, className, ...props }: AppButtonProps) => {
  return (
    <Button
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors',
        'bg-[#CE1B22] text-white hover:bg-[#b1191d] disabled:opacity-50 disabled:cursor-not-allowed',
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {icon && !loading && icon}
      {loading ? 'Loading...' : children}
    </Button>
  );
};
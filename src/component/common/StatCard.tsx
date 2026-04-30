// 'use client';
// import { ReactNode } from 'react';
// import { cn } from '@/lib/utils';
// import { Link, LucideIcon } from 'lucide-react';

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   subtitle?: string;
//   icon: LucideIcon;
//   trend?: {
//     value: number;
//     isPositive: boolean;
//   };
//   variant?: 'default' | 'primary' | 'success' | 'warning';
//    href?: string; 
// }

// const variantStyles = {
//   default: 'bg-muted/50 text-muted-foreground',
//   primary: 'bg-primary/10 text-primary',
//   success: 'bg-success/10 text-success',
//   warning: 'bg-warning/10 text-warning',
// };

// export function StatCard({ title, value, subtitle,   href,  icon: Icon, trend, variant = 'default' }: StatCardProps) {
//   // return (

//   //   <div className="stat-card">
//   //     <div className="flex items-start justify-between">
//   //       <div className="space-y-1">
//   //         <p className="text-sm font-medium text-muted-foreground">{title}</p>
//   //         <p className="text-2xl font-semibold text-foreground">{value}</p>
//   //         {subtitle && (
//   //           <p className="text-xs text-muted-foreground">{subtitle}</p>
//   //         )}
//   //         {trend && (
//   //           <p className={cn(
//   //             'text-xs font-medium',
//   //             trend.isPositive ? 'text-success' : 'text-destructive'
//   //           )}>
//   //             {trend.isPositive ? '+' : ''}{trend.value}% from last month
//   //           </p>
//   //         )}
//   //       </div>
//   //       <div className={cn('p-3 rounded-xl', variantStyles[variant])}>
//   //         <Icon className="w-5 h-5" />
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
//     const cardContent = (
//        <div className="stat-card">
//        <div className="flex items-start justify-between">
//          <div className="space-y-1">
//            <p className="text-sm font-medium text-muted-foreground">{title}</p>
//            <p className="text-2xl font-semibold text-foreground">{value}</p>
//            {subtitle && (
//             <p className="text-xs text-muted-foreground">{subtitle}</p>
//           )}
//           {trend && (
//             <p className={cn(
//               'text-xs font-medium',
//               trend.isPositive ? 'text-success' : 'text-destructive'
//             )}>
//               {trend.isPositive ? '+' : ''}{trend.value}% from last month
//             </p>
//           )}
//         </div>
//         <div className={cn('p-3 rounded-xl', variantStyles[variant])}>
//           <Icon className="w-5 h-5" />
//         </div>
//       </div>
//     </div>
//     // <div className="stat-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
//     //   <div className="flex items-start justify-between">
//     //     <div className="space-y-1">
//     //       <p className="text-sm font-medium text-muted-foreground">
//     //         {title}
//     //       </p>

//     //       <p className="text-2xl font-semibold text-foreground">
//     //         {value}
//     //       </p>

//     //       {subtitle && (
//     //         <p className="text-xs text-muted-foreground">
//     //           {subtitle}
//     //         </p>
//     //       )}

//     //       {trend && (
//     //         <p
//     //           className={cn(
//     //             'text-xs font-medium',
//     //             trend.isPositive
//     //               ? 'text-success'
//     //               : 'text-destructive'
//     //           )}
//     //         >
//     //           {trend.isPositive ? '+' : ''}
//     //           {trend.value}% from last month
//     //         </p>
//     //       )}
//     //     </div>

//     //     <div
//     //       className={cn(
//     //         'p-3 rounded-xl',
//     //         variantStyles[variant]
//     //       )}
//     //     >
//     //       <Icon className="w-5 h-5" />
//     //     </div>
//     //   </div>
//     // </div>
//   );

//   // ✅ If href exists → make card clickable
//   if (href) {
//     return (
//       <Link href={href} className="block">
//         {cardContent}
//       </Link>
//     );
//   }

//   return cardContent;
    
// }


'use client';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-muted/50 text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', variantStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
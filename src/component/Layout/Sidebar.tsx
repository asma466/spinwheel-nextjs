'use client';
import { 
  LayoutDashboard, 
  Users, 
  Cake, 
  Gift, 
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Settings,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarLogo } from '../common/Logo';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/employees', icon: Users, label: 'Employees' },
  { href: '/today-birthday', icon: Cake, label: 'Birthdays' },
  { href: '/gifts', icon: Gift, label: 'Gifts' },
  { href: '/logs', icon: ClipboardList, label: 'Logs' },
  { href: '/settings', icon: Settings, label: 'Settings' },

];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
  //   <aside
  //   // 'bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out',
  //    className={cn(
  //   collapsed ? 'w-16' : 'w-64',
  //   'sidebar-container fixed top-0 left-0'
  // )}
  <aside
  className={cn(
    collapsed ? 'w-16' : 'w-64',
    'fixed top-0 left-0 h-screen flex flex-col bg-white border-r border-border z-50 transition-all duration-300 ease-in-out'
  )}

    >
   
      {/* Logo */}
      {/* <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <PartyPopper className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground tracking-tight">
              <Logo/>
            </span>
          )}
        </div>
      </div> */}
      <SidebarLogo collapsed={collapsed} />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'nav-item',
               isActive
    ? 'bg-[#CE1B22] text-white hover:bg-[#b9171d]'
    : 'hover:bg-white hover:text-[#CE1B22]',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      {/* <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={onToggle}
          className={cn(
            'nav-item nav-item-inactive w-full',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div> */}
    </aside>
  );
}

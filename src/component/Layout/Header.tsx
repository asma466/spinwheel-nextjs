// 'use client';
// import { Menu, LogOut, User } from 'lucide-react';
// // import { useAuth } from '@/contexts/AuthContext';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'next-auth/react';

// interface HeaderProps {
//   onToggleSidebar: () => void;
// }

// export function Header({ onToggleSidebar }: HeaderProps) {
// //   const { user, logout } = useAuth();
//   const navigate = useRouter()

//   const handleLogout = async () => {
//     // Sign out using NextAuth
//     await signOut({ redirect: false });
//     // Redirect to login page
//     navigate.push('/login');
//   };
//   return (
//     <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
//       <button
//         onClick={onToggleSidebar}
//         // className="lg:hidden p-2 hover:bg-muted color-black rounded-lg transition-colors"
//         className="p-2  color-black rounded-lg transition-colors"
//       >
//         <Menu size={25} className=" color-black text-[#CE1B22]" />
//       </button>

//       <div className="flex-1" />

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="flex items-center gap-3 px-3">
//             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//               <User className="w-4 h-4 text-primary" />
//             </div>
//             {/* <div className="hidden sm:block text-left">
//               <p className="text-sm font-medium text-foreground">{user?.name}</p>
//               <p className="text-xs text-muted-foreground">{user?.role.toUpperCase()}</p>
//             </div> */}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
//           <DropdownMenuItem className="text-muted-foreground">
//             <User className="w-4 h-4 mr-2" />
//             Profile
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
//             <LogOut className="w-4 h-4 mr-2" />
//             Logout
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </header>
//   );
// }



'use client';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Sign out using NextAuth
    await signOut({ redirect: false });
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#CE1B22]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="destructive"
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </header>
  );
}
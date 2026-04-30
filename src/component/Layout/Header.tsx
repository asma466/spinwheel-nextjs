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



// 'use client';
// import { LogOut } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { signOut, useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// interface HeaderProps {
//   onToggleSidebar: () => void;
// }

// export function Header({ onToggleSidebar }: HeaderProps) {
//   const router = useRouter();

//   const handleLogout = async () => {
//     // Sign out using NextAuth
//     await signOut({ redirect: false });
//     // Redirect to login page
//     router.push('/login');
//   };
//  const { data: session } = useSession();
//    // Get initials for avatar
//   // Type-safe initials function
//   const getInitials = (name?: string | null) => {
//     if (!name) return 'U'; // fallback if name is null or undefined
//     const names = name.trim().split(' ');
//     return names.map(n => n[0].toUpperCase()).slice(0, 2).join('');
//   };

//   // Type-safe role
//   const userRole = session?.user?.role ? session.user.role.toUpperCase() : 'USER';


//   return (
//     <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
//       <button
//         onClick={onToggleSidebar}
//         className="p-2 rounded-lg"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6 text-[#CE1B22]"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       <div className="flex-1" />
//          {/* 🔹 User Avatar */}
//         <div className="  text-white bg-[#CE1B22] font-semibold w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
//           {getInitials(session?.user?.name)}
//         </div>

//         {/* 🔹 User Role Badge */}
//         {/* <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
//           {session?.user?.role || 'USER'}
//         </span> */}

//       {/* Logout Button */}
//       <Button
//         onClick={handleLogout}
//         variant="destructive"
//         className="flex items-center gap-2"
//       >
//         <LogOut className="w-4 h-4" />
//         Logout
//       </Button>
//     </header>
//   );
// }





// 'use client';
// import { LogOut, User } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { signOut, useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import Avatar from '../common/Avatar';


// interface HeaderProps {
//   onToggleSidebar: () => void;
// }

// export function Header({ onToggleSidebar }: HeaderProps) {
//   const router = useRouter();
//   const { data: session } = useSession();

//   const handleLogout = async () => {
//     await signOut({ redirect: false });
//     router.push('/login');
//   };

//   const getInitials = (name?: string | null) => {
//     if (!name) return 'U';
//     const names = name.trim().split(' ');
//     return names.map(n => n[0].toUpperCase()).slice(0, 2).join('');
//   };

//   const userRole = session?.user?.role ? session.user.role.toUpperCase() : 'USER';
//   const userEmail = session?.user?.email || 'No Email';

//   return (
//     // <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
     
//     <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 lg:px-6
// bg-white/60 dark:bg-black/40 backdrop-blur-lg border-b border-white/20 dark:border-white/10 shadow-sm
// transition-all duration-300">
//   {/* Sidebar toggle button */}
//       <button onClick={onToggleSidebar} className="p-2 rounded-lg">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6 text-[#CE1B22]"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//  <div className="flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2">
//   <span className="text-2xl">🎉</span>
//   <h1 className="font-heading font-bold text-xl lg:text-2xl italic tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#CE1B22] to-gray-700">
//     Zeta SpinWheel Dashboard
//   </h1>
//   <span className="text-2xl">🎉</span>
// </div>
//  {/* <div className="flex items-center justify-center gap-2 mb-1">
//             <span className="text-2xl">🎡</span>
//             <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
//               SpinWheel Rewards
//             </h1>
//             <span className="text-2xl">🎉</span>
//           </div> */}
//       {/* User account dropdown */}
//       {/* <DropdownMenu> */}
//         {/* <DropdownMenuTrigger asChild>
//           <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[#CE1B22] border-none text-white font-semibold text-sm">
//             {getInitials(session?.user?.name)}
//           </button>
//         </DropdownMenuTrigger> */}
//             {/* User avatar dropdown */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Avatar
//             name={session?.user?.name || 'User'}
//             imageUrl={session?.user?.image || undefined}
//             size={36} // Adjust size as needed
//           />
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end" className="w-56 bg-popover">
//           {/* User info */}
//           <div className="p-3 border-b border-border">
//             <p className="text-sm font-medium text-foreground">{session?.user?.name || 'User'}</p>
//             <p className="text-xs text-muted-foreground">{userEmail}</p>
//             <p className="text-xs text-muted-foreground mt-1">{userRole}</p>
//           </div>

//           {/* Logout */}
//           <DropdownMenuItem onClick={handleLogout} className="text-destructive flex items-center gap-2">
//             <LogOut className="w-4 h-4" />
//             Logout
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </header>
//   );
// }




'use client';

import { LogOut, Menu, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import Avatar from '../common/Avatar';
import { useState } from 'react';


interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  
const { data: session, status } = useSession();
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const [isOpen, setIsOpen] = useState(false);
  const userRole = session?.user?.role ? session.user.role.toUpperCase() : 'USER';
  const userEmail = session?.user?.email || 'No Email';

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 lg:px-6
      bg-white/60 dark:bg-black/40 backdrop-blur-lg border-b border-white/20 dark:border-white/10 shadow-sm
      transition-all duration-300">

      {/* Sidebar toggle button */}
    

      {/* <button
  onClick={() => {
    onToggleSidebar();
    setIsOpen(prev => !prev);
  }}
  className="p-2 rounded-lg transition-all duration-300"
>
  <div className="relative w-6 h-6">
    
    <X
      className={`absolute inset-0 text-[#CE1B22] transition-all duration-300 ${
        isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
      }`}
    />

    
    <Menu
      className={`absolute inset-0 text-[#CE1B22] transition-all duration-300 ${
        isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
      }`}
    />
  </div>
</button> */}


<button
  onClick={onToggleSidebar}
  className="p-2 rounded-lg transition-all duration-300"
>
  <Menu className="w-6 h-6 text-[#CE1B22]" />
</button>
      {/* Header title */}
      <div className="flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2">
        <span className="text-2xl">🎉</span>
        <h1 className="font-heading font-bold text-xl lg:text-2xl italic tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#CE1B22] to-gray-700">
           WheelSpin Dashboard
        </h1>
        <span className="text-2xl">🎉</span>
      </div>

      {/* User avatar dropdown */}
      <DropdownMenu>
        {/* <DropdownMenuTrigger asChild> */}
          {/* <Avatar
            name={session?.user?.name || 'User'}
            imageUrl={session?.user?.image || undefined}
            size={45}
          /> */}

          {/* {status === 'loading' ? (
  <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
) : (
  <Avatar
    name={session?.user?.name || ''}
    imageUrl={session?.user?.image || undefined}
    size={36}
  />
)}
        </DropdownMenuTrigger> */}
        <DropdownMenuTrigger asChild>
  <div className="focus:outline-none">
    {status === 'loading' ? (
      <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
    ) : (
      <Avatar
        name={session?.user?.name || ''}
        imageUrl={session?.user?.image || undefined}
        size={46}
      />
    )}
  </div>
</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 bg-popover">
          {/* User info */}
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
            <p className="text-xs text-muted-foreground mt-1">{userRole}</p>
          </div>

          {/* Logout */}
          <DropdownMenuItem onClick={handleLogout} className="text-destructive flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
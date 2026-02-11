// 'use client';

// import { Session } from 'next-auth';
// import { Button } from '@/components/ui/button';
// import { signOut } from 'next-auth/react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { LogOut, Settings } from 'lucide-react';
// import Link from 'next/link';

// interface DashboardHeaderProps {
//   session: Session | null;
// }

// export function DashboardHeader({ session }: DashboardHeaderProps) {
//   return (
//     <header className="border-b bg-white">
//       <div className="flex items-center justify-between px-6 py-4">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
//           <p className="text-sm text-muted-foreground">
//             Welcome back, {session?.user?.name || session?.user?.email}!
//           </p>
//         </div>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//               <Avatar className="h-10 w-10">
//                 <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || 'User'} />
//                 <AvatarFallback className="bg-primary text-primary-foreground">
//                   {session?.user?.name
//                     ?.split(' ')
//                     .map((n) => n[0])
//                     .join('')
//                     .toUpperCase() || 'U'}
//                 </AvatarFallback>
//               </Avatar>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <div className="px-2 py-1.5">
//               <p className="text-sm font-medium">{session?.user?.name}</p>
//               <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
//             </div>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
//                 <Settings className="mr-2 h-4 w-4" />
//                 Settings
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => signOut({ redirectTo: '/login' })}
//               className="flex items-center cursor-pointer text-red-600"
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// }

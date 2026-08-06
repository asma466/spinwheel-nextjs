


"use client";

import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Avatar from "../common/Avatar";
import { useLogoutActivity } from "@/src/hooks/useLogs";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();

  const { data: session, status } = useSession();

  const logoutMutation = useLogoutActivity();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // const handleLogout = async () => {
  //   try {
  //     setIsLoggingOut(true);

  //      logoutMutation.mutateAsync();

  //     await signOut({
  //       redirect: false,
  //     });

  //     router.replace("/login");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   } finally {
  //     setIsLoggingOut(false);
  //   }
  // };


    const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Save logout activity (don't block logout if it fails)
      try {
        await logoutMutation.mutateAsync();
      } catch (err) {
        console.error("Failed to save logout activity:", err);
      }

      // Sign out and redirect
      await signOut({
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const userRole = session?.user?.role?.toUpperCase() ?? "USER";
  const userEmail = session?.user?.email ?? "No Email";

  return (
    <header
      className="
        sticky top-0 z-50
        h-16
        flex items-center
        justify-between
        gap-3
        px-3
        sm:px-5
        lg:px-6
        bg-white/70
        backdrop-blur-lg
        border-b
        border-gray-200
        shadow-sm
      "
    >
      {/* Left */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            hover:bg-gray-100
            transition
          "
        >
          <Menu className="h-6 w-6 text-[#CE1B22]" />
        </button>
      </div>

      {/* Center */}
      <div className="flex-1 flex justify-center overflow-hidden px-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="hidden sm:block text-xl">🎉</span>

          <h1
            className="
              truncate
              font-heading
              font-bold
              italic
              tracking-wide
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-[#CE1B22]
              to-gray-700
            "
          >
            {/* Mobile */}
            <span className="sm:hidden text-base">
              WheelSpin
            </span>

            {/* Tablet */}
            <span className="hidden sm:inline lg:hidden text-xl">
              WheelSpin Dashboard
            </span>

            {/* Desktop */}
            <span className="hidden lg:inline text-2xl tracking-[0.12em]">
              WheelSpin Dashboard
            </span>
          </h1>

          <span className="hidden sm:block text-xl">🎉</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#CE1B22]">
              {status === "loading" ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Avatar
                  name={session?.user?.name || "User"}
                  imageUrl={session?.user?.image || undefined}
                  size={42}
                />
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-60 max-w-[90vw]"
          >
            <div className="border-b px-4 py-3">
              <p className="font-semibold text-sm">
                {session?.user?.name || "User"}
              </p>

              <p className="text-xs text-muted-foreground break-all">
                {userEmail}
              </p>

              <p className="mt-1 text-xs font-medium text-gray-500">
                {userRole}
              </p>
            </div>

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex logout-menu-item items-center gap-2 text-red-600 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />

              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
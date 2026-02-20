'use client';

import Image from 'next/image';

interface SidebarLogoProps {
  collapsed: boolean;
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <div className="flex items-center gap-3 justify-center h-16 px-4 ">
      <Image
        src="/logo.png"   // make sure this exists in /public
        alt="Logo"
        width={40}
        height={40}
        className="rounded-md"
        priority
      />

      {!collapsed && (
        <span className="font-semibold text-foreground tracking-tight">
          {/* Optional: remove text completely if you want ONLY logo */}
        </span>
      )}
    </div>
  );
}
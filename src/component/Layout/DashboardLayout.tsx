// "use client";

// import { ReactNode, useState } from "react";
// import { Header } from "./Header";
// import { Sidebar } from "./Sidebar";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // return (
//   //   <div className="min-h-screen  flex bg-white">
//   //     <Sidebar
//   //       collapsed={sidebarCollapsed}
//   //       onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//   //     />
//   //     <div className="flex-1 flex flex-col min-h-screen">
//   //       <Header
//   //         onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
//   //       />
//   //       <main className="flex-1 dashboard-content animate-fade-in">
//   //         {children}
//   //       </main>
//   //     </div>
//   //   </div>
//   // );

//    return (
//     // <div className="min-h-screen flex bg-white">
//     //   <Sidebar
//     //     collapsed={sidebarCollapsed}
//     //     onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//     //   />
//     //   <div
//     //     className={cn(
//     //       'flex-1 flex flex-col min-h-screen transition-all duration-300',
//     //       sidebarCollapsed ? 'ml-16' : 'ml-64'
//     //     )}
//     //   >
//     //     <Header
//     //       onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
//     //     />
//     //     <main className="flex-1 dashboard-content animate-fade-in">
//     //       {children}
//     //     </main>
//     //   </div>
//     // </div>
//     <div className="min-h-screen flex bg-white">
//   <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
//   {/* <div className="flex-1 flex flex-col min-h-screen">
//     <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
//     <main className="flex-1 dashboard-content animate-fade-in">
//       {children}
//     </main>
//   </div> */}

// </div>
//   );
// }


"use client";

import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      {/* Main content area with margin to account for fixed sidebar */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 dashboard-content animate-fade-in min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

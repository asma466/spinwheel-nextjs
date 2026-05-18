// 'use client';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactNode, useState } from 'react';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// export default function ReactQueryProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   // useState ensures ONE instance on the client
//   const [queryClient] = useState(() => new QueryClient());

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//         <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }



'use client';

import { ReactNode, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </SessionProvider>
  );
}
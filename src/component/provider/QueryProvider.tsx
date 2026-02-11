'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  // useState ensures ONE instance on the client
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

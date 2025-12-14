'use client'; // This must be a Client Component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays fresh for 5 min, then refetches in background (less aggressive)
        staleTime: 5 * 60 * 1000, 
        gcTime: 5 * 60 * 1000, // Keep inactive data 5 min before GC
        retry: 3, // Retry failed requests 3x
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
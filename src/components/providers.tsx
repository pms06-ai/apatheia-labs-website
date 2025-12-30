'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1C1C1E',
            color: '#F5F5F1',
            border: '1px solid rgba(245,245,241,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#4A9A6A',
              secondary: '#F5F5F1',
            },
          },
          error: {
            iconTheme: {
              primary: '#C94A4A',
              secondary: '#F5F5F1',
            },
          },
        }}
      />
    </QueryClientProvider>
  )
}

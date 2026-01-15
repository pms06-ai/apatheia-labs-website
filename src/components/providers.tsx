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
            background: 'var(--color-bg-tertiary, #1c1c1e)',
            color: 'var(--color-charcoal-50, #f5f5f5)',
            border: '1px solid var(--color-charcoal-700, #232325)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-status-success, #4a9a6a)',
              secondary: 'var(--color-charcoal-50, #f5f5f5)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-status-critical, #c94a4a)',
              secondary: 'var(--color-charcoal-50, #f5f5f5)',
            },
          },
        }}
      />
    </QueryClientProvider>
  )
}

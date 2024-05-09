import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink, loggerLink } from '@trpc/client'
import React, { useRef } from 'react'
import { trpc } from '../utils/trpc'
import { useToast } from '@vita/components'

export function TRpcProvider({ children }: React.PropsWithChildren) {
  const toast = useToast()
  const queryClient = useRef(new QueryClient())
  const trpcClient = useRef(
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' &&
              typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        (opt) =>
          ({ op, ...args }) => {
            return httpLink({
              url: '/api',
              transformer: {
                serialize: (object) => {
                  console.log('>>', object)
                  return object
                },
                deserialize: (object) => {
                  if (object?.message) {
                    toast.toast({
                      title: '错误提示',
                      description: object?.message,
                    })
                  }
                  return object
                },
              },
              async headers() {
                return {
                  Authorization: '',
                }
              },
            })(opt)({ ...args, op: { ...op, path: op.path.replace(/\./g, '/') } })
          },
      ],
    })
  )

  return (
    <trpc.Provider
      client={trpcClient.current}
      queryClient={queryClient.current}
    >
      <QueryClientProvider client={queryClient.current}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}

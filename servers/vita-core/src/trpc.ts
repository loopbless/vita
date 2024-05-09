import { initTRPC } from '@trpc/server'
import { type Context } from './context.js'

const trpc = initTRPC
  .context<Context>()
  .create({
    transformer: {
      serialize: (object: any) => {
        // console.log('-->>', object)
        return object
      },
      deserialize: (object: any) => {
        // console.log('--<<', object)
        return object
      },
    },
  })

export const router = trpc.router
export const publicProcedure = trpc.procedure
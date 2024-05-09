import db from '../database/index.js'
import z from 'zod'
import { router, publicProcedure, uuid, nanoid } from '@vita/core'

export default router({
  create: publicProcedure
    .input(
      z.object({
        clientName: z
          .string({ required_error: '客户端名不能为空' })
          .min(2, '客户端名最少2位数'),
        grants: z
          .array(z.enum(['password', 'refresh_token', 'authorization_code']), {
            required_error: '授权类型不能为空',
          })
          .min(1, '授权类型不能为空'),
        scope: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { scope, grants, ...data } = input
      return await db.clients.create({
        data: {
          ...data,
          clientId: uuid(),
          clientSecret: nanoid(24),
          scope,
          grants: grants.toString(),
        },
      })
    }),
  update: publicProcedure
    .input(
      z.object({
        clientId: z.string({ required_error: '客户端ID不能为空' }),
        clientName: z
          .string({ required_error: '客户端名不能为空' })
          .min(2, '客户端名最少2位数'),
        grants: z.string({ required_error: '授权类型不能为空' }),
        scope: z.string().optional(),
      })
    )
    .mutation(async ({ input: { clientId, ...data } }) => {
      await db.clients.update({ data, where: { clientId } })
      return
    }),
  secret: publicProcedure
    .input(z.string({ required_error: '客户端ID不能为空' }))
    .mutation(async ({ input }) => {
      await db.clients.update({
        data: { clientSecret: nanoid(24) },
        where: { clientId: input },
      })
      return
    }),
  page: publicProcedure
    .input(
      z.object({
        pageSize: z.number({ required_error: '分页大小不能为空' }),
        pageNumber: z.number({ required_error: '分页页码不能为空' }),
        keyword: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { pageSize, pageNumber, keyword } = input
      const where = { clientName: { contains: keyword as string } }
      const clients = await db.clients.findMany({
        take: +pageSize!,
        skip: +pageSize! * (+pageNumber! - 1),
        where,
        select: {
          id: true,
          clientId: true,
          clientName: true,
          grants: true,
          scope: true,
          status: true,
        },
      })
      const nums = await db.clients.count({
        take: +pageSize!,
        skip: +pageSize! * (+pageNumber! - 1),
        where,
      })
      return { total: nums, data: clients }
    }),
})

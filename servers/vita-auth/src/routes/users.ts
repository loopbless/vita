import { router, publicProcedure, uuid } from '@vita/core'
import db, { enforccer } from '../database/index.js'
import { z } from 'zod'
import crypto from 'crypto'
import { TRPCError } from '@trpc/server'

export default router({
  create: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(4, '用户名最少4位')
          .max(50, '用户名不能超过50位'),
        password: z
          .string({ required_error: '密码不能为空' })
          .min(8, '密码最少8位数')
          .regex(/[^\s\u4e00-\u9fa5]/, '密码不能包含中文和空格')
          // eslint-disable-next-line no-useless-escape
          .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-=_+\[\]{}\\|;:'"\/?.>,<])[\da-zA-Z`~!@#$%^&*()-=_+\[\]{}\\|;:'"\/?.>,<]{4,10}/,
            '密码必须包含字母、数字和特殊字符'
          ),
        email: z.string().email('邮箱格式不正确').optional(),
        phone: z
          .string()
          .regex(/^1\d{10}$/, '手机号格式不正确')
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const pwd = crypto
        .createHmac('sha256', input.username)
        .update(input.password)
        .digest('hex')
      try {
        await db.users.create({
          data: { ...input, password: pwd, userId: uuid() },
        })
      } catch (error: any) {
        let message = '系统异常！'
        if (error.code == 'P2002') {
          message = '账号已存在，请进行登录！'
        }
        throw new TRPCError({ message, code: 'BAD_REQUEST' })
      }
    }),
  update: {
    user: publicProcedure
      .input(
        z.object({
          username: z
            .string()
            .min(4, '用户名最少4位')
            .max(50, '用户名不能超过50位')
            .optional(),
          email: z.string().email('邮箱格式不正确').optional(),
          phone: z
            .string()
            .regex(/^1\d{10}$/, '手机号格式不正确')
            .optional(),
          avatar: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx: { user } }) => {
        const userInfo = await db.users.update({
          data: input,
          where: { userId: user.userId },
          select: { username: true, email: true, phone: true, avatar: true },
        })
        Object.assign(user, userInfo)
      }),
    password: publicProcedure
      .input(
        z.object({
          oldPassword: z.string({ required_error: '原密码不能为空' }),
          newPassword: z
            .string({ required_error: '新密码不能为空' })
            .min(8, '密码最少8位数')
            .regex(/[^\s\u4e00-\u9fa5]/, '密码不能包含中文和空格')
            // eslint-disable-next-line no-useless-escape
            .regex(
              /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-=_+\[\]{}\\|;:'"\/?.>,<])[\da-zA-Z`~!@#$%^&*()-=_+\[\]{}\\|;:'"\/?.>,<]{4,10}/,
              '密码必须包含字母、数字和特殊字符'
            ),
        })
      )
      .mutation(async ({ ctx: { user }, input }) => {
        const pwd = crypto
          .createHmac('sha256', user.username)
          .update(input.newPassword)
          .digest('hex')
        await db.users.update({
          data: { password: pwd },
          where: { userId: user.userId },
        })
      }),
  },
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
      const where = keyword
        ? {
            status: true,
            OR: [
              { username: { contains: keyword as string } },
              { email: { contains: keyword as string } },
              { phone: { contains: keyword as string } },
            ],
          }
        : { status: true }
      const users = await db.users.findMany({
        take: +pageSize!,
        skip: +pageSize! * (+pageNumber! - 1),
        where,
        select: {
          userId: true,
          username: true,
          email: true,
          phone: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      const nums = await db.users.count({
        take: +pageSize!,
        skip: +pageSize! * (+pageNumber! - 1),
        where,
      })
      return { total: nums, data: users }
    }),
  resources: publicProcedure
    .input(z.string({ required_error: '用户ID不能为空' }))
    .query(async ({ input }) => {
      const rules = await enforccer.getImplicitResourcesForUser(`u:${input}`)
      return await db.resources.findMany({
        where: { id: { in: rules.map(([, res]) => +res) }, status: true },
        select: {
          resourceId: true,
          resourceCode: true,
          resourceType: true,
          resourceIcon: true,
          parentId: true,
          sort: true,
          resourcePath: true,
        },
      })
    }),
  roles: {
    list: publicProcedure
      .input(z.string({ required_error: '用户ID不能为空' }).nullish())
      .query(async ({ input }) => {
        const rules = await enforccer.getImplicitRolesForUser(`u:${input}`)
        return await db.roles.findMany({
          where: { id: { in: rules.map(([, res]) => +res) }, status: true },
          select: {
            roleId: true,
            roleName: true,
            description: true,
          },
        })
      }),
    create: publicProcedure
      .input(
        z.object({
          userId: z.string({ required_error: '用户ID不能为空' }),
          roles: z.array(z.string({ required_error: '角色ID不能为空' })),
        })
      )
      .mutation(async ({ input }) => {
        await enforccer.addNamedPolicies(
          'g',
          input.roles.map((role) => [`u:${input.userId}`, `r:${role}`])
        )
        return
      }),
  },
})

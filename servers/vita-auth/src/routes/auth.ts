import { Request, Response } from "oauth2-server";
import oauth2Server from "../oauth/server.js";
// import { db } from "../database";
import { router, publicProcedure } from "@vita/core";
import z from "zod";

// const router = new HyperExpress.Router();

// router.post(
//   "/token",
//   async (req, res, next) => {
//     await zodValidate({
//       body: z.object({
//         client_id: z.string({ required_error: "客户ID不能为空" }),
//         client_secret: z.string({ required_error: "客户端秘钥不能为空" }),
//         grant_type: z.string({ required_error: "认证授予类型不能为空" }),
//         username: z.string().optional(),
//       }),
//     })(req, res, next);
//     const { grant_type } = await req.urlencoded();
//     if (grant_type === "password") {
//       await zodValidate({
//         body: z.object({
//           username: z.string({ required_error: "用户名不能为空" }),
//           password: z.string({ required_error: "密码不能为空" }),
//         }),
//       })(req, res, next);
//     } else if (grant_type === "refresh_token") {
//       await zodValidate({
//         body: z.object({
//           refresh_token: z.string({ required_error: "刷新token不能为空" }),
//         }),
//       })(req, res, next);
//     }
//   },
//   async (req, res) => {
//     const data = await req.urlencoded();
//     const auth = await oauth2Server.token(
//       new Request({
//         query: req.query,
//         method: req.method,
//         body: data,
//         headers: req.headers,
//       }),
//       new Response(res)
//     );
//     res.json(auth);
//   }
// );

// export default router;

export default router({
  // getUser: publicProcedure.input(z.string()).query((opts) => {
  //   opts.input; // string
  //   return { id: opts.input, name: "Bilbo" };
  // }),
  token: publicProcedure
    .input(
      z.object({
        client_id: z.string({ required_error: "客户ID不能为空" }),
        client_secret: z.string({ required_error: "客户端秘钥不能为空" }),
        grant_type: z.string({ required_error: "认证授予类型不能为空" }),
        username: z.string().optional(),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ctx, input}) => {
      ctx.req.headers['content-type'] = 'application/x-www-form-urlencoded'
      const auth = await oauth2Server.token(
        new Request({
          method: "POST",
          body: input,
          query: input,
          headers: ctx.req.headers,
        }),
        new Response()
      );
      console.log(ctx)
      return auth
    }),

  // a: t.router({}),
});

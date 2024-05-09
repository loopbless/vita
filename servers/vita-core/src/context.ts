import { type CreateContextOptions } from 'trpc-uwebsockets';

export type Context = Awaited<ReturnType<typeof createTRpcContext>>;

export function createTRpcContext({ req, res }: CreateContextOptions) {
  const getUser = () => {
    if (req.headers.authorization === 'meow') {
      return {
        name: 'KATT',
      } as any;
    }
    return null;
  };
  req.url = req.url.replace(/\//g, '.')
  return {
    req,
    res,
    user: getUser(),
  };
};
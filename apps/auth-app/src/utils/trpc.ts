import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../../servers/vita-auth/src/routes';

export const trpc = createTRPCReact<AppRouter>();
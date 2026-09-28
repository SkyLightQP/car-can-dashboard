import { createTRPCClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '@/types/collector';

export const collectorClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: process.env.COLLECTOR_TRPC_URL ?? 'http://localhost:3000/trpc' })],
});

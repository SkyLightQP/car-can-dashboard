import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createContext } from 'react-router';

import type { AppRouter } from '@/types/collector';

const COLLECTOR_TRPC_URL = process.env.COLLECTOR_TRPC_URL ?? 'http://localhost:3000/trpc';

export function createCollectorClient(token: string) {
  return createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: COLLECTOR_TRPC_URL, headers: { authorization: `Bearer ${token}` } })],
  });
}

export type CollectorClient = ReturnType<typeof createCollectorClient>;

export const collectorContext = createContext<CollectorClient>();

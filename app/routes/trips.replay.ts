import { collectorContext } from '@/libs/collector-client.server';
import type { ReplayRange } from '@/libs/drive-replay';

import type { Route } from './+types/trips.replay';

export async function loader({ request, context }: Route.LoaderArgs) {
  const range: ReplayRange = new URL(request.url).searchParams.get('range') === 'today' ? 'today' : 'last';
  const sessions = await context
    .get(collectorContext)
    .trips.replay.query({ range })
    .catch(() => null);

  return { range, sessions };
}

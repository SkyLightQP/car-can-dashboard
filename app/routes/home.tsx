import { Button } from '@heroui/react';

import type { Route } from './+types/home';

export function meta(_: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <Button variant="primary">HeroUI Button</Button>
    </main>
  );
}

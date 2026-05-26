import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm font-medium text-muted-foreground">Dave OS starter</p>
        <h1 className="text-5xl font-semibold tracking-normal">__APP_TITLE__</h1>
        <p className="text-lg leading-8 text-muted-foreground">__APP_DESCRIPTION__</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/sign-up">Create account</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/app">Open app</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

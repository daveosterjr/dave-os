import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { WorkspaceProvider } from '@/context/workspace-provider';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span className="font-semibold">__APP_TITLE__</span>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <a href="/app">App</a>
              <a href="/settings">Settings</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </WorkspaceProvider>
  );
}

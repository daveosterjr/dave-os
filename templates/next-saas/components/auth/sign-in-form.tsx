'use client';

import { useSignIn } from '@clerk/nextjs/legacy';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignInForm() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <MissingClerkConfig mode="sign in" />;
  }

  return <ConfiguredSignInForm />;
}

function ConfiguredSignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;

    setPending(true);
    setError(null);

    try {
      const result = await signIn.create({ identifier, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push(searchParams.get('redirect_url') || '/app');
      } else {
        setError('Additional verification is required. Add that strategy for this app.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="identifier">Email</Label>
            <Input
              id="identifier"
              autoComplete="email"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={pending || !isLoaded}>
            {pending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          No account? <Link className="font-medium text-foreground" href="/sign-up">Create one</Link>
        </p>
      </CardContent>
    </Card>
  );
}

function MissingClerkConfig({ mode }: { mode: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clerk is not configured</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code> in
        <code> .env.local</code> to {mode}.
      </CardContent>
    </Card>
  );
}

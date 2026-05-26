'use client';

import { useSignUp } from '@clerk/nextjs/legacy';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignUpForm() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <MissingClerkConfig mode="create an account" />;
  }

  return <ConfiguredSignUpForm />;
}

function ConfiguredSignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;

    setPending(true);
    setError(null);

    try {
      const result = await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/app');
      } else {
        setError('Email verification or another strategy is required. Add that step for this app.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email</Label>
            <Input id="emailAddress" type="email" value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={pending || !isLoaded}>
            {pending ? 'Creating...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link className="font-medium text-foreground" href="/sign-in">Sign in</Link>
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

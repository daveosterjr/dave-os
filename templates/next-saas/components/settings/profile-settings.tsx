'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ProfileSettings() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <MissingClerkConfig surface="profile settings" />;
  }

  return <ConfiguredProfileSettings />;
}

function ConfiguredProfileSettings() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [pending, setPending] = useState(false);

  async function saveProfile() {
    if (!user) return;
    setPending(true);
    try {
      await user.update({ firstName, lastName });
    } finally {
      setPending(false);
    }
  }

  if (!isLoaded) return null;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button onClick={saveProfile} disabled={pending}>
            {pending ? 'Saving...' : 'Save profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MissingClerkConfig({ surface }: { surface: string }) {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Clerk is not configured</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code> in
          <code> .env.local</code> to use {surface}.
        </CardContent>
      </Card>
    </div>
  );
}

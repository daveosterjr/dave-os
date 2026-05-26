'use client';

import { useOrganization } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function OrganizationSettings() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <MissingClerkConfig surface="organization settings" />;
  }

  return <ConfiguredOrganizationSettings />;
}

function ConfiguredOrganizationSettings() {
  const { organization, membership, memberships, invitations } = useOrganization({
    memberships: { pageSize: 50 },
    invitations: { pageSize: 50 }
  });
  const [name, setName] = useState(organization?.name ?? '');
  const [inviteEmail, setInviteEmail] = useState('');
  const [pending, setPending] = useState(false);

  async function saveOrganization() {
    if (!organization) return;
    setPending(true);
    try {
      await organization.update({ name });
    } finally {
      setPending(false);
    }
  }

  async function inviteMember() {
    if (!organization || !inviteEmail) return;
    setPending(true);
    try {
      await organization.inviteMember({
        emailAddress: inviteEmail,
        role: 'org:member'
      });
      setInviteEmail('');
    } finally {
      setPending(false);
    }
  }

  const isAdmin = membership?.role === 'org:admin';

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Organization</h1>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Name</Label>
            <Input id="orgName" value={name} onChange={(event) => setName(event.target.value)} disabled={!isAdmin} />
          </div>
          <Button onClick={saveOrganization} disabled={!isAdmin || pending}>
            {pending ? 'Saving...' : 'Save organization'}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {memberships?.data?.map((item) => (
              <div className="flex items-center justify-between rounded-md border p-3" key={item.id}>
                <span>{item.publicUserData?.identifier ?? 'Unknown member'}</span>
                <span className="text-sm text-muted-foreground">{item.role}</span>
              </div>
            ))}
          </div>
          {isAdmin ? (
            <div className="flex gap-2">
              <Input placeholder="teammate@example.com" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} />
              <Button onClick={inviteMember} disabled={pending}>Invite</Button>
            </div>
          ) : null}
          {invitations?.data?.length ? (
            <p className="text-sm text-muted-foreground">{invitations.data.length} pending invitation(s)</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function MissingClerkConfig({ surface }: { surface: string }) {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Organization</h1>
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

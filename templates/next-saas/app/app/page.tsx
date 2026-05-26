import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AppHomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Clerk organization context and local org sync belong here.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Stripe entitlement state should be visible from day one.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Trigger.dev tasks can stream progress through Pusher.
        </CardContent>
      </Card>
    </div>
  );
}

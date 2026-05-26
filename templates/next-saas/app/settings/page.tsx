import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <Link className="rounded-lg border p-4 hover:bg-muted" href="/settings/profile">
          Profile
        </Link>
        <Link className="rounded-lg border p-4 hover:bg-muted" href="/settings/organization">
          Organization
        </Link>
      </div>
    </div>
  );
}

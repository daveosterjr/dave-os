export type OrganizationRole = 'org:admin' | 'org:member';

export type ApiScope =
  | 'read'
  | 'write'
  | 'billing:read'
  | 'billing:write'
  | 'jobs:run'
  | 'webhooks:write';

export type RealtimeEvent =
  | 'organization.updated'
  | 'billing.updated'
  | 'job.started'
  | 'job.completed'
  | 'job.failed';

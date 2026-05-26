import type { RealtimeEvent } from '@__APP_SCOPE__/types';

export type TypedRealtimePayloads = {
  'organization.updated': { organizationId: string };
  'billing.updated': { organizationId: string };
  'job.started': { organizationId?: string; runId: string };
  'job.completed': { organizationId?: string; runId: string };
  'job.failed': { organizationId?: string; runId: string; error: string };
};

export type TypedRealtimeEvent = RealtimeEvent & keyof TypedRealtimePayloads;

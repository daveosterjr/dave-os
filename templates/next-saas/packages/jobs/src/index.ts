import { prisma } from '@__APP_SCOPE__/db';

export async function recordJobStarted(input: {
  taskId: string;
  organizationId?: string;
  idempotencyKey?: string;
  payload?: unknown;
}) {
  return prisma.jobRun.create({
    data: {
      taskId: input.taskId,
      organizationId: input.organizationId,
      idempotencyKey: input.idempotencyKey,
      payload: input.payload as object,
      status: 'started',
      startedAt: new Date()
    }
  });
}

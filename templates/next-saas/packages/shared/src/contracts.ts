import { z } from 'zod';

export const healthResponseSchema = z.object({
  ok: z.boolean(),
  app: z.string()
});

export const createApiKeySchema = z.object({
  name: z.string().min(1),
  scopes: z.array(z.string()).default(['read'])
});

export const jobRunSchema = z.object({
  taskId: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).optional(),
  idempotencyKey: z.string().optional()
});

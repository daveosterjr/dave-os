import { serve } from '@hono/node-server';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { healthResponseSchema } from '@__APP_SCOPE__/shared/contracts';

const app = new OpenAPIHono();

const healthRoute = createRoute({
  method: 'get',
  path: '/v1/health',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: healthResponseSchema
        }
      },
      description: 'Health check'
    }
  }
});

app.openapi(healthRoute, (c) => c.json({ ok: true, app: '__APP_SLUG__' }));
app.doc('/v1/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: '__APP_TITLE__ API',
    version: '0.1.0'
  }
});

const port = Number(process.env.PORT || 4000);
serve({ fetch: app.fetch, port });
console.log(`API listening on http://localhost:${port}`);

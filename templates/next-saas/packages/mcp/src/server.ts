import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: '__APP_SLUG__',
  version: '0.1.0'
});

server.tool(
  'health',
  'Check __APP_TITLE__ API health',
  {
    apiUrl: z.string().url().default('http://localhost:4000')
  },
  async ({ apiUrl }) => {
    const response = await fetch(`${apiUrl}/v1/health`);
    return {
      content: [
        {
          type: 'text',
          text: await response.text()
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

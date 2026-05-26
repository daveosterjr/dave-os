#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('__APP_SLUG__')
  .description('__APP_TITLE__ CLI')
  .version('0.1.0');

program.command('health')
  .description('Check the public API')
  .option('--api-url <url>', 'API URL', process.env.APP_API_URL || 'http://localhost:4000')
  .action(async (options) => {
    const response = await fetch(`${options.apiUrl}/v1/health`);
    console.log(await response.text());
  });

program.command('mcp-config')
  .description('Print local MCP stdio config')
  .action(() => {
    console.log(JSON.stringify({
      command: 'node',
      args: ['packages/mcp/dist/server.js'],
      env: {}
    }, null, 2));
  });

program.parse();

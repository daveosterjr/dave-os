export function GET() {
  return new Response(`# __APP_TITLE__

__APP_DESCRIPTION__

Useful docs:
- /SYSTEM.md
- /ARCHITECTURE.md
- /docs/API_CLI_MCP.md
- /docs/QA.md
`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  });
}

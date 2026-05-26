import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: '__APP_SLUG__',
    message: 'MCP HTTP transport placeholder. Use packages/mcp for stdio server.'
  });
}

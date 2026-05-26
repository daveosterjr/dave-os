import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    name: '__APP_TITLE__',
    description: '__APP_DESCRIPTION__',
    surfaces: {
      api: '/api/v1',
      mcp: '/api/mcp',
      llms: '/llms.txt'
    }
  });
}

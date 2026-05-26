import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = await request.json();

  // TODO: verify with Svix and delegate to @__APP_SCOPE__/auth webhook service.
  return NextResponse.json({
    received: true,
    type: payload?.type ?? 'unknown'
  });
}

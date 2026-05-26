import { processStripeWebhook } from '@__APP_SCOPE__/billing/webhook';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();
  const result = await processStripeWebhook({ body, signature });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

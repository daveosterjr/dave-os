import { auth } from '@clerk/nextjs/server';
import { authorizePusherChannel } from '@__APP_SCOPE__/realtime/pusher';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.formData();
  const socketId = String(body.get('socket_id') ?? '');
  const channelName = String(body.get('channel_name') ?? '');
  const authResponse = authorizePusherChannel({ socketId, channelName, userId, orgId });

  return NextResponse.json(authResponse);
}

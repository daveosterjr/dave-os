import crypto from 'node:crypto';
import Pusher from 'pusher';

let pusher: Pusher | null = null;

export function getPusher() {
  if (!pusher) {
    pusher = new Pusher({
      appId: required('PUSHER_APP_ID'),
      key: required('NEXT_PUBLIC_PUSHER_KEY'),
      secret: required('PUSHER_SECRET'),
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
      useTLS: true
    });
  }
  return pusher;
}

export function privateOrgChannel(clerkOrgId: string) {
  const secret = required('PUSHER_CHANNEL_SECRET');
  const digest = crypto.createHmac('sha256', secret).update(clerkOrgId).digest('hex').slice(0, 32);
  return `private-org-${digest}`;
}

export function authorizePusherChannel(input: {
  socketId: string;
  channelName: string;
  userId: string;
  orgId: string;
}) {
  const expected = privateOrgChannel(input.orgId);
  if (input.channelName !== expected) {
    throw new Error('Forbidden channel');
  }
  return getPusher().authorizeChannel(input.socketId, input.channelName, {
    user_id: input.userId
  });
}

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

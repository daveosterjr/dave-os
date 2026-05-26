import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const secretDir = path.resolve('.stripe');
const secretFile = path.join(secretDir, 'webhook-secret');
const forwardUrl = 'http://localhost:3000/api/webhooks/stripe';
const events = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed'
].join(',');

fs.mkdirSync(secretDir, { recursive: true });

console.log(`[stripe] Forwarding ${events} to ${forwardUrl}`);
console.log('[stripe] Local webhook secret will be written to .stripe/webhook-secret');

const child = spawn('stripe', [
  'listen',
  '--events',
  events,
  '--forward-to',
  forwardUrl
], {
  stdio: ['inherit', 'pipe', 'pipe']
});

let captured = false;

function handleOutput(data, stream) {
  const text = data.toString();
  stream.write(text);

  if (!captured) {
    const match = text.match(/webhook signing secret is (whsec_\S+)/);
    if (match) {
      fs.writeFileSync(secretFile, match[1], 'utf8');
      captured = true;
      console.log('[stripe] Saved local webhook secret.');
    }
  }
}

child.stdout.on('data', (data) => handleOutput(data, process.stdout));
child.stderr.on('data', (data) => handleOutput(data, process.stderr));

child.on('close', (code) => {
  fs.rmSync(secretFile, { force: true });
  process.exit(code ?? 0);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

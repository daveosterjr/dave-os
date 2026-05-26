import { createClerkClient } from '@clerk/backend';
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const baseUrl = args.baseUrl || process.env.CODEX_BROWSER_BASE_URL || 'http://localhost:3000';
const targetPath = args.path || '/app';
const authPath = args.authPath || '/sign-in';
const storageState = path.resolve(args.storageState || 'artifacts/codex-browser/storage-state.json');
const videoDir = path.resolve(args.videoDir || 'artifacts/codex-browser/videos');
const recordVideo = args.recordVideo || process.env.CODEX_BROWSER_RECORD_VIDEO === '1';

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is required.');
}

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const userId = process.env.CLERK_TEST_USER_ID || await resolveUserIdByEmail(process.env.CLERK_TEST_EMAIL);

if (!userId) {
  throw new Error('Set CLERK_TEST_USER_ID or CLERK_TEST_EMAIL.');
}

fs.mkdirSync(path.dirname(storageState), { recursive: true });
if (recordVideo) fs.mkdirSync(videoDir, { recursive: true });

const token = await clerk.signInTokens.createSignInToken({
  userId,
  expiresInSeconds: 60
});

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext(recordVideo ? { recordVideo: { dir: videoDir } } : {});
const page = await context.newPage();
const consoleErrors = [];

page.on('console', (message) => {
  if (message.type() === 'error') {
    consoleErrors.push(message.text());
  }
});

try {
  await page.goto(new URL(authPath, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => globalThis.Clerk?.loaded === true, null, { timeout: 15000 });
  await page.evaluate(async (ticket) => {
    const result = await globalThis.Clerk.client.signIn.create({ strategy: 'ticket', ticket });
    await globalThis.Clerk.setActive({ session: result.createdSessionId });
  }, token.token);
  await page.goto(new URL(targetPath, baseUrl).toString(), { waitUntil: 'networkidle' });
  await context.storageState({ path: storageState });

  const finalUrl = page.url();
  const status = await page.evaluate(() => document.readyState);
  await context.close();
  await browser.close();

  console.log(JSON.stringify({
    ok: true,
    finalUrl,
    readyState: status,
    storageState,
    consoleErrorCount: consoleErrors.length,
    consoleErrors
  }, null, 2));
} catch (error) {
  await context.close().catch(() => {});
  await browser.close().catch(() => {});
  console.error(JSON.stringify({
    ok: false,
    error: error instanceof Error ? error.message : String(error),
    consoleErrors
  }, null, 2));
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--base-url') parsed.baseUrl = argv[++i];
    else if (arg === '--path') parsed.path = argv[++i];
    else if (arg === '--auth-path') parsed.authPath = argv[++i];
    else if (arg === '--storage-state') parsed.storageState = argv[++i];
    else if (arg === '--video-dir') parsed.videoDir = argv[++i];
    else if (arg === '--record-video') parsed.recordVideo = true;
  }
  return parsed;
}

async function resolveUserIdByEmail(email) {
  if (!email) return null;
  const users = await clerk.users.getUserList({ emailAddress: [email], limit: 1 });
  return users.data[0]?.id ?? null;
}

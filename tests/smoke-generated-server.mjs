import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

const appDir = path.resolve(process.argv[2] ?? '/tmp/dave-os-ci-app');
const port = Number(process.env.DAVE_OS_SMOKE_PORT ?? 4567);

test('generated app serves public health without secrets', async () => {
  const child = spawn('npm', ['run', 'start', '--', '-p', String(port)], {
    cwd: appDir,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  child.stderr.on('data', (data) => {
    output += data.toString();
  });

  try {
    const health = await waitForHealth(port);
    assert.equal(health.ok, true);
    assert.equal(health.app, 'ci-app');
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : String(error)}\n\nServer output:\n${output}`);
  } finally {
    child.kill('SIGTERM');
  }
});

async function waitForHealth(portNumber) {
  const url = `http://127.0.0.1:${portNumber}/api/v1/health`;
  let lastError = null;

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      lastError = new Error(`Health returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw lastError ?? new Error('Timed out waiting for health route');
}

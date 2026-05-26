import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const appDir = process.env.DAVE_OS_GENERATED_APP_DIR || path.join(os.tmpdir(), 'dave-os-ci-app');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const env = { ...process.env };

delete env.npm_config_dry_run;

fs.rmSync(appDir, { recursive: true, force: true });

run(process.execPath, [
  path.join(repoRoot, 'bin/create-dave-app.mjs'),
  'ci-app',
  '--target-dir',
  appDir
], repoRoot);

run(npmCommand, ['ci', '--prefer-offline', '--no-audit'], appDir);
run(npmCommand, ['run', 'typecheck'], appDir);
run(npmCommand, ['run', 'lint'], appDir);
run(npmCommand, ['run', 'build'], appDir);
run(process.execPath, [path.join(repoRoot, 'tests/smoke-generated-server.mjs'), appDir], repoRoot);

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

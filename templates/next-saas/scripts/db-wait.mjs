import { spawnSync } from 'node:child_process';

const maxAttempts = 40;

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  const result = spawnSync('docker', [
    'compose',
    'exec',
    '-T',
    'postgres',
    'pg_isready',
    '-U',
    'postgres',
    '-d',
    '__APP_SLUG__'
  ], { stdio: 'ignore' });

  if (result.status === 0) {
    console.log('Postgres is ready.');
    process.exit(0);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
}

console.error('Timed out waiting for Postgres.');
process.exit(1);

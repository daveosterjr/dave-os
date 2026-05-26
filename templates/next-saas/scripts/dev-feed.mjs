import { spawn } from 'node:child_process';
import { spawnSync } from 'node:child_process';

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

const includeStripe = process.argv.includes('--stripe');

function hasCommand(bin) {
  return spawnSync(process.platform === 'win32' ? 'where.exe' : 'which', [bin], {
    stdio: 'ignore'
  }).status === 0;
}

const commands = [
  { label: 'db', color: colors.blue, command: 'npm', args: ['run', 'db:start'] },
  { label: 'next', color: colors.cyan, command: 'npm', args: ['run', 'dev:next'] },
  { label: 'trigger', color: colors.yellow, command: 'npm', args: ['run', 'trigger:dev'] }
];

if (includeStripe) {
  if (hasCommand('stripe')) {
    commands.push({ label: 'stripe', color: colors.green, command: 'npm', args: ['run', 'stripe:listen'] });
  } else {
    console.log(`${colors.yellow}[stripe] Stripe CLI not found. Skipping webhook listener.${colors.reset}`);
  }
}

const children = [];

for (const item of commands) {
  const child = spawn(item.command, item.args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false
  });
  children.push(child);

  const prefix = `${item.color}[${item.label}]${colors.reset}`;
  child.stdout.on('data', (data) => {
    process.stdout.write(`${prefix} ${data}`);
  });
  child.stderr.on('data', (data) => {
    process.stderr.write(`${prefix} ${data}`);
  });
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${colors.red}[${item.label}] exited with ${code}${colors.reset}`);
    }
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    for (const child of children) {
      child.kill(signal);
    }
    process.exit(0);
  });
}

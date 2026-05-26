#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templatesRoot = path.join(repoRoot, 'templates');

const textExtensions = new Set([
  '.css',
  '.cjs',
  '.json',
  '.js',
  '.jsx',
  '.md',
  '.mjs',
  '.prisma',
  '.sql',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml'
]);

function usage() {
  return `create-dave-app <project-name> [options]

Options:
  --template <name>       Template name. Default: next-saas
  --target-dir <path>     Output directory. Default: ./<project-name>
  --scope <scope>         NPM package scope without @. Default: project slug
  --description <text>    App description
  --idea <text>           Natural-language product idea to scaffold docs and plans
  --from-prompt           Treat positional text as the product idea and infer the project name
  --prompt-file <path>    Read product idea from a file
  --no-env                Do not create .env.local from .env.example
  --git                   Initialize a git repository on main
  --dry-run               Print files without writing
  --force                 Allow writing into a non-empty directory
  --install               Run npm install after creation
  --help                  Show this message
`;
}

function parseArgs(argv) {
  const options = {
    template: 'next-saas',
    env: true,
    dryRun: false,
    force: false,
    git: false,
    install: false
  };
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--no-env') {
      options.env = false;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--git' || arg === '--init-git') {
      options.git = true;
    } else if (arg === '--install') {
      options.install = true;
    } else if (arg === '--template') {
      options.template = requireValue(argv, ++i, arg);
    } else if (arg === '--target-dir') {
      options.targetDir = requireValue(argv, ++i, arg);
    } else if (arg === '--scope') {
      options.scope = requireValue(argv, ++i, arg).replace(/^@/, '');
    } else if (arg === '--description') {
      options.description = requireValue(argv, ++i, arg);
    } else if (arg === '--idea') {
      options.idea = requireValue(argv, ++i, arg);
    } else if (arg === '--from-prompt') {
      options.fromPrompt = true;
    } else if (arg === '--prompt-file') {
      options.promptFile = requireValue(argv, ++i, arg);
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  options.positional = positional;
  options.projectName = options.fromPrompt ? undefined : positional[0];
  return options;
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function slugify(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'dave-app';
}

function titleize(value) {
  return slugify(value)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function compact(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function sentence(value) {
  const cleaned = compact(value);
  if (!cleaned) return '';
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`;
}

function firstSentence(value, fallback) {
  const cleaned = compact(value);
  if (!cleaned) return fallback;
  const match = cleaned.match(/^(.{20,220}?[.!?])(?:\s|$)/);
  if (match) return match[1];
  const clauses = cleaned.split(',').map((part) => part.trim()).filter(Boolean);
  if (clauses.length >= 3) {
    return `${clauses.slice(0, 4).join(', ')}.`;
  }
  if (cleaned.length <= 180) return cleaned;
  const slice = cleaned.slice(0, 170);
  const lastSpace = slice.lastIndexOf(' ');
  const excerpt = slice.slice(0, lastSpace > 80 ? lastSpace : 170).replace(/\s+(a|an|and|or|the|to|for|with|of|in|on)$/i, '');
  return `${excerpt}...`;
}

function readIdea(options) {
  if (options.promptFile) {
    const promptPath = path.resolve(options.promptFile);
    return fs.readFileSync(promptPath, 'utf8');
  }
  if (options.idea) return options.idea;
  if (options.fromPrompt) return options.positional.join(' ');
  return '';
}

function inferProjectName(idea) {
  const explicit = idea.match(/\b(?:called|named)\s+["']?([A-Z][A-Za-z0-9]*(?:\s+[A-Z][A-Za-z0-9]*){0,3})["']?/);
  if (explicit) return explicit[1];

  const words = idea
    .toLowerCase()
    .replace(/&/g, ' and ')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .filter((word) => !new Set([
      'the',
      'a',
      'an',
      'and',
      'for',
      'to',
      'with',
      'that',
      'this',
      'from',
      'into',
      'build',
      'create',
      'make',
      'app',
      'application',
      'platform',
      'tool',
      'saas',
      'where',
      'users',
      'user',
      'can',
      'will',
      'should',
      'able',
      'about',
      'like'
    ]).has(word));

  const important = words.slice(0, 3);
  if (important.length === 0) return 'Dave App';
  return titleize(important.join('-'));
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function buildIdeaPlan(idea, vars) {
  const normalized = idea.toLowerCase();
  const modules = [
    {
      id: 'core-workspace',
      title: 'Workspace And Organization Core',
      reason: 'Every Dave OS app starts org-first with Clerk, local org rows, and settings.'
    },
    {
      id: 'billing',
      title: 'Billing And Entitlements',
      reason: includesAny(normalized, ['pay', 'paid', 'billing', 'subscription', 'price', 'stripe', 'plan'])
        ? 'The idea mentions monetization, so Stripe should be active in the first milestone.'
        : 'Stripe is part of the default starter and should be ready before pricing decisions harden.'
    },
    {
      id: 'automation-surfaces',
      title: 'Public API, CLI, And MCP',
      reason: 'Dave OS exposes core capabilities through shared contracts, API, CLI, and MCP.'
    }
  ];

  if (includesAny(normalized, ['ai', 'llm', 'agent', 'prompt', 'classif', 'summar', 'generate'])) {
    modules.push({
      id: 'ai-workflows',
      title: 'AI Workflow Layer',
      reason: 'The idea includes AI/agent behavior, so prompts, schemas, evals, and model-call logs should be first-class.'
    });
  }
  if (includesAny(normalized, ['upload', 'csv', 'import', 'file', 'pdf', 'doc', 'spreadsheet', 'export'])) {
    modules.push({
      id: 'files-import-export',
      title: 'Files, Imports, And Exports',
      reason: 'The idea includes files or exports, so ingestion, validation, and artifact generation need early contracts.'
    });
  }
  if (includesAny(normalized, ['chat', 'live', 'realtime', 'collab', 'presence', 'socket', 'notification'])) {
    modules.push({
      id: 'realtime',
      title: 'Realtime Events',
      reason: 'The idea includes live or collaborative behavior, so Pusher events should be typed early.'
    });
  }
  if (includesAny(normalized, ['job', 'background', 'queue', 'schedule', 'cron', 'sync', 'webhook', 'worker'])) {
    modules.push({
      id: 'background-jobs',
      title: 'Background Jobs',
      reason: 'The idea includes async work, so Trigger.dev tasks and idempotency keys should drive the workflow.'
    });
  }
  if (includesAny(normalized, ['customer', 'lead', 'crm', 'contact', 'pipeline', 'deal'])) {
    modules.push({
      id: 'crm',
      title: 'CRM-Like Records',
      reason: 'The idea includes customers/leads/pipelines, so org-scoped records and activity history should be modeled early.'
    });
  }

  const routes = [
    '/app',
    '/settings/profile',
    '/settings/organization',
    '/api/v1/health',
    '/api/mcp'
  ];
  if (modules.some((item) => item.id === 'billing')) routes.push('/settings/billing');
  if (modules.some((item) => item.id === 'files-import-export')) routes.push('/app/imports');
  if (modules.some((item) => item.id === 'crm')) routes.push('/app/records');
  if (modules.some((item) => item.id === 'ai-workflows')) routes.push('/app/runs');

  const models = [
    'User',
    'Organization',
    'OrganizationMember',
    'ApiKey',
    'StripeSubscription',
    'StripeEventLog',
    'JobRun'
  ];
  if (modules.some((item) => item.id === 'crm')) models.push('Record', 'RecordActivity');
  if (modules.some((item) => item.id === 'files-import-export')) models.push('ImportBatch', 'ImportRow', 'ExportArtifact');
  if (modules.some((item) => item.id === 'ai-workflows')) models.push('PromptVersion', 'ModelRun', 'EvaluationCase');

  const milestones = [
    'Boot the generated app and configure Clerk, Stripe, Pusher, Trigger.dev, and Postgres env vars.',
    'Implement Clerk webhook verification and idempotent user/org/member sync.',
    'Create or restore a Stripe customer for every organization and persist metadata in Clerk and Postgres.',
    'Turn the product objects from this brief into Prisma models and package-level query helpers.',
    'Expose the first product workflow through app route, public API, CLI command, and MCP tool.',
    'Add Trigger.dev tasks for async work and emit typed Pusher events for progress.',
    'Add package-level Vitest coverage and one browser QA path for the primary workflow.'
  ];

  return {
    app: {
      name: vars.appName,
      slug: vars.appSlug,
      title: vars.appTitle,
      scope: vars.appScope,
      description: vars.appDescription
    },
    idea: compact(idea),
    summary: firstSentence(idea, vars.appDescription),
    audience: inferAudience(normalized),
    modules,
    routes,
    models,
    milestones,
    generatedAt: new Date().toISOString()
  };
}

function inferAudience(normalized) {
  if (includesAny(normalized, ['sales', 'lead', 'crm'])) return 'sales and operations teams';
  if (includesAny(normalized, ['property manager', 'maintenance', 'vendor', 'contractor', 'real estate', 'property', 'landlord'])) {
    return 'property managers and vendor operations teams';
  }
  if (includesAny(normalized, ['finance', 'invoice', 'accounting', 'tax'])) return 'finance and back-office teams';
  if (includesAny(normalized, ['developer', 'api', 'mcp', 'agent', 'llm'])) return 'builders and technical teams';
  return 'teams who need a focused SaaS workflow';
}

function listTemplateFiles(templateDir) {
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.DS_Store') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  walk(templateDir);
  return files;
}

function isTextFile(filePath) {
  const ext = path.extname(filePath);
  return textExtensions.has(ext) || path.basename(filePath).startsWith('.');
}

function render(content, vars) {
  return content
    .replaceAll('__APP_NAME__', vars.appName)
    .replaceAll('__APP_SLUG__', vars.appSlug)
    .replaceAll('__APP_SCOPE__', vars.appScope)
    .replaceAll('__APP_TITLE__', vars.appTitle)
    .replaceAll('__APP_DESCRIPTION__', vars.appDescription);
}

function ensureWritableTarget(targetDir, force) {
  if (!fs.existsSync(targetDir)) return;
  const entries = fs.readdirSync(targetDir).filter((entry) => entry !== '.DS_Store');
  if (entries.length > 0 && !force) {
    throw new Error(`Target directory is not empty: ${targetDir}. Use --force to write anyway.`);
  }
}

function createApp(options) {
  if (options.help) {
    console.log(usage());
    return;
  }
  const idea = readIdea(options);
  if (!options.projectName && idea) {
    options.projectName = inferProjectName(idea);
  }
  if (!options.projectName) {
    throw new Error(`Missing project name.\n\n${usage()}`);
  }

  const appSlug = slugify(options.projectName);
  const appTitle = titleize(options.projectName);
  const appScope = slugify(options.scope || appSlug);
  const appDescription = options.description || (idea ? firstSentence(idea, `${appTitle} built with Dave OS.`) : `${appTitle} built with Dave OS.`);
  const templateDir = path.join(templatesRoot, options.template);
  const targetDir = path.resolve(options.targetDir || appSlug);

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Unknown template: ${options.template}`);
  }

  const vars = {
    appName: options.projectName,
    appSlug,
    appScope,
    appTitle,
    appDescription
  };
  const ideaPlan = idea ? buildIdeaPlan(idea, vars) : null;

  const files = listTemplateFiles(templateDir);
  const planned = files.map((source) => {
    const relative = path.relative(templateDir, source);
    return {
      source,
      relative,
      destination: path.join(targetDir, relative)
    };
  });

  if (options.dryRun) {
    console.log(`Template: ${options.template}`);
    console.log(`Target: ${targetDir}`);
    console.log(`Scope: @${appScope}`);
    console.log('');
    for (const file of planned) {
      console.log(`create ${file.relative}`);
    }
    if (ideaPlan) {
      console.log('create PROJECT_BRIEF.md');
      console.log('create docs/BUILD_PLAN.md');
      console.log('create docs/LLM_SCAFFOLD_PROMPT.md');
      console.log('create .dave-os/brief.json');
    }
    return;
  }

  ensureWritableTarget(targetDir, options.force);

  for (const file of planned) {
    fs.mkdirSync(path.dirname(file.destination), { recursive: true });
    if (isTextFile(file.source)) {
      const content = fs.readFileSync(file.source, 'utf8');
      fs.writeFileSync(file.destination, render(content, vars));
    } else {
      fs.copyFileSync(file.source, file.destination);
    }
  }

  if (ideaPlan) {
    writeIdeaArtifacts(targetDir, ideaPlan);
  }

  const createdEnv = options.env && copyEnvFile(targetDir, options.force);

  console.log(`Created ${appTitle} at ${targetDir}`);

  if (options.install) {
    console.log('');
    console.log('Running npm install...');
    runCommand('npm', ['install'], targetDir);
  }

  if (options.git) {
    console.log('');
    console.log('Initializing git repository...');
    initGitRepo(targetDir);
  }

  printNextSteps({
    targetDir,
    createdEnv,
    installed: options.install,
    initializedGit: options.git
  });
}

function copyEnvFile(targetDir, force) {
  const source = path.join(targetDir, '.env.example');
  const destination = path.join(targetDir, '.env.local');
  if (!fs.existsSync(source)) return false;
  if (fs.existsSync(destination) && !force) return false;
  fs.copyFileSync(source, destination);
  return true;
}

function initGitRepo(targetDir) {
  const result = spawnSync('git', ['init', '-b', 'main'], {
    cwd: targetDir,
    stdio: 'inherit'
  });

  if (result.status === 0) return;

  runCommand('git', ['init'], targetDir);
  runCommand('git', ['branch', '-M', 'main'], targetDir);
}

function runCommand(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function printNextSteps({ targetDir, createdEnv, installed, initializedGit }) {
  const relativeTarget = path.relative(process.cwd(), targetDir) || '.';
  const steps = [`cd ${relativeTarget}`];

  if (!createdEnv) {
    steps.push('cp .env.example .env.local');
  }
  steps.push('Fill in .env.local');
  if (!installed) {
    steps.push('npm install');
  }
  steps.push('npm run db:start');
  steps.push('npm run dev');
  if (initializedGit) {
    steps.push('git add -A && git commit -m "Initial app scaffold"');
  }

  console.log('');
  console.log('Next steps:');
  for (const step of steps) {
    console.log(`  ${step}`);
  }
}

function writeIdeaArtifacts(targetDir, plan) {
  fs.mkdirSync(path.join(targetDir, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, '.dave-os'), { recursive: true });
  fs.writeFileSync(path.join(targetDir, '.dave-os/brief.json'), `${JSON.stringify(plan, null, 2)}\n`);
  fs.writeFileSync(path.join(targetDir, 'PROJECT_BRIEF.md'), renderProjectBrief(plan));
  fs.writeFileSync(path.join(targetDir, 'docs/BUILD_PLAN.md'), renderBuildPlan(plan));
  fs.writeFileSync(path.join(targetDir, 'docs/LLM_SCAFFOLD_PROMPT.md'), renderLlmPrompt(plan));

  fs.appendFileSync(
    path.join(targetDir, 'SYSTEM.md'),
    `\n## Generated Product Brief\n\n${plan.summary}\n\nPrimary audience: ${plan.audience}.\n\nSee \`PROJECT_BRIEF.md\` and \`docs/BUILD_PLAN.md\` before implementing domain features.\n`
  );
}

function renderProjectBrief(plan) {
  return `# ${plan.app.title} Project Brief

Generated by Dave OS from a natural-language product idea.

## Original Idea

${plan.idea}

## Summary

${plan.summary}

## Audience

${sentence(plan.audience)}.

## Suggested Product Modules

${plan.modules.map((module) => `- **${module.title}**: ${module.reason}`).join('\n')}

## Initial Routes

${plan.routes.map((route) => `- \`${route}\``).join('\n')}

## Candidate Data Models

${plan.models.map((model) => `- \`${model}\``).join('\n')}

## First Milestones

${plan.milestones.map((milestone, index) => `${index + 1}. ${milestone}`).join('\n')}

## Agent Notes

- Keep route handlers thin.
- Put reusable behavior in \`packages/*\`.
- Add or update API, CLI, and MCP surfaces when a capability becomes public.
- Use Trigger.dev for async work and Pusher for progress events.
- Keep this brief updated as product decisions become real code.
`;
}

function renderBuildPlan(plan) {
  return `# ${plan.app.title} Build Plan

## Phase 0 - Confirm The Product Skeleton

- [ ] Install dependencies.
- [ ] Copy \`.env.example\` to \`.env.local\`.
- [ ] Configure Clerk, Stripe, Pusher, Trigger.dev, and Postgres.
- [ ] Run \`npm run verify\`.
- [ ] Run the browser QA helper against \`/app\`.

## Phase 1 - Workspace And Billing Foundation

- [ ] Verify Clerk webhooks.
- [ ] Sync users, organizations, and memberships into Postgres.
- [ ] Create Stripe customers for organizations.
- [ ] Add a billing settings route and portal button.
- [ ] Add tests for webhook idempotency.

## Phase 2 - Domain Model

Candidate models:

${plan.models.map((model) => `- [ ] \`${model}\``).join('\n')}

## Phase 3 - Product Workflows

Suggested first routes:

${plan.routes.map((route) => `- [ ] \`${route}\``).join('\n')}

## Phase 4 - Automation Surfaces

- [ ] Public API route.
- [ ] CLI command.
- [ ] MCP tool.
- [ ] Trigger.dev task if the workflow is async.
- [ ] Pusher event if users need live progress.
`;
}

function renderLlmPrompt(plan) {
  return `# LLM Scaffold Prompt

Use this prompt with Codex or another coding agent from the root of this generated repo.

\`\`\`text
You are working in ${plan.app.title}, a Dave OS generated app.

Original idea:
${plan.idea}

Product summary:
${plan.summary}

Audience:
${plan.audience}

Use these rules:
- Keep route handlers thin.
- Put reusable domain logic in packages.
- Expose public capabilities through app UI, API, CLI, and MCP from shared contracts.
- Use Clerk organizations, Prisma/Postgres, Stripe, Trigger.dev, and Pusher following the existing starter patterns.
- Keep custom auth and settings UI.
- Add focused tests for any implemented workflow.

Start by implementing Phase 1 from docs/BUILD_PLAN.md. Before editing, read:
- AGENTS.md
- ARCHITECTURE.md
- SYSTEM.md
- PROJECT_BRIEF.md
- docs/BUILD_PLAN.md
\`\`\`
`;
}

try {
  createApp(parseArgs(process.argv.slice(2)));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

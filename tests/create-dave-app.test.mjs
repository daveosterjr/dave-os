import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const repoRoot = path.resolve(import.meta.dirname, '..');
const cli = path.join(repoRoot, 'bin/create-dave-app.mjs');

test('dry run lists the default template files', () => {
  const output = execFileSync(process.execPath, [cli, 'My App', '--dry-run'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  assert.match(output, /Template: next-saas/);
  assert.match(output, /Scope: @my-app/);
  assert.match(output, /create package\.json/);
  assert.match(output, /create prisma\/schema\.prisma/);
});

test('creates a project and replaces tokens', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dave-os-test-'));
  const targetDir = path.join(tempRoot, 'created');

  execFileSync(process.execPath, [
    cli,
    'Orbit Desk',
    '--target-dir',
    targetDir,
    '--scope',
    'orbit',
    '--description',
    'A desk for orbit work.'
  ], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  const packageJson = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
  const packageLock = fs.readFileSync(path.join(targetDir, 'package-lock.json'), 'utf8');
  const envLocal = fs.readFileSync(path.join(targetDir, '.env.local'), 'utf8');
  const readme = fs.readFileSync(path.join(targetDir, 'README.md'), 'utf8');
  const apiPackage = JSON.parse(fs.readFileSync(path.join(targetDir, 'packages/api/package.json'), 'utf8'));
  const allFiles = listFiles(targetDir).map((file) => fs.readFileSync(file, 'utf8'));

  assert.equal(packageJson.name, 'orbit-desk');
  assert.equal(packageJson.description, 'A desk for orbit work.');
  assert.equal(apiPackage.name, '@orbit/api');
  assert.match(packageLock, /"name": "orbit-desk"/);
  assert.match(packageLock, /node_modules\/@orbit\/api/);
  assert.match(envLocal, /NEXT_PUBLIC_APP_NAME="Orbit Desk"/);
  assert.match(readme, /# Orbit Desk/);
  assert.ok(allFiles.every((content) => !content.includes('__APP_')));
  assert.ok(allFiles.every((content) => !content.includes('workspace:*')));
});

test('creates a project from a natural-language idea', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dave-os-idea-test-'));
  const targetDir = path.join(tempRoot, 'idea-created');

  const output = execFileSync(process.execPath, [
    cli,
    '--idea',
    'Build an AI workflow app for property managers to import maintenance CSVs, classify urgent repairs, notify vendors in realtime, and bill teams monthly.',
    '--target-dir',
    targetDir
  ], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  const packageJson = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
  const brief = fs.readFileSync(path.join(targetDir, 'PROJECT_BRIEF.md'), 'utf8');
  const buildPlan = fs.readFileSync(path.join(targetDir, 'docs/BUILD_PLAN.md'), 'utf8');
  const llmPrompt = fs.readFileSync(path.join(targetDir, 'docs/LLM_SCAFFOLD_PROMPT.md'), 'utf8');
  const briefJson = JSON.parse(fs.readFileSync(path.join(targetDir, '.dave-os/brief.json'), 'utf8'));

  assert.match(output, /Created Ai Workflow Property/);
  assert.equal(packageJson.name, 'ai-workflow-property');
  assert.equal(briefJson.app.slug, 'ai-workflow-property');
  assert.match(brief, /AI Workflow Layer/);
  assert.match(brief, /Property managers and vendor operations teams\./);
  assert.doesNotMatch(briefJson.summary, /\.\.\.$/);
  assert.match(brief, /Files, Imports, And Exports/);
  assert.match(brief, /Realtime Events/);
  assert.match(buildPlan, /Phase 1 - Workspace And Billing Foundation/);
  assert.match(llmPrompt, /You are working in Ai Workflow Property/);
});

test('dry run includes idea artifacts', () => {
  const output = execFileSync(process.execPath, [
    cli,
    '--from-prompt',
    'Build a customer portal with subscriptions and MCP tools',
    '--dry-run'
  ], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  assert.match(output, /create PROJECT_BRIEF\.md/);
  assert.match(output, /create docs\/BUILD_PLAN\.md/);
  assert.match(output, /create docs\/LLM_SCAFFOLD_PROMPT\.md/);
  assert.match(output, /create \.dave-os\/brief\.json/);
});

test('splits camel case project names', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dave-os-camel-test-'));
  const targetDir = path.join(tempRoot, 'camel-created');

  execFileSync(process.execPath, [
    cli,
    'VendorPulse',
    '--target-dir',
    targetDir
  ], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  const packageJson = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
  const readme = fs.readFileSync(path.join(targetDir, 'README.md'), 'utf8');

  assert.equal(packageJson.name, 'vendor-pulse');
  assert.match(readme, /# Vendor Pulse/);
});

test('summarizes long comma-heavy ideas cleanly', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dave-os-summary-test-'));
  const targetDir = path.join(tempRoot, 'summary-created');

  execFileSync(process.execPath, [
    cli,
    'VendorPulse',
    '--target-dir',
    targetDir,
    '--idea',
    'Build a vendor operations SaaS for property managers to import maintenance requests, classify urgent repairs with AI, assign vendors, show realtime job status, expose an MCP server for agents, and bill teams monthly with Stripe.'
  ], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  const briefJson = JSON.parse(fs.readFileSync(path.join(targetDir, '.dave-os/brief.json'), 'utf8'));

  assert.equal(
    briefJson.summary,
    'Build a vendor operations SaaS for property managers to import maintenance requests, classify urgent repairs with AI, assign vendors, show realtime job status.'
  );
});

test('can skip .env.local creation', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dave-os-no-env-test-'));
  const targetDir = path.join(tempRoot, 'no-env-created');

  execFileSync(process.execPath, [
    cli,
    'No Env App',
    '--target-dir',
    targetDir,
    '--no-env'
  ], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  assert.equal(fs.existsSync(path.join(targetDir, '.env.example')), true);
  assert.equal(fs.existsSync(path.join(targetDir, '.env.local')), false);
});

test('can initialize a git repository', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dave-os-git-test-'));
  const targetDir = path.join(tempRoot, 'git-created');

  execFileSync(process.execPath, [
    cli,
    'Git Ready',
    '--target-dir',
    targetDir,
    '--git'
  ], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  const insideWorkTree = execFileSync('git', ['-C', targetDir, 'rev-parse', '--is-inside-work-tree'], {
    encoding: 'utf8'
  }).trim();
  const branch = execFileSync('git', ['-C', targetDir, 'branch', '--show-current'], {
    encoding: 'utf8'
  }).trim();

  assert.equal(insideWorkTree, 'true');
  assert.equal(branch, 'main');
});

function listFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

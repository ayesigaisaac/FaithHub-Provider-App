const { existsSync } = require('node:fs');
const { execSync } = require('node:child_process');
const { join } = require('node:path');

const repoRoot = process.cwd();
const gitDir = join(repoRoot, '.git');

if (!existsSync(gitDir)) {
  process.exit(0);
}

try {
  execSync('git config core.hooksPath .githooks', {
    cwd: repoRoot,
    stdio: 'ignore',
  });
  console.log('Git hooks configured: core.hooksPath=.githooks');
} catch {
  console.warn('Could not auto-configure git hooks. Run: git config core.hooksPath .githooks');
}

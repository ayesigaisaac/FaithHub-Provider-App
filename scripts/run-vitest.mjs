import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { startVitest } from 'vitest/node';

const root = process.cwd();
const scriptPath = fileURLToPath(import.meta.url);
const batchFlagIndex = process.argv.indexOf('--batch');
const cliFilters = batchFlagIndex >= 0 ? process.argv.slice(batchFlagIndex + 1) : process.argv.slice(2);

async function collectTestFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'tests') continue;
      files.push(...await collectTestFiles(absolutePath));
      continue;
    }
    if (entry.isFile() && /\.test\.(ts|tsx)$/.test(entry.name)) {
      files.push(path.relative(root, absolutePath));
    }
  }
  return files;
}

function chunk(items, size) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

if (batchFlagIndex < 0) {
  const filesToRun = cliFilters.length > 0 ? cliFilters : await collectTestFiles(path.join(root, 'src'));
  const batches = cliFilters.length > 0 ? [filesToRun] : chunk(filesToRun, 1);

  for (const batch of batches) {
    const result = spawnSync(process.execPath, [scriptPath, '--batch', ...batch], {
      cwd: root,
      env: process.env,
      stdio: 'inherit',
    });

    if (result.status && result.status !== 0) {
      process.exit(result.status);
    }
    if (result.error) {
      throw result.error;
    }
  }
} else {
  await startVitest(
    'test',
    cliFilters,
    {
      run: true,
      config: false,
      root,
      globals: true,
      environment: 'jsdom',
      fileParallelism: false,
      poolOptions: {
        threads: {
          singleThread: true,
        },
      },
      setupFiles: './src/test/setup.ts',
    },
    {
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(root, 'src'),
        },
      },
    },
  );

  if (process.exitCode) {
    process.exit(process.exitCode);
  }
}

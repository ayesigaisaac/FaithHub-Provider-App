import process from 'node:process';
import path from 'node:path';
import { build } from 'vite';
import { filterKnownBuildWarnings } from './vite-warn-filter.mjs';

await build({
  configFile: false,
  root: process.cwd(),
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        filterKnownBuildWarnings(warning, defaultHandler);
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('react-router')) return 'router-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});

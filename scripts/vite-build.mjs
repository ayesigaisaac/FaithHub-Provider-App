import path from 'node:path';
import { build } from 'vite';

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

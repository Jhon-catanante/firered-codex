import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

// O site é publicado em https://<usuario>.github.io/firered-codex/
export default defineConfig({
  base: '/firered-codex/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});

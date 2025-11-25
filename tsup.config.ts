import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: 'cjs',
  tsconfig: 'tsconfig.json',
  clean: true,
  external: [
    '@prisma/client',
    '.prisma/client'
  ],
  noExternal: [],
});
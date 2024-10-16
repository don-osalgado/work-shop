import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  outDir: 'build',
  sourcemap: true,
  splitting: false,
  clean: true,
  bundle: false
});

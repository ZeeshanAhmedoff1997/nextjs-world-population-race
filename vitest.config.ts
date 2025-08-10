import { defineConfig, mergeConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const base = defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    reporters: ['default'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        '.next/**',
        'test/**',
        '**/*.d.ts',
        'next.config.*',
        'tailwind.config.*',
        'postcss.config.*',
      ],
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 },
    },
  },
});

export default defineConfig({
  test: {
    projects: [
      mergeConfig(
        base,
        defineConfig({
          test: {
            name: 'unit',
            environment: 'node',
            include: [
              'src/{lib,utils,hooks}/**/*.unit.{ts,tsx}',
              'test/**/*.unit.{ts,tsx}',
            ],
          },
        }),
      ),
      mergeConfig(
        base,
        defineConfig({
          test: {
            name: 'dom',
            environment: 'jsdom',
            setupFiles: ['./test/setup.dom.ts'],
            include: [
              'src/**/*.{test,spec}.{ts,tsx}',
              'src/**/*.{dom}.{test,spec}.{ts,tsx}',
              'test/**/*.{test,spec}.{ts,tsx}',
              'test/**/*.{dom}.{test,spec}.{ts,tsx}',
            ],
            css: true,
            restoreMocks: true,
            clearMocks: true,
            mockReset: true,
          },
        }),
      ),
    ],
  },
});

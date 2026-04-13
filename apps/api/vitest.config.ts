import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      all: true,
      exclude: [
        'index.ts',
        'nest.ts',
        'src/aop/**',
        '**/*.module.ts',
        '**/*.controller.ts',
        '**/__mocks__/**',
        '**/docs/**',
      ],
      provider: 'v8',
      reporter: ['json', 'html'],
      reportsDirectory: 'coverage',
    },
    globals: true,
    hookTimeout: 30000,
    include: ['src/**/__tests__/**/*.test.ts'],
    testTimeout: 30000,
  },
});

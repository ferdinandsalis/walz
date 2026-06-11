// Owned flat config, originally adapted from @epic-web/config (MIT).
// We forked when upstream moved to oxlint/oxfmt so we can track
// eslint/typescript on our own schedule.
import vitestPlugin from '@vitest/eslint-plugin'
import importPlugin from 'eslint-plugin-import-x'
import playwrightPlugin from 'eslint-plugin-playwright'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import globals from 'globals'
import { parser as tsParser, plugin as tsPlugin } from 'typescript-eslint'

const ERROR = 'error'
const WARN = 'warn'

// Unit tests (vitest) live next to the code; e2e specs (playwright) in tests/.
const vitestFiles = ['app/**/*.test.{ts,tsx}', 'tests/setup/**']
const playwrightFiles = ['tests/**/*.spec.ts']
const allTestFiles = [...vitestFiles, ...playwrightFiles, 'tests/**']

export default [
  {
    ignores: [
      '**/.cache/**',
      '**/node_modules/**',
      '**/build/**',
      '**/public/**',
      '**/*.json',
      '**/playwright-report/**',
      '**/server-build/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.react-router/**',
    ],
  },

  // all files
  {
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unexpected-multiline': ERROR,
      'no-warning-comments': [
        ERROR,
        { terms: ['FIXME'], location: 'anywhere' },
      ],
      'import/no-duplicates': [WARN, { 'prefer-inline': true }],
      'import/order': [
        WARN,
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: '#*/**', group: 'internal' }],
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
        },
      ],
    },
  },

  // JSX/TSX files
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        jsx: true,
      },
    },
    rules: {
      'react/jsx-key': WARN,
    },
  },

  // react-hooks rules apply wherever components/hooks can be defined
  {
    files: ['**/*.ts?(x)', '**/*.js?(x)'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': ERROR,
      'react-hooks/exhaustive-deps': WARN,
    },
  },

  // JS and JSX files (TS handles these checks for .ts/.tsx)
  {
    files: ['**/*.js?(x)'],
    rules: {
      'no-undef': ERROR,
      'no-unused-vars': [
        WARN,
        {
          args: 'after-used',
          argsIgnorePattern: '^(_|ignored)',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^(_|ignored)',
        },
      ],
    },
  },

  // TS and TSX files
  {
    files: ['**/*.ts?(x)'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        WARN,
        {
          args: 'after-used',
          argsIgnorePattern: '^(_|ignored)',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^(_|ignored)',
        },
      ],
      'import/consistent-type-specifier-style': [WARN, 'prefer-inline'],
      '@typescript-eslint/consistent-type-imports': [
        WARN,
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        ERROR,
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/no-floating-promises': ERROR,
    },
  },

  // keep test helpers out of source files
  {
    files: ['**/*.ts?(x)', '**/*.js?(x)'],
    ignores: allTestFiles,
    rules: {
      'no-restricted-imports': [
        ERROR,
        {
          patterns: [
            {
              group: allTestFiles,
              message: 'Do not import test files in source files',
            },
          ],
        },
      ],
    },
  },

  // unit tests (vitest + testing-library)
  {
    files: vitestFiles,
    plugins: {
      'testing-library': testingLibraryPlugin,
      vitest: vitestPlugin,
    },
    rules: {
      'testing-library/no-unnecessary-act': [ERROR, { isStrict: false }],
      'testing-library/no-wait-for-side-effects': ERROR,
      'testing-library/prefer-find-by': ERROR,
      'vitest/no-focused-tests': [WARN, { fixable: false }],
      'vitest/no-import-node-test': ERROR,
      'vitest/prefer-comparison-matcher': ERROR,
      'vitest/prefer-equality-matcher': ERROR,
      'vitest/prefer-to-be': ERROR,
      'vitest/prefer-to-contain': ERROR,
      'vitest/prefer-to-have-length': ERROR,
      'vitest/valid-expect-in-promise': ERROR,
      'vitest/valid-expect': ERROR,
    },
  },

  // e2e specs (playwright) — epic-config matched **/tests/e2e/** which never
  // hit our layout, so these rules are newly effective here
  {
    files: playwrightFiles,
    plugins: {
      playwright: playwrightPlugin,
    },
    rules: {
      'playwright/max-nested-describe': ERROR,
      'playwright/missing-playwright-await': ERROR,
      'playwright/no-focused-test': WARN,
      'playwright/no-page-pause': ERROR,
      'playwright/no-standalone-expect': ERROR,
      'playwright/no-unsafe-references': ERROR,
      'playwright/prefer-comparison-matcher': ERROR,
      'playwright/prefer-equality-matcher': ERROR,
      'playwright/prefer-to-be': ERROR,
      'playwright/prefer-to-contain': ERROR,
      'playwright/prefer-to-have-count': ERROR,
      'playwright/prefer-to-have-length': ERROR,
      'playwright/prefer-web-first-assertions': ERROR,
      'playwright/valid-expect-in-promise': ERROR,
      'playwright/valid-expect': ERROR,
    },
  },
]

import js from '@eslint/js'
import react from 'eslint-plugin-react'
import hooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  { settings: { react: { version: 'detect' } } },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.idea/**',
      'playwright-report/**',
      'test-results/**',
      'src/**/*.d.ts',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['src/**/*.jsx'],
    plugins: { react },
    rules: {
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error',
      'react/no-unknown-property': 'error',
      'react/jsx-no-target-blank': 'error',
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': hooks },
    rules: { ...hooks.configs.recommended.rules },
  },
]

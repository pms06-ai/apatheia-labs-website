module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // Frontend layers
        'ui',
        'hooks',
        'api',
        'engines',
        'export',
        'sam',

        // Backend layers
        'tauri',
        'rust',
        'db',

        // Cross-cutting
        'types',
        'deps',
        'ci',
        'config',
        'docs',
        'tests',
      ],
    ],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'perf',
        'test',
        'docs',
        'style',
        'chore',
        'ci',
        'revert',
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 72],
  },
}

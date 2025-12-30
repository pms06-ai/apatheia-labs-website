const { fixupConfigRules, fixupPluginRules } = require("@eslint/eslintrc");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const { fixupConfigRules: _fixupConfigRules } = require("@eslint/eslintrc");

const compat = require("eslint-plugin-compat");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const next = require("eslint-plugin-next");

module.exports = [
  {
    ignores: [
      "**/out/**/*",
      "**/.next/**/*",
      "**/node_modules/**/*",
      "**/build/**/*",
      "**/dist/**/*",
      "**/tmp/**/*",
      "**/src-tauri/target/**/*",
      "**/modal/**/*",
    ],
  },
  ...fixupConfigRules([
    {
      extends: [js.configs.recommended, ...typescriptEslint.configs.recommended],
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      languageOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",
        globals: {
          ...require("globals").browser,
          ...require("globals").node,
        },
      },
      plugins: {
        "@typescript-eslint": typescriptEslint,
        "react": react,
        "react-hooks": reactHooks,
        "next": next,
        "compat": compat,
      },
      rules: {
        ...react.configs.recommended.rules,
        ...reactHooks.configs.recommended.rules,
        ...next.configs.recommended.rules,
        ...compat.configs.recommended.rules,
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            vars: "all",
            args: "none",
            ignoreRestSiblings: true,
            varsIgnorePattern: "^_",
            argsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-empty-object-type": "off",
        "react/no-unescaped-entities": "off",
        "prefer-const": "warn",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ]),
];

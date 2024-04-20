/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["test/**/*.{ts,tsx}"],
      parserOptions: {
        project: "./tsconfig.test.json",
      },
    },
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "import/prefer-default-export": "off",
    "react/require-default-props": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
  },
  root: true,
};

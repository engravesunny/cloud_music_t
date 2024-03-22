module.exports = {
  env: {
    browser: true,
    es2021: true,
    "vue/setup-compiler-macros": true,
  },
  parser: "vue-eslint-parser",
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "./.eslintrc-auto-import.json",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
  },
  plugins: ["vue", "prettier"],
  rules: {
    "vue/multi-word-component-names": "off",
    "prettier/prettier": "error",
  },
};

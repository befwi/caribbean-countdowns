import globals from "globals";

export default [
  {
    files: ["public/scripts/**/*.js"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
      sourceType: "script",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "eqeqeq": ["error", "always"],
    },
  },
];

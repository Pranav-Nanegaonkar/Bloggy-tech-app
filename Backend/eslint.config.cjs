// eslint.config.cjs
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // For CommonJS
    },
    rules: {
      "require-await": "warn",
      "no-return-await": "warn",
      "no-unused-expressions": "warn",
      "no-void": "warn"
    },
  },
];

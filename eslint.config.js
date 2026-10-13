// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/*",
      "server_dist/*",
      "web-build/*",
      "attached_assets/*",
      "android/*",
      "ios/*",
      ".expo/*",
      ".cache/**",
      ".local/**",
      ".agents/**",
    ],
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "import/no-unresolved": "off",
    },
  },
]);

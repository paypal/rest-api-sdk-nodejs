module.exports = {
  "settings": {
    "ecmascript": 6,
    "import/resolver": "node"
  },
  "plugins": [
    "dependencies",
    "node",
    "standard",
    "import",
    "promise"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:node/recommended",
    "standard",
    "plugin:promise/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "rules": {
    "node/exports-style": [
      "error",
      "module.exports"
    ],
    "camelcase": "off",
    "semi": [2, "always"],
    "indent": ["error", 4],
    "dependencies/case-sensitive": 1,
    "dependencies/no-cycles": 1,
    "dependencies/no-unresolved": 1,
    "dependencies/require-json-ext": 1
  }
}

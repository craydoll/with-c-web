module.exports = {
  "root": true,
  "env": {
    es6: true,
    node: true,
  },
  "parserOptions": { // 既に入ってたのだった。eslint --init で作られたヤツに。
    "sourceType": "module",
    "ecmaVersion": 2017,
  },
  "extends": [
    "eslint:recommended",
    "google",
  ],
  "rules": {
    quotes: ["error", "double"],
  },
};

export default [
  {
    ignores: ["node_modules/*"],
    env: {
      node: true,
      jest: true,
      es6: true,
    },
    rules: {
      "no-console": "off",
    },
  },
];

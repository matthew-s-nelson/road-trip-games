module.exports = {
  '*.{ts,svelte.ts}': ['eslint --fix', 'prettier --write'],
  '*.svelte': ['eslint --fix', 'prettier --write'],
  '*': 'svelte-check --tsconfig ./tsconfig.json',
};

Read @docs/architecture/code-quality.md for the full code quality context before proceeding.

Key rules:
- `svelte-check` always runs against the full project, not just staged files — a type error anywhere fails the pre-commit hook
- `npm run check` is the fastest way to verify there are no type errors before committing
- `npm run lint` runs both ESLint and svelte-check
- `npm run format` runs Prettier — run this before committing if the pre-commit hook rejects formatting
- Never use `--no-verify` to skip hooks; fix the underlying issue instead

$ARGUMENTS

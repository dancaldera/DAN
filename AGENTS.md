# Repository Guidelines

## Project Structure & Module Organization
- Code lives in `src/`:
  - `src/server.ts`: entrypoint; wires middleware and feature routers.
  - `src/router.ts`: minimal HTTP router with CORS.
  - `src/features/todos/`: feature modules (`router.ts`, `service.ts`).
  - `src/db/`: pooling and migrations (`pool.ts`, `migrate.ts`).
  - `src/config/db.ts`: DB config from env.
  - `src/middleware/`: cross‑cutting middleware.
- Place tests in `tests/` or alongside modules as `*_test.ts`.

## Build, Test, and Development Commands
- `deno task dev`: run the server locally on `:8000`.
- `deno task start`: production‑like run (same entry, configurable via env).
- `deno task migrate`: create tables and seed sample data.
- `deno test --allow-all`: run tests; add `--coverage=cov` for coverage.
- `deno fmt` / `deno lint`: format and lint the codebase.
- `docker compose up -d db`: start PostgreSQL locally; `docker compose up` to run API + DB.

## Coding Style & Naming Conventions
- Use 2‑space indentation; UTF‑8; LF line endings.
- File names: lowercase; prefer `snake_case.ts` (match nearby modules).
- Types/Interfaces: `PascalCase`; functions/vars: `camelCase`; constants: `SCREAMING_SNAKE_CASE`.
- One feature per folder under `src/features/` with `router.ts` + `service.ts`.
- Run `deno fmt` and `deno lint` before pushing.

## Testing Guidelines
- Use Deno’s built‑in test runner; name tests `*_test.ts`.
- Organize by feature (e.g., `src/features/todos/service_test.ts`) or under `tests/` mirroring paths.
- Aim for ≥80% coverage of feature services and routers.
- Example: `deno test --allow-net --allow-env --coverage=cov`.

## Commit & Pull Request Guidelines
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`.
- Write imperative, concise subjects; include scope when helpful (e.g., `feat(todos): toggle endpoint`).
- PRs must include: purpose/summary, linked issues, testing steps or `curl` examples, screenshots (for UI/HTMX), and migration notes if DB changes.

## Security & Configuration Tips
- Do not commit secrets; use `.env` locally and Docker env for containers.
- Key env vars: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PORT`, `DENO_ENV`.
- Prefer least privileges locally (`--allow-net --allow-env --allow-read`); migrations intentionally use `--allow-all`.

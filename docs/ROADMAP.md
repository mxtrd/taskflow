# Roadmap

## Stage 0 - Baseline (done)

- Recreate course project foundation
- Confirm integration with educational API
- Keep working `dal/bll/ui` baseline

## Stage 1 - Architecture migration (done)

- Introduce page-centric FSD-light folders (`app/pages/widgets/features/entities/shared`)
- Keep compatibility while moving modules gradually
- Move core API modules toward `entities/*/api`
- Document boundaries and conventions

## Stage 2 - Routing and page model (done)

- Add React Router
- Implement core routes:
  - `/login`
  - `/boards`
  - `/boards/:boardId`
  - `/boards/:boardId/tasks/:taskId` (or details panel route model)
  - `/profile`
- Add protected route flow

## Stage 3 - API-backed local state via Context (done)

- Keep native React state management via Context/hooks for MVP
- Migrate boards/tasks flow from localStorage to backend API
- Keep `useBoards` / `useTasks` contracts stable for pages

## Stage 4 - State management (planned)

Choose one of two implementation tracks:

### Option A - RTK + RTK Query

- Add Redux Toolkit store as single source of truth
- Add RTK Query API slices for auth, boards, and tasks
- Migrate async data flow from Context to RTK Query hooks
- Keep endpoint typing and cache invalidation inside RTK Query

### Option B - RTK + Axios

- Add Redux Toolkit store with slices/selectors for auth, boards, tasks
- Add centralized Axios client (`baseURL`, `api-key`, interceptors, refresh retry)
- Use thunks (or middleware) for async operations via Axios
- Keep DTO mappers and API modules in `entities/*/api`

Decision note:

- Option A is better when the goal is modern Redux data fetching and cache ergonomics.
- Option B is better when the goal is explicitly demonstrating Axios/interceptors architecture.

## Stage 5 - Forms and validation (planned)

- Add React Hook Form
- Add Zod schemas for login, board, task forms
- Standardize form error UX

## Stage 6 - Data layer hardening (depends on Stage 4 choice)

- If Option A selected: harden RTK Query configuration (error mapping, retries, cache invalidation rules)
- If Option B selected: finalize Axios interceptors and standardize API error mapping
- Keep refresh-token flow centralized and consistent for all protected requests

Already done in current stage:

- Refresh-token retry flow on `401`
- Protected route bootstrapping via `GET /auth/me`
- Boards owner CRUD integration
- Tasks integration: public read + owner write

## Stage 7 - Product completeness (MVP)

- Finalize endpoints in active use:
  - Auth: login/refresh/logout/me
  - Boards Owner: my + create/update/delete
  - Tasks: public list/details + owner create/update/delete
- Polish loading/error/empty states
- Add pending/disabled states for mutation actions
- Add reusable UI components in `shared/ui`

## Stage 8 - Advanced portfolio features (optional)

- Task move/reorder + board reorder
- Attachments and board image upload
- Optimistic updates
- WebSocket live updates

## Stage 9 - Optional expansion

- SSR-ready architecture exploration
- Potential Next.js migration
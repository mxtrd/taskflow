# Roadmap

## Stage 0 - Baseline (done)

- Recreate course project foundation
- Confirm integration with educational API
- Keep working `dal/bll/ui` baseline

## Stage 1 - Architecture migration

- Introduce page-centric FSD-light folders (`app/pages/widgets/features/entities/shared`)
- Keep compatibility while moving modules gradually
- Move core API modules toward `entities/*/api`
- Document boundaries and conventions

## Stage 2 - Routing and page model

- Add React Router
- Implement core routes:
  - `/login`
  - `/boards`
  - `/boards/:boardId`
  - `/boards/:boardId/tasks/:taskId` (or details panel route model)
  - `/profile`
- Add protected route flow

## Stage 3 - State management

- Add Redux Toolkit
- Introduce slices/selectors for auth, boards, tasks
- Move state from local hooks to predictable shared store

## Stage 4 - Forms and validation

- Add React Hook Form
- Add Zod schemas for login, board, task forms
- Standardize form error UX

## Stage 5 - API client and auth flow hardening

- Replace ad-hoc fetch calls with Axios client
- Add request/response interceptors
- Implement refresh-token flow and centralized error handling

## Stage 6 - Product completeness (MVP)

- Finalize endpoints in active use:
  - Auth: login/refresh/logout/me
  - Boards Owner: my + create/update/delete
  - Tasks Owner: list/details/create/update/delete
- Polish loading/error/empty states
- Add reusable UI components in `shared/ui`

## Stage 7 - Advanced portfolio features (optional)

- Task move/reorder + board reorder
- Attachments and board image upload
- Optimistic updates
- WebSocket live updates

## Stage 8 - Optional expansion

- SSR-ready architecture exploration
- Potential Next.js migration
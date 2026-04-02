# Architecture

## Current state

The codebase started from a course-oriented layered approach:

- `dal` - API calls and DTOs
- `bll` - business logic in hooks
- `ui` - presentational components

This baseline is valid for early learning, but not ideal for scaling product features.

Current implemented baseline in this repository:

- routing is page-centric (`/login`, `/boards`, `/boards/:boardId`, `/boards/:boardId/tasks/:taskId`, `/profile`)
- auth is session-based with token pair and refresh retry on `401`
- boards use owner endpoints for read/write
- tasks use public endpoints for read and owner endpoints for write
- app state is currently native React Context/hooks (RTK planned later)

## Target state: page-centric FSD-light

Taskflow uses a practical hybrid:

- page-centric routing and screen composition
- FSD-like layering for boundaries and reuse
- lightweight rules to avoid overengineering

### Top-level structure

- `app` - providers, router, global app config/styles
- `pages` - route-level pages (`login`, `boards`, `board`, `task`, `profile`)
- `widgets` - reusable page sections (`app-header`, `sidebar`, `task-list`, `task-details-panel`)
- `features` - user use-cases (auth actions, board/task operations)
- `entities` - domain models and resource-oriented API modules
- `shared` - cross-cutting foundation (`api`, `lib`, `ui`, `config`)

## Responsibility boundaries

### Pages

- Compose widgets/features for a route
- Handle route params and page-level loading states
- Avoid deep business logic

### Features

- Implement user intentions: create/update/delete/login/logout
- Own form logic, validation, submit flow, local interaction state
- Use entities and shared modules

### Entities

- Define domain types/models (`User`, `Board`, `Task`)
- Keep resource-centric API modules close to domain (`entities/*/api`)
- Provide low-level data operations, not UI behavior

### Shared

- Reusable presentational UI primitives
- Utilities, date helpers, mappers
- Base API client and interceptors
- Global config/constants

## Data flow (target)

UI/Page -> Feature -> Entity API -> Backend API  
Backend response -> Entity model mapping -> Feature state -> UI

Current practical variation:

UI/Page -> Context action -> Entity API -> Backend API  
Backend response -> DTO mapping -> Context state -> UI

## API placement decision

For this project, API modules are colocated with entities because API endpoints mostly describe resources (users, boards, tasks), not only user actions.

Use this rule:

- Put low-level resource requests in `entities/*/api`
- Put scenario orchestration in `features/*`

## Current endpoint strategy

Because the educational backend exposes different capabilities for owner and public routes:

- Boards: owner endpoints for list/create/update/delete
- Tasks read: public endpoints (`GET /boards/{boardId}/tasks`, `GET /boards/{boardId}/tasks/{taskId}`)
- Tasks write: owner endpoints (`POST/PUT/DELETE /boards/{boardId}/tasks...`)

This hybrid is an intentional implementation choice for MVP compatibility with the API contract.

## Planned data-layer strategy (decision pending)

Two valid next-step options are supported:

- **Option A: RTK + RTK Query**
  - Use RTK Query as primary server-state layer
  - Keep endpoint declarations and cache invalidation close to Redux store
  - Reduce manual request lifecycle code in components/contexts

- **Option B: RTK + Axios**
  - Use RTK slices/selectors for state and Axios for HTTP communication
  - Centralize auth refresh and error normalization in Axios interceptors
  - Keep explicit control over request orchestration and transport logic

Both options should preserve existing entity API contracts and route-level behavior.

## Migration notes

- Migrate incrementally from `dal/bll/ui`
- Keep old modules working while introducing new slices
- Avoid big-bang rewrites
- Prioritize route structure and feature boundaries first

## Visual references

- Full endpoint screenshots (reference only):
  - `docs/assets/api-endpoints-full-1.png`
  - `docs/assets/api-endpoints-full-2.png`
  - `docs/assets/api-endpoints-full-3.png`
  - `docs/assets/api-endpoints-full-4.png`
- UI draft screenshot: `docs/assets/ui-draft-pages.png`

Important: even if the endpoint screenshot includes all API routes, implementation priorities are defined by the MVP endpoint list in `README.md`.
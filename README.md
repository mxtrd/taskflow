# Taskflow

Taskflow is a portfolio project: a practical task manager inspired by Trello, but intentionally smaller and focused on real-world frontend architecture.

The project uses the educational API from IT-Incubator:  
https://trelly.it-incubator.app

## Goal

Build a production-like React application that demonstrates:

- architecture thinking
- clean TypeScript code
- modern React ecosystem usage
- realistic product workflows (auth, boards, tasks)

## Product scope

Taskflow is not a full Trello clone. It is a focused task manager with:

- authentication
- personal boards
- task CRUD inside a selected board
- task details view/edit flow

## API scope

### Core endpoints (MVP)

- Auth: `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- Boards (owner): `GET /boards/my`, `POST /boards`, `PUT /boards/{boardId}`, `DELETE /boards/{boardId}`
- Tasks (owner): `GET /boards/{boardId}/tasks`, `GET /boards/{boardId}/tasks/{taskId}`, `POST /boards/{boardId}/tasks`, `PUT /boards/{boardId}/tasks/{taskId}`, `DELETE /boards/{boardId}/tasks/{taskId}`

### Optional later

- Reorder/move: `PUT /boards/{boardId}/reorder`, `PUT /boards/{boardId}/tasks/{taskId}/reorder`, `PUT /boards/{boardId}/tasks/{taskId}/move`
- Attachments and board image upload
- Public endpoints (only if needed for showcase scenarios)

### Endpoint visuals (full API reference)

Endpoint screenshots are split into 4 files for readability and quality:

- `docs/assets/api-endpoints-full-1.png`
- `docs/assets/api-endpoints-full-2.png`
- `docs/assets/api-endpoints-full-3.png`
- `docs/assets/api-endpoints-full-4.png`

These images can include all educational API endpoints and are used only as visual reference.

Source of truth for implementation priorities is still the MVP list in this section.

## Target pages

- `/login` - authentication
- `/boards` - user boards list and board CRUD
- `/boards/:boardId` - board task list and task CRUD
- `/boards/:boardId/tasks/:taskId` (or side panel) - task details
- `/profile` - user settings and logout

### UI draft visuals

The image `docs/assets/ui-draft-pages.png` stores the rough page design references used in planning.

## Architecture direction

Current state follows course-style layers (`dal / bll / ui`).

Target state is **page-centric FSD-light**:

- `app` - app-level providers, routing, global styles
- `pages` - route-level composition
- `widgets` - reusable page blocks
- `features` - user actions/use-cases (login, create task, etc.)
- `entities` - domain models and resource-oriented API modules
- `shared` - reusable UI, utils, config, base API client

See details in `docs/ARCHITECTURE.md`.

## Tech stack

### Current

- React
- TypeScript
- Fetch API
- CSS Modules

### Planned

- React Router
- Redux Toolkit
- React Hook Form
- Zod
- Axios
- WebSocket (optional advanced stage)

## Roadmap

The implementation plan is documented in `docs/ROADMAP.md`.

## Team-like workflow

Git process and collaboration-style practices are documented in `docs/GIT_WORKFLOW.md`.
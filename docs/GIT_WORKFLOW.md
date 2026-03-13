# Git Workflow

This document describes a team-like git process for this solo portfolio project.

## Why this matters

Recruiters and teams evaluate not only code, but also collaboration habits:

- clear branch strategy
- focused commits
- understandable PRs
- predictable releases

Workflow model: **GitHub Flow**.

- `main` is always deployable
- all changes go through Pull Requests
- merge only after green CI checks

## Branch strategy

- `main` - stable production-like branch
- `feature/<short-scope>` - new functionality
- `fix/<bug-name>` - bug fixes
- `refactor/<area>` - code improvements without behavior changes
- `chore/<infra-or-docs>` - maintenance tasks

Example:

- `feature/boards-routing`
- `fix/task-details-loading`
- `refactor/task-api-layer`

## Task tracking (issue -> branch -> PR)

Every feature should be linked to a task/ticket.

Example:

- Issue: `#24 Add boards list page`
- Branch: `feature/24-boards-list`
- PR description: `Closes #24`

If external tracker is unavailable, keep a local task ID in notes and mirror it in branch and PR text.

## Daily flow (team-style)

1. Sync baseline
   - `git switch main`
   - `git pull origin main`
   - Why: start from latest shared state.
2. Create task branch
   - `git switch -c feature/<name>`
   - Why: isolate changes and reduce risk for teammates.
3. Implement in small slices
   - commit frequently with meaningful messages
   - Why: easier review and rollback.
4. Re-sync with main before PR
   - `git fetch origin`
   - `git rebase origin/main`
   - Why: reduce merge conflicts and keep history clean.
5. Open Pull Request
   - include summary, motivation, test plan, and screenshots if UI changed
   - Why: async communication and review clarity.
6. Merge after review
   - use standard merge strategy agreed by team
   - delete branch
   - Why: keep repository tidy.

## Draft PR practice

Open a Draft PR early when:

- architecture needs feedback
- feature is large
- UI/UX requires early discussion

This reduces rework and aligns implementation direction earlier.

## Canonical example (already practiced)

This repository already used this exact lifecycle with branch:

- `chore/context-docs-and-ai-rules`

Use it as a reference scenario from task setup to final cleanup.

### A. Task setup

- Define scope: docs + AI context persistence only.
- Confirm acceptance criteria before coding.

### B. Branch and implementation

```bash
git switch main
git pull origin main
git switch -c chore/context-docs-and-ai-rules
```

Then implement and commit only relevant files.

### C. Push and PR

```bash
git push -u origin chore/context-docs-and-ai-rules
```

Create PR with:

- `base: main`
- `compare: chore/context-docs-and-ai-rules`
- clear summary, risk, rollback, test plan

### D. Merge strategy choice

Practical rule:

- docs/chore or many WIP commits -> `Squash and merge`
- important feature with meaningful step commits -> `Rebase and merge`
- explicit branch trace required by team policy -> `Create a merge commit`

For `chore/context-docs-and-ai-rules`, `Squash and merge` was the right choice.

### E. Post-merge cleanup (local + remote)

```bash
git switch main
git pull origin main
git branch -d chore/context-docs-and-ai-rules
git push origin --delete chore/context-docs-and-ai-rules
git fetch --prune
git status
git branch -r
```

Expected result:

- local branch removed
- remote branch removed
- working tree clean
- only active remote branches shown

## Commit message convention

Use Conventional Commits:

- `feat: add board list page route`
- `fix: handle null boardId in task details request`
- `refactor: move task api to entities layer`
- `docs: add git workflow guide`
- `chore: update lint config`

Recommended format:

`type(scope): short imperative message`

Examples:

- `feat(auth): add me endpoint bootstrap`
- `fix(task): prevent stale details render`

## Pull Request checklist

Before opening PR:

- branch is up to date with `main`
- no debug leftovers or unrelated files
- lint/build pass
- manual smoke test completed
- docs updated if architecture/behavior changed

Quality gates:

- CI must pass: `lint`, `typecheck`, `build`
- prefer small PRs over large ones (guideline: split when practical)
- if PR is large, explain why and list review hotspots

Use `.github/PULL_REQUEST_TEMPLATE.md`.

## Team interaction simulation (for portfolio)

When working solo, simulate collaboration:

- create a mini ticket in your notes for each task
- write PR description as if reviewer is a teammate
- leave self-review comments for risky lines
- explicitly list tradeoffs and known limitations

This creates realistic engineering artifacts for interviews.

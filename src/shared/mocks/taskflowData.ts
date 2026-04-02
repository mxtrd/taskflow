export type TaskStatus = 0 | 1 | 2 | 3

export type LocalBoard = {
  id: string
  title: string
  description: string
}

export type LocalTask = {
  id: string
  boardId: string
  title: string
  description: string
  status: TaskStatus
}

export type TasksByBoardId = Record<string, LocalTask[]>

export const mockBoards: LocalBoard[] = [
  {
    id: 'board-web-foundation',
    title: 'Web Foundation',
    description: 'Core frontend basics and browser fundamentals.',
  },
  {
    id: 'board-react-core',
    title: 'React Core',
    description: 'Components, state, effects, and app structure.',
  },
  {
    id: 'board-typescript-practice',
    title: 'TypeScript Practice',
    description: 'Type-safe patterns for real product code.',
  },
  {
    id: 'board-deployment-and-ci',
    title: 'Deployment & CI',
    description: 'Build, checks, and delivery workflows.',
  },
]

export const mockTasksByBoardId: TasksByBoardId = {
  'board-web-foundation': [
    {
      id: 'task-html-layout',
      boardId: 'board-web-foundation',
      title: 'HTML layout',
      description:
        'Build semantic page sections with proper heading structure.',
      status: 0,
    },
    {
      id: 'task-css-flex-grid',
      boardId: 'board-web-foundation',
      title: 'CSS flex/grid',
      description: 'Recreate dashboard layout using flex and grid composition.',
      status: 0,
    },
    {
      id: 'task-dom-events',
      boardId: 'board-web-foundation',
      title: 'DOM events',
      description:
        'Handle click, input, and keyboard events in vanilla examples.',
      status: 1,
    },
    {
      id: 'task-accessibility',
      boardId: 'board-web-foundation',
      title: 'Accessibility basics',
      description: 'Add labels, focus order, and aria attributes to forms.',
      status: 0,
    },
  ],
  'board-react-core': [
    {
      id: 'task-component-splitting',
      boardId: 'board-react-core',
      title: 'Component splitting',
      description: 'Extract reusable card and layout components.',
      status: 0,
    },
    {
      id: 'task-state-lifting',
      boardId: 'board-react-core',
      title: 'State lifting',
      description: 'Move shared state to parent and pass callbacks via props.',
      status: 1,
    },
    {
      id: 'task-router-flow',
      boardId: 'board-react-core',
      title: 'Router flow',
      description:
        'Connect boards list, board details, and task details routes.',
      status: 0,
    },
    {
      id: 'task-form-handlers',
      boardId: 'board-react-core',
      title: 'Form handlers',
      description: 'Add create/edit handlers for local UI forms.',
      status: 2,
    },
  ],
  'board-typescript-practice': [
    {
      id: 'task-union-types',
      boardId: 'board-typescript-practice',
      title: 'Union types',
      description: 'Use narrow unions for task status and action variants.',
      status: 0,
    },
    {
      id: 'task-prop-typing',
      boardId: 'board-typescript-practice',
      title: 'Prop typing',
      description: 'Add explicit props for item components and callbacks.',
      status: 1,
    },
    {
      id: 'task-type-aliases',
      boardId: 'board-typescript-practice',
      title: 'Type aliases',
      description: 'Extract reusable board/task models into shared mocks file.',
      status: 0,
    },
    {
      id: 'task-guards',
      boardId: 'board-typescript-practice',
      title: 'Route guards',
      description: 'Show fallback content for unknown board and task params.',
      status: 0,
    },
  ],
  'board-deployment-and-ci': [
    {
      id: 'task-lint-check',
      boardId: 'board-deployment-and-ci',
      title: 'Lint check',
      description: 'Run lint before opening pull request.',
      status: 1,
    },
    {
      id: 'task-typecheck-check',
      boardId: 'board-deployment-and-ci',
      title: 'Typecheck check',
      description: 'Ensure TS build passes without diagnostics.',
      status: 0,
    },
    {
      id: 'task-build-check',
      boardId: 'board-deployment-and-ci',
      title: 'Build check',
      description: 'Validate production build output before merge.',
      status: 0,
    },
    {
      id: 'task-pr-template',
      boardId: 'board-deployment-and-ci',
      title: 'PR template quality',
      description: 'Fill summary, risk, rollback, and test plan sections.',
      status: 2,
    },
  ],
}

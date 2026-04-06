import type { TaskStatus } from '@/shared/mocks/taskflowData'

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  0: 'In Progress',
  1: 'Done',
  2: 'Draft',
  3: 'Backlog',
}

export const getTaskStatusLabel = (status: TaskStatus): string =>
TASK_STATUS_LABELS[status]
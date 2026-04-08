import type { LocalTask } from '@/shared/mocks/taskflowData'

export type TaskUpdate = Partial<Pick<LocalTask, 'title' | 'description' | 'status'>>

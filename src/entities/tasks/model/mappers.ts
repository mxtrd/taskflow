import type { LocalTask, TaskStatus } from '@/shared/mocks/taskflowData'
import type { TaskDataDto } from '@/entities/tasks/api/getTasksByBoardId'

export const normalizeTaskStatus = (status: number): TaskStatus =>
  status === 0 || status === 1 || status === 2 || status === 3 ? status : 0

export const mapTaskDtoToLocalTask = (boardId: string, dto: TaskDataDto): LocalTask => ({
  id: dto.id,
  boardId,
  title: dto.attributes.title,
  description: dto.attributes.description ?? '',
  status: normalizeTaskStatus(dto.attributes.status),
})

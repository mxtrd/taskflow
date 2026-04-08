import type { LocalBoard } from '@/shared/mocks/taskflowData'
import type { BoardDataDto } from '@/entities/boards/api/getMyBoards'

export const mapBoardDtoToLocalBoard = (dto: BoardDataDto): LocalBoard => ({
  id: dto.id,
  title: dto.attributes.title,
  description: dto.attributes.description,
})

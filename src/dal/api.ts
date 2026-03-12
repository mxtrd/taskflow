const prepareHeaders = () => {
  const apiKey = import.meta.env.VITE_API_KEY

  if (!apiKey) return undefined

  return {
    'api-key': apiKey
  }
}


export type GlobalTaskListItemDto = {
  id: string,
  title: string,
  boardId: string,
  status: 0 | 1 | 2 | 3,
  priority: 0 | 1 | 2 | 3 | 4,
  addedAt: string,
  attachmentsCount: number,
}

export type GlobalTaskListItemJsonApiData = {
  id: string,
  type: string,
  attributes: GlobalTaskListItemDto
}

type GlobalTaskListResponse = {
  data: GlobalTaskListItemJsonApiData[]
}


export const getTasks = () => {
  const promise: Promise<GlobalTaskListResponse> = fetch('https://trelly.it-incubator.app/api/1.0/boards/tasks', {
    headers: prepareHeaders()
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    return response.json()
  })

  return promise;
}

type TaskDetailsDto = {
  id: string,
  title: string | null,
  description: string | null,
  boardId: string,
  boardTitle: string,
  order: number,
  status: 0 | 1 | 2 | 3,
  priority: 0 | 1 | 2 | 3,
  startDate: string | null,
  deadline: string,
  addedAt: string,
  updatedAt: string,
  attachments: string[]
}

export type TaskDetailsData = {
  id: string,
  type: string,
  attributes: TaskDetailsDto
}

type GetTaskOutput = {
  data: TaskDetailsData
}

export const getTask = (taskId: string, boardId: string) => {
  const promise: Promise<GetTaskOutput> = fetch(`https://trelly.it-incubator.app/api/1.0/boards/${boardId}/tasks/${taskId}`, {
    headers: prepareHeaders()
  }).then(response => {
    if(!response.ok) {
      throw new Error('Failed to fetch task detail')
    }

    return response.json()
  })

  return promise
}
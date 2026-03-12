import { useState } from "react";

export function useTaskSelection() {
  const [taskId, setTaskId] = useState<string | null>(null)
  const [boardId, setBoardId] = useState<string | null>(null)

  return {
    taskId,
    setTaskId,
    boardId,
    setBoardId
  }
}
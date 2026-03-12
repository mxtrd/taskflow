import { useTasks } from "../bll/useTasks.ts";
import { TaskItem } from "./TaskItem.tsx";

type Props = {
  selectedTaskId: string | null,
  onTaskSelect: (taskId: string | null, boardId: string | null) => void
}

export function TasksList({ selectedTaskId, onTaskSelect }: Props) {
  const { tasks } = useTasks()

  if(tasks === null) {
    return (
      <h1>Загрузка</h1>
    )
  }

  if(tasks.length === 0) {
    return (
      <h1>Задачи отсутствуют</h1>
    )
  }

  const handleResetClick = () => {
    onTaskSelect?.(null, null)
  }

  const handleClick = (taskId: string, boardId: string) => {
    onTaskSelect?.(taskId, boardId)
  }

  return (
    <div>
      <button onClick={handleResetClick}>Reset</button>
      <ul>
        {
          tasks.map((task) => {
            return (
              <TaskItem
                key={task.id}
                task={task}
                isSelected={task.id === selectedTaskId}
                onSelect={handleClick}
              />
            )
          })
        }
      </ul>
    </div>
  )
}
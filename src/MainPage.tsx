import styles from "./MainPage.module.scss"
import { TasksList } from "./ui/TasksList.tsx";
import { TaskDetails } from "./ui/TaskDetails.tsx";
import { useTaskSelection } from "./bll/useTaskSelection.ts";

export function MainPage() {
  const { taskId, setTaskId, boardId, setBoardId } = useTaskSelection()

  const handleTaskSelect = (taskId: string | null, boardId: string | null) => {
    setTaskId(taskId)
    setBoardId(boardId)
  }
  return (
    <div className={styles.container}>
      <TasksList
        selectedTaskId={taskId}
        onTaskSelect={handleTaskSelect}
      />
      <TaskDetails
        taskId={taskId}
        boardId={boardId}
      />
    </div>
  )
}




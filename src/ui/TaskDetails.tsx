import styles from "./TaskDetails.module.scss"
import { useTaskDetails } from "../bll/useTaskDetails.ts";

type Props = {
  taskId: string | null,
  boardId: string | null,
}

export function TaskDetails({ taskId, boardId }: Props) {

  const { taskDetails } = useTaskDetails(taskId, boardId)

  return (
    <div>
      <div className={styles.task}>
        <h2>Task details</h2>
        <div>
          {!taskDetails && !taskId && 'Task is not selected'}
          {!taskDetails && taskId && 'loading'}
          {taskDetails && taskId && taskDetails.id !== taskId  && 'loading'}
          {
            taskDetails &&
            <div>
              <h3>title - {taskDetails.attributes.title}</h3>
              <div>board title - {taskDetails.attributes.boardTitle}</div>
              <div>description - {taskDetails.attributes.description ? taskDetails.attributes.description : 'no description'}</div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
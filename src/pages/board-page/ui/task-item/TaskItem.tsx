import { Link } from 'react-router-dom'
import type { LocalTask } from '@/shared/mocks/taskflowData'
import type { TaskStatus } from '@/shared/mocks/taskflowData'
import { getTaskStatusLabel } from '@/shared/lib/task-status'
import styles from './TaskItem.module.scss'

type Props = {
  boardId: string
  task: LocalTask
  onTaskCompleteChange: (boardId: string, taskId: string, isDone: boolean) => void,
  onDeleteTaskButtonCLick: (taskId: string) => void
}

const TaskItem = ({ boardId, task, onTaskCompleteChange, onDeleteTaskButtonCLick }: Props) => {
  const isCompleted = task.status === 1
  const taskPath = `/boards/${boardId}/tasks/${task.id}`

  const statusTone: Record<TaskStatus, string> = {
    0: styles.badgeInProgress,
    1: styles.badgeDone,
    2: styles.badgeDraft,
    3: styles.badgeBacklog,
  }

  return (
    <li className={styles.task}>
      <div className={styles.left}>
        <input
          type='checkbox'
          id={task.id}
          checked={isCompleted}
          onChange={(event) => onTaskCompleteChange(boardId, task.id, event.target.checked)}
        />
        <label htmlFor={task.id}>{task.title}</label>
      </div>

      <span className={`${styles.badge} ${statusTone[task.status]}`}>
        {getTaskStatusLabel(task.status)}
      </span>

      <div className={styles.right}>
        <button className={styles.contextButton}>...</button>
        <ul className={styles.dropdown}>
          <li className={styles.dropdownItem}>
            <Link className={styles.dropdownButton} to={taskPath}>
              Edit
            </Link>
          </li>
          <li className={styles.dropdownItem}>
            <button
              className={styles.dropdownButton}
              onClick={() => onDeleteTaskButtonCLick(task.id)}
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </li>
  )
}

export default TaskItem

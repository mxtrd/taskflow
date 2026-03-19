import { Link } from 'react-router-dom'
import type { LocalTask } from '@/shared/mocks/taskflowData'
import styles from './TaskItem.module.scss'

type Props = {
  boardId: string
  task: LocalTask
  onDeleteTaskButtonClick: (taskId: string) => void
  onTaskCompleteChange: (taskId: string, isDone: boolean) => void
}

const TaskItem = ({ boardId, task, onDeleteTaskButtonClick, onTaskCompleteChange }: Props) => {
  const isCompleted = task.status === 1
  const taskPath = `/boards/${boardId}/tasks/${task.id}`

  return (
    <li className={styles.task}>
      <div className={styles.left}>
        <input
          type='checkbox'
          id={task.id}
          checked={isCompleted}
          onChange={(event) => onTaskCompleteChange(task.id, event.target.checked)}
        />
        <label htmlFor={task.id}>{task.title}</label>
      </div>
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
              onClick={() => onDeleteTaskButtonClick(task.id)}
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

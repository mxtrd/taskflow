import { Link } from "react-router-dom"
import styles from "./TaskItem.module.scss"

type Props = {
  boardId: string
  task: {
    id: string
    attributes: {
      title: string
      status: number
    }
  }
}

const TaskItem = ({ boardId, task }: Props) => {
  const isCompleted = task.attributes.status === 1
  const taskPath = `/boards/${boardId}/tasks/${task.id}`

  return (
    <li className={styles.task}>
      <div className={styles.left}>
        <input type="checkbox" id={task.id} checked={isCompleted} readOnly />
        <label htmlFor={task.id}>
          <Link className={styles.taskLink} to={taskPath}>
            {task.attributes.title}
          </Link>
        </label>
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
            <button className={styles.dropdownButton}>Delete</button>
          </li>
        </ul>
      </div>
    </li>
  )
}

export default TaskItem

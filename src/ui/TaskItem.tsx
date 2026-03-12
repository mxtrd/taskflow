import type { GlobalTaskListItemJsonApiData } from "../dal/api.ts"
import clsx from "clsx"
import styles from "./TaskItem.module.scss"

type Props = {
  task: GlobalTaskListItemJsonApiData,
  isSelected: boolean,
  onSelect: (taskId: string, boardId: string) => void
}

export function TaskItem({ task, isSelected, onSelect }: Props) {

  const handleClick = () => {
    onSelect?.(task.id, task.attributes.boardId)
  }

  const className = clsx(
    styles.task,
    isSelected && styles.selected,
    styles[`priority${task.attributes.priority}`],
    task.attributes.status === 2 && styles.done // <- здесь
  );

  return (
    <li className={className} onClick={handleClick}>
      <ul className={styles.sublist}>
        <li className={styles.sublistItem}>
          <h3>Заголовок:</h3>
          <span>{task.attributes.title}</span>
        </li>
        <li className={styles.sublistItem}>
          <h3>Статус:</h3>
          <input type="checkbox" readOnly checked={task.attributes.status === 2} />
        </li>
        <li className={styles.sublistItem}>
          <h3>Дата создания задачи:</h3>
          <span>{new Date(task.attributes.addedAt).toLocaleDateString()}</span>
        </li>
      </ul>
    </li>
  )
}
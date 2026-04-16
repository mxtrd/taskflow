import type { LocalTask } from '@/shared/mocks/taskflowData'
import type { TaskStatus } from '@/shared/mocks/taskflowData'
import { getTaskStatusLabel } from '@/shared/lib/task-status'
import CustomCheckbox from '@/shared/ui/custom-checkbox'
import TaskActionsMenu from './task-actions-menu'
import styles from './TaskItem.module.scss'

type Props = {
  boardId: string
  task: LocalTask
  disabled?: boolean
  onTaskCompleteChange: (boardId: string, taskId: string, isDone: boolean) => void,
  onDeleteTaskButtonCLick: (taskId: string) => void
}

const TaskItem = ({
  boardId,
  task,
  disabled = false,
  onTaskCompleteChange,
  onDeleteTaskButtonCLick,
}: Props) => {
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
        <CustomCheckbox
          name={task.id}
          checked={isCompleted}
          disabled={disabled}
          label={task.title}
          onChange={(event) => onTaskCompleteChange(boardId, task.id, event.target.checked)}
        />
      </div>

      <span className={`${styles.badge} ${statusTone[task.status]}`}>
        {getTaskStatusLabel(task.status)}
      </span>

      <TaskActionsMenu
        taskPath={taskPath}
        taskId={task.id}
        disabled={disabled}
        onDeleteTaskButtonClick={onDeleteTaskButtonCLick}
      />
    </li>
  )
}

export default TaskItem

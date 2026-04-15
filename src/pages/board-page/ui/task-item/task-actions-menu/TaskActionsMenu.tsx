import { useNavigate } from 'react-router-dom'
import Button from '@/shared/ui/button'
import baseStyles from '@/app/styles/base.module.scss'
import { useTaskActionsMenu } from './model'
import styles from './TaskActionsMenu.module.scss'

type TaskActionsMenuProps = {
  taskPath: string
  taskId: string
  disabled?: boolean
  onDeleteTaskButtonClick: (taskId: string) => void
}

const TaskActionsMenu = (props: TaskActionsMenuProps) => {
  const {
    taskPath,
    taskId,
    disabled = false,
    onDeleteTaskButtonClick } = props

  const navigate = useNavigate()
  
  const {
    isOpen,
    containerRef,
    toggleMenu,
    closeMenu,
    handleContainerBlur,
    handleMenuKeyDown 
  } = useTaskActionsMenu()

  return (
    <div className={styles.right} ref={containerRef} onBlur={handleContainerBlur}>
      <Button
        type='button'
        variant='secondary'
        isIconOnly
        className={styles.contextButton}
        disabled={disabled}
        onClick={toggleMenu}
      >
        <span className={styles.contextDots} aria-hidden='true'>
          <span className={styles.contextDot} />
          <span className={styles.contextDot} />
          <span className={styles.contextDot} />
        </span>
      </Button>
      <ul
        className={`${baseStyles.listReset} ${styles.list} ${isOpen ? styles.listOpen : ''}`}
        onKeyDown={handleMenuKeyDown}
      >
        <li className={styles.dropdownItem}>
          <Button
            className={styles.dropdownAction}
            variant='primary'
            type='button'
            disabled={disabled}
            onClick={() => {
              navigate(taskPath)
              closeMenu()
            }}
          >
            Edit
          </Button>
        </li>
        <li className={styles.dropdownItem}>
          <Button
            className={styles.dropdownAction}
            variant='secondary'
            type='button'
            disabled={disabled}
            onClick={() => {
              onDeleteTaskButtonClick(taskId)
              closeMenu()
            }}
          >
            Delete
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default TaskActionsMenu

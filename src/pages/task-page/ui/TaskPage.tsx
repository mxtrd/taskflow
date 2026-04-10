import type { TaskStatus } from '@/shared/mocks/taskflowData'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBoardsRedux } from '@/shared/hooks/useBoardsRedux'
import { useTasksRedux } from '@/shared/hooks/useTasksRedux'
import BaseLayout from '@/app/layouts/base-layout'
import Button from '@/shared/ui/button'
import { TASK_STATUS_LABELS } from '@/shared/lib/task-status'
import { createRequiredTrimmedTextRules } from '@/shared/lib/form-rules'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './TaskPage.module.scss'
import { useForm } from 'react-hook-form'

type EditTaskFormValues = {
  title: string
  description: string
  status: string
}

const taskTitleRules = createRequiredTrimmedTextRules({
  fieldLabel: 'Task title',
  min: 2,
  max: 160,
})

const TaskPage = () => {
  const { boardId, taskId } = useParams<{ boardId: string; taskId: string }>()
  const { getBoardById, boardsError } = useBoardsRedux()
  const { getTaskById, loadTaskById, isLoadingTasks, isMutatingTasks, tasksError, updateTask } = useTasksRedux()
  const selectedBoard = boardId ? getBoardById(boardId) : undefined
  const selectedTask = boardId && taskId ? getTaskById(boardId, taskId) : undefined

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<EditTaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      status: '0',
    },
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (!boardId || !taskId) return

    loadTaskById(boardId, taskId).catch((error) => {
      console.error('Failed to load task details:', error)
    })
  }, [boardId, taskId, loadTaskById])

  const onSubmit = ({ title, description, status }: EditTaskFormValues) => {
    if (!boardId || !taskId || !selectedTask) return

    const normalizedTitle = title.trim()
    if (!normalizedTitle) return

    const statusRaw = Number(status)

    const normalizedStatus: TaskStatus =
      statusRaw === 0 || statusRaw === 1 || statusRaw === 2 || statusRaw === 3
        ? statusRaw
        : selectedTask.status

    updateTask(boardId, taskId, { title: normalizedTitle, description, status: normalizedStatus })
  }

  useEffect(() => {
    if (!selectedTask) return

    reset({
      title: selectedTask.title,
      description: selectedTask.description,
      status: String(selectedTask.status),
    })
  }, [selectedTask, reset])

  const isSubmitting = isMutatingTasks || isFormSubmitting

  const statusRules = {
    validate: (value: string) => {
      const parsed = Number(value)
      return [0, 1, 2, 3].includes(parsed) || 'Invalid task status'
    },
  }

  const STATUS_ORDER: TaskStatus[] = [0, 1, 2, 3]

  if (!selectedBoard) {
    return (
      <BaseLayout title='Taskflow | Task' description='Taskflow - task page'>
        <section className={styles.task}>
          <div className={baseStyles.container}>
            <div className={styles.content}>Task not found</div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  if (!selectedTask) {
    return (
      <BaseLayout title='Taskflow | Task' description='Taskflow - task page'>
        <section className={styles.task}>
          <div className={baseStyles.container}>
            <div className={styles.content}>
              {isLoadingTasks ? 'Loading task details...' : 'Task not found'}
            </div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title='Taskflow | Task' description='Taskflow - task page'>
      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={`${baseStyles.content} ${styles.taskContent}`}>
            <h1 className={baseStyles.title}>Task Details</h1>
            {isLoadingTasks && <p className={baseStyles.descr}>Loading task details...</p>}
            {boardsError && <p className={baseStyles.descr}>{boardsError}</p>}
            {tasksError && <p className={baseStyles.descr}>{tasksError}</p>}
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.column}>
                <label className={styles.label} htmlFor='title'>
                  Title
                </label>
                <input
                  className={styles.input}
                  type='text'
                  id='title'
                  {...register('title', taskTitleRules)}
                />
                {errors.title && <p className={baseStyles.descr}>{errors.title.message}</p>}
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor='description'>
                  Description
                </label>
                <textarea
                  className={styles.description}
                  id='description'
                  rows={5}
                  {...register('description', {
                    maxLength: { value: 4000, message: 'Maximum 4000 characters' },
                  })}
                ></textarea>
                {errors.description && <p className={baseStyles.descr}>{errors.description.message}</p>}
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor='status'>
                  Status
                </label>
                <select
                  className={styles.select}
                  id='status'
                  {...register('status', statusRules)}
                >
                  {
                    STATUS_ORDER.map((status) => (
                      <option key={status} value={String(status)}>
                        {TASK_STATUS_LABELS[status]}
                      </option>
                    ))
                  }
                </select>
                {errors.status && <p className={baseStyles.descr}>{errors.status.message}</p>}
              </div>
              <div className={styles.column}>
                <label className={styles.label}>Board</label>
                <input
                  className={styles.input}
                  type='text'
                  value={selectedBoard.title}
                  readOnly
                />
              </div>
              <div className={styles.column}>
                <Button
                  className={styles.button}
                  type='submit'
                  disabled={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default TaskPage

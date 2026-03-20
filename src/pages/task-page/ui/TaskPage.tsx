import { useParams } from 'react-router-dom'
import { useBoards } from '@/shared/hooks/useBoards'
import { useTasks } from '@/shared/hooks/useTasks'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './TaskPage.module.scss'

const TaskPage = () => {
  const { boardId, taskId } = useParams<{ boardId: string; taskId: string }>()
  const { getBoardById } = useBoards()
  const { getTaskById } = useTasks()
  const selectedBoard = boardId ? getBoardById(boardId) : undefined
  const selectedTask = boardId && taskId ? getTaskById(boardId, taskId) : undefined

  if (!selectedBoard || !selectedTask) {
    return (
      <BaseLayout title='Taskflow' description='Taskflow - task page'>
        <section className={styles.task}>
          <div className={baseStyles.container}>
            <div className={styles.content}>Task not found</div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title='Taskflow' description='Taskflow - task page'>
      <section className={styles.task}>
        <div className={baseStyles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Task Details</h1>
            <form className={styles.form} action='#'>
              <div className={styles.column}>
                <label className={styles.label} htmlFor="title">Title</label>
                <input
                  className={styles.input}
                  type='text'
                  id='title'
                  defaultValue={selectedTask.title}
                />
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor="description">Description</label>
                <textarea
                  className={styles.description}
                  id='description'
                  rows={5}
                  defaultValue={selectedTask.description}
                ></textarea>
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor="status">Status</label>
                <select
                  className={styles.select}
                  name='status'
                  id='status'
                  defaultValue={String(selectedTask.status)}
                >
                  <option className={styles.option} value='0'>
                    In Progress
                  </option>
                  <option className={styles.option} value='1'>
                    Done
                  </option>
                  <option className={styles.option} value='2'>
                    Draft
                  </option>
                </select>
              </div>
              <div className={styles.column}>
                <label className={styles.label}>Board</label>
                <input className={styles.input} type='text' value={selectedBoard.title} readOnly />
              </div>
              <div className={styles.column}>
                <button className={styles.button} type='submit'>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default TaskPage

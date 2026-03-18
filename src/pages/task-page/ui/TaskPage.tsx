import { useParams } from "react-router-dom"
import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import styles from "./TaskPage.module.scss"

const TaskPage = () => {
  const { boardId, taskId } = useParams<{ boardId: string; taskId: string }>()

  const hardcodedTask = {
    data: {
      id: "07b51554-f680-4b5f-8e81-dbcbe32d08cc",
      type: "tasks",
      attributes: {
        title: "html",
        order: -4,
        deadline: "2025-06-26T11:40:34.962Z",
        startDate: null,
        addedAt: "2025-08-27T17:51:48.031Z",
        priority: 1,
        status: 0,
        updatedAt: "2025-08-27T17:51:52.473Z",
        boardId: "e11c9480-dd73-4b08-a5fd-452465467805",
        boardTitle: "newt1",
        description: "",
        attachments: [],
      },
    },
  }

  const isTaskMatch =
    boardId === hardcodedTask.data.attributes.boardId && taskId === hardcodedTask.data.id

  if (!isTaskMatch) {
    return (
      <BaseLayout title="Taskflow" description="Taskflow - task page">
        <section className={styles.task}>
          <div className={baseStyles.container}>
            <div className={styles.content}>Task not found</div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title="Taskflow" description="Taskflow - task page">
      <section className={styles.task}>
        <div className={baseStyles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Task Details</h1>
            <form className={styles.form} action="#">
              <div className={styles.column}>
                <label className={styles.label} htmlFor="title">Title</label>
                <input
                  className={styles.input}
                  type="text"
                  id="title"
                  defaultValue={hardcodedTask.data.attributes.title}
                />
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor="description">Description</label>
                <textarea
                  className={styles.description}
                  id="description"
                  rows={5}
                  defaultValue={hardcodedTask.data.attributes.description}
                ></textarea>
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor="status">Status</label>
                <select
                  className={styles.select}
                  name="status"
                  id="status"
                  defaultValue={String(hardcodedTask.data.attributes.status)}
                >
                  <option className={styles.option} value="0">In Progress</option>
                  <option className={styles.option} value="1">Done</option>
                  <option className={styles.option} value="2">Draft</option>
                </select>
              </div>
              <div className={styles.column}>
                <button className={styles.button} type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default TaskPage

import { useParams } from "react-router-dom"
import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import TaskItem from "./task-item/TaskItem"
import styles from "./BoardPage.module.scss"

const BoardPage = () => {
  const hardcodedBoard = {
    id: "e11c9480-dd73-4b08-a5fd-452465467805",
    type: "boards",
    attributes: {
      title: "newt1",
      description: "newd1",
      addedAt: "2025-05-29T11:46:16.931Z",
      updatedAt: "2025-07-03T14:53:40.566Z",
      order: -1,
      isImportant: false,
      images: { main: [] },
    },
  }

  const hardcodedBoardTasks = {
    data: [
      {
        id: "07b51554-f680-4b5f-8e81-dbcbe32d08cc",
        type: "tasks",
        attributes: {
          title: "html",
          order: -4,
          deadline: "html",
          startDate: null,
          addedAt: "2025-08-27T17:51:48.031Z",
          priority: 1,
          status: 0,
          updatedAt: "2025-08-27T17:51:52.473Z",
          attachments: [],
        },
      },
      {
        id: "b6213cee-b407-4580-9276-be4f5919375d",
        type: "tasks",
        attributes: {
          title: "css",
          order: -3,
          deadline: "css",
          startDate: null,
          addedAt: "2025-08-27T17:51:44.710Z",
          priority: 1,
          status: 0,
          updatedAt: "2025-08-27T17:51:44.710Z",
          attachments: [],
        },
      },
      {
        id: "4c37b109-d930-4ad4-9e37-4f94d618b59a",
        type: "tasks",
        attributes: {
          title: "js",
          order: -2,
          deadline: "js",
          startDate: null,
          addedAt: "2025-08-27T17:51:21.515Z",
          priority: 1,
          status: 0,
          updatedAt: "2025-08-27T17:51:21.515Z",
          attachments: [],
        },
      },
      {
        id: "0319fde0-3e69-4240-9ee4-278ce525f7f6",
        type: "tasks",
        attributes: {
          title: "title3",
          order: -1,
          deadline: "title3",
          startDate: null,
          addedAt: "2025-07-03T14:56:48.867Z",
          priority: 0,
          status: 0,
          updatedAt: "2025-07-03T15:03:59.563Z",
          attachments: [],
        },
      },
    ],
    meta: {
      page: 1,
      pageSize: 10,
      totalCount: 4,
      pagesCount: 1,
    },
  }

  const { boardId } = useParams<{ boardId: string }>()

  if (boardId !== hardcodedBoard.id) {
    return (
      <BaseLayout title="Taskflow" description="Taskflow - board page">
        <section className={styles.board}>
          <div className={baseStyles.container}>
            <div className={baseStyles.content}>Board not found</div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title="Taskflow" description="Taskflow - board page">
      <section className={styles.board}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            <h1 className={styles.boardTitle}>
              {hardcodedBoard.attributes.title}
            </h1>
            <button className={styles.button} type="button">
              New Task
            </button>
            <ul className={`${styles.tasks} ${baseStyles.listReset}`}>
              {hardcodedBoardTasks.data.map((task) => (
                <TaskItem key={task.id} boardId={hardcodedBoard.id} task={task} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardPage

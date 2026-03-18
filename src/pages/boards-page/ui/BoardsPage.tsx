import BoardItem from "./board-item/BoardItem"
import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import styles from "./BoardsPage.module.scss"

const BoardsPage = () => {
  const boards = [
    {
      id: "e11c9480-dd73-4b08-a5fd-452465467805",
      type: "boards",
      attributes: {
        title: "newt1",
        description: "newd1",
        addedAt: "2025-05-29T11:46:16.931Z",
        updatedAt: "2025-07-03T14:53:40.566Z",
        order: -1,
        isImportant: false,
        images: {
          main: [],
        },
      },
    },
    {
      id: "41b6e618-8635-4f33-b181-e260348f868c",
      type: "boards",
      attributes: {
        title: "fff",
        description: "",
        addedAt: "2025-07-07T12:55:29.717Z",
        updatedAt: "2025-07-07T12:55:29.717Z",
        order: -1,
        isImportant: false,
        images: {
          main: [],
        },
      },
    },
    {
      id: "9dac44be-9f0e-412f-96d9-302307cf53cc",
      type: "boards",
      attributes: {
        title: "asdasd",
        description: "",
        addedAt: "2025-07-07T14:15:20.053Z",
        updatedAt: "2025-07-07T14:15:20.053Z",
        order: -2,
        isImportant: false,
        images: {
          main: [],
        },
      },
    },
    {
      id: "1c5c2947-1465-4877-913e-a4a67d0bfbf4",
      type: "boards",
      attributes: {
        title: "sdfsdf",
        description: "",
        addedAt: "2025-07-07T14:15:29.208Z",
        updatedAt: "2025-07-07T14:15:29.208Z",
        order: -3,
        isImportant: false,
        images: {
          main: [],
        },
      },
    },
    {
      id: "ed16e495-85a4-4e1e-aa8b-717d443b9c24",
      type: "boards",
      attributes: {
        title: "ewrewr",
        description: "",
        addedAt: "2025-07-07T14:51:39.217Z",
        updatedAt: "2025-07-07T14:51:39.217Z",
        order: -4,
        isImportant: false,
        images: {
          main: [],
        },
      },
    },
    {
      id: "13923117-72de-4788-a7f0-4c42f162a5ab",
      type: "boards",
      attributes: {
        title: "hfgh",
        description: "",
        addedAt: "2025-07-07T14:52:57.467Z",
        updatedAt: "2025-07-07T14:52:57.467Z",
        order: -5,
        isImportant: false,
        images: {
          main: [],
        },
      },
    },
  ]

  const hardcodedBoardId = "e11c9480-dd73-4b08-a5fd-452465467805"

  const hasBoards = true

  if (!hasBoards) {
    return <div>No boards</div>
  }

  return (
    <BaseLayout title="Taskflow" description="Taskflow - boards page">
      <section className={styles.boards}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            <h1 className={styles.title}>My Boards</h1>
            <button className={styles.button} type="button">
              Create New Board
            </button>
            <ul className={`${styles.boards} ${baseStyles.listReset}`}>
              {boards.map((board, index) => (
                <BoardItem 
                  key={board.id} 
                  board={board}
                  to={index === 0 ? `/boards/${hardcodedBoardId}` : "#"}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardsPage

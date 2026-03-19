import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import { mockBoards } from '@/shared/mocks/taskflowData'
import BoardItem from './board-item/BoardItem'
import styles from './BoardsPage.module.scss'

const BoardsPage = () => {
  const boards = mockBoards
  const hasBoards = boards.length > 0

  const deleteAllBoards = () => {
    console.log('Delete all boards')
  }

  const deleteBoard = (boardId: string) => {
    console.log(`Delete one board with id: ${boardId}`)
  }

  if (!hasBoards) {
    return (
      <BaseLayout title='Taskflow' description='Taskflow - boards page'>
        <section className={styles.boards}>
          <div className={baseStyles.container}>
            <div className={baseStyles.content}>
              <h1 className={styles.title}>No boards</h1>
            </div>
          </div>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title='Taskflow' description='Taskflow - boards page'>
      <section className={styles.boards}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            <h1 className={styles.title}>My Boards</h1>
            <div className={styles.buttons}>
              <button className={styles.button} type='button'>
                Create New Board
              </button>
              <button className={styles.button} type='button' onClick={deleteAllBoards}>
                Delete All Boards
              </button>
            </div>
            <ul className={`${styles.boards} ${baseStyles.listReset}`}>
              {boards.map((board) => (
                <BoardItem
                  key={board.id}
                  board={board}
                  to={`/boards/${board.id}`}
                  onDeleteBoardButtonClick={deleteBoard}
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

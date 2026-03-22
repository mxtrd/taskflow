import { useBoards } from '@/shared/hooks/useBoards'
import { useTasks } from '@/shared/hooks/useTasks'
import { useState } from 'react'
import type { SubmitEventHandler } from 'react'
import BoardItem from './board-item/BoardItem'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './BoardsPage.module.scss'

const BoardsPage = () => {
  const { boards, addBoard, deleteAllBoards } = useBoards()
  const { clearAllTasks } = useTasks()
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  const startCreateBoard = () => {
    if (isCreatingBoard) return

    setIsCreatingBoard(true)
  }

  const cancelCreateBoard = () => {
    setIsCreatingBoard(false)
    setNewBoardTitle('')
  }

  const handleCreateBoardSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') ?? '').trim()
    if (!title) return

    addBoard(title)
    setNewBoardTitle('')
    setIsCreatingBoard(false)
  }

  const deleteAllBoardsHandler = () => {
    const ok = confirm('Delete all boards? All tasks will be removed too?')
    if (!ok) return

    deleteAllBoards()
    clearAllTasks()
  }

  const deleteBoard = (boardId: string) => {
    console.log(`Delete one board with id: ${boardId}`)
  }

  return (
    <BaseLayout title='Taskflow' description='Taskflow - boards page'>
      <section className={styles.boards}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            <h1 className={styles.title}>My Boards</h1>
            <div className={styles.buttons}>
              <button
                className={styles.button}
                type='button'
                onClick={startCreateBoard}
              >
                Create New Board
              </button>
              <button
                className={styles.button}
                type='button'
                onClick={deleteAllBoardsHandler}
                disabled={boards.length === 0}
              >
                Delete All Boards
              </button>
            </div>
            {boards.length === 0 && !isCreatingBoard ? (
              <p>No boards yet</p>
            ) : (
              <ul className={`${styles.boards} ${baseStyles.listReset}`}>
                {isCreatingBoard && (
                  <li className={styles.board}>
                    <form onSubmit={handleCreateBoardSubmit}>
                      <input
                        type='text'
                        name='title'
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        placeholder='Board title...'
                        required
                      />
                      <button type='submit'>Save</button>
                      <button type='button' onClick={cancelCreateBoard}>
                        Cancel
                      </button>
                    </form>
                  </li>
                )}
                {boards.map((board) => (
                  <BoardItem
                    key={board.id}
                    board={board}
                    to={`/boards/${board.id}`}
                    onDeleteBoardButtonClick={deleteBoard}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardsPage

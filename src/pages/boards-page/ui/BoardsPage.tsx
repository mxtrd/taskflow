import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
// import { mockBoards } from '@/shared/mocks/taskflowData'
import BoardItem from './board-item/BoardItem'
import styles from './BoardsPage.module.scss'
import { useState } from 'react'
import { useBoards } from '@/shared/contexts/BoardsContext'

const BoardsPage = () => {
  const { boards, addBoard } = useBoards()
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  // const hasBoards = boards.length > 0

  const startCreateBoard = () => {
    if(isCreatingBoard) return
    
    setIsCreatingBoard(true)
  }

  const cancelCreateBoard = () => {
    setIsCreatingBoard(false)
    setNewBoardTitle('')
  }

  const saveBoardDraft = () => {
    const title = newBoardTitle.trim()

    if (!title) return

    addBoard(title)
    setNewBoardTitle('')
    setIsCreatingBoard(false)
  }

  const deleteAllBoards = () => {
    console.log('Delete all boards')
  }

  const deleteBoard = (boardId: string) => {
    console.log(`Delete one board with id: ${boardId}`)
  }

  // if (!hasBoards) {
  //   return (
  //     <BaseLayout title='Taskflow' description='Taskflow - boards page'>
  //       <section className={styles.boards}>
  //         <div className={baseStyles.container}>
  //           <div className={baseStyles.content}>
  //             <h1 className={styles.title}>No boards</h1>
  //           </div>
  //         </div>
  //       </section>
  //     </BaseLayout>
  //   )
  // }

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
                onClick={deleteAllBoards}
              >
                Delete All Boards
              </button>
            </div>
            <ul className={`${styles.boards} ${baseStyles.listReset}`}>
              {isCreatingBoard && (
                <li className={styles.board}>
                  <div>
                    <input
                      type='text'
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder='Board title...'
                    />
                    <button 
                      type='button' 
                      onClick={saveBoardDraft}
                      disabled={!newBoardTitle.trim()}
                    >
                      Save
                      </button>
                    <button type='button' onClick={cancelCreateBoard}>Cancel</button>
                  </div>
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
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardsPage

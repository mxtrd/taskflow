import { useTasksRedux } from '@/shared/hooks/useTasksRedux'
import { useState } from 'react'
import BoardItem from './board-item/BoardItem'
import SearchField from '@/shared/ui/search-field'
import BaseLayout from '@/app/layouts/base-layout'
import Button from '@/shared/ui/button'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './BoardsPage.module.scss'
import { useBoardsRedux } from '@/shared/hooks/useBoardsRedux'
import { useForm } from 'react-hook-form'
import { createRequiredTrimmedTextRules } from '@/shared/lib/form-rules'
import EditForm from '@/shared/ui/edit-form'

type CreateBoardFormValues = {
  title: string
}

const createBoardTitleRules = createRequiredTrimmedTextRules({
  fieldLabel: 'Board title',
  min: 2,
  max: 120,
})

const BoardsPage = () => {
  const {
    boards,
    isLoadingBoards,
    isMutatingBoards,
    boardsError,
    addBoard,
    deleteAllBoards,
    deleteBoard,
  } = useBoardsRedux()
  const { clearAllTasks, removeTasksForBoard, isMutatingTasks } = useTasksRedux()
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [searchBoardsQuery, setSearchBoardsQuery] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting }
  } = useForm<CreateBoardFormValues>({
    defaultValues: { title: '' },
    mode: 'onSubmit',
  })

  const startCreateBoard = () => {
    if (isCreatingBoard) return

    setIsCreatingBoard(true)
  }

  const cancelCreateBoard = () => {
    setIsCreatingBoard(false)
    reset()
  }


  const onCreateBoardSubmit = ({ title }: CreateBoardFormValues) => {
    const normalizedTitle = title.trim()
    if (!normalizedTitle) return
    addBoard(normalizedTitle)
    reset()
    setIsCreatingBoard(false)
    setSearchBoardsQuery('')
  }

  const deleteAllBoardsHandler = () => {
    const ok = confirm('Delete all boards? All tasks will be removed too?')
    if (!ok) return

    deleteAllBoards()
    clearAllTasks()
  }

  const deleteBoardHandler = (boardId: string) => {
    deleteBoard(boardId)
    removeTasksForBoard(boardId)
  }

  const searchBoardsNormalized = searchBoardsQuery.trim().toLowerCase()
  const filteredBoards = searchBoardsNormalized.length > 0
    ? boards.filter(({ title }) => title.toLowerCase().includes(searchBoardsNormalized))
    : boards

  const hasBoards = boards.length > 0
  const hasActiveBoardsSearch = searchBoardsNormalized.length > 0
  const noBoardsMatches = hasBoards && hasActiveBoardsSearch && filteredBoards.length === 0
  const isSubmitting = isMutatingBoards || isMutatingTasks || isFormSubmitting


  return (
    <BaseLayout title='Taskflow | Boards' description='Taskflow - boards page'>
      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            <h1 className={baseStyles.title}>My Boards</h1>
            <div className={styles.buttons}>
              <Button
                className={styles.createBoard}
                onClick={startCreateBoard}
                disabled={isSubmitting}
              >
                Create New Board
              </Button>
              <Button
                variant='secondary'
                className={styles.deleteBoard}
                onClick={deleteAllBoardsHandler}
                disabled={boards.length === 0 || isSubmitting}
              >
                Delete All Boards
              </Button>
            </div>
            <form>
              <SearchField
                type='search'
                value={searchBoardsQuery}
                name='boardsSearch'
                onChange={(event) => setSearchBoardsQuery(event.target.value)}
                placeholder="Find board"
              />
            </form>
            {isLoadingBoards && <p>Loading boards...</p>}
            {boardsError && <p>{boardsError}</p>}
            {boards.length === 0 && !isCreatingBoard ? (
              <p>No boards yet</p>
            ) : (
              <>
                <ul className={`${styles.boards} ${baseStyles.listReset}`}>
                  {isCreatingBoard && (
                    <li className={styles.board}>
                      <EditForm
                        onSubmit={handleSubmit(onCreateBoardSubmit)}
                        onCancel={cancelCreateBoard}
                        disabled={isSubmitting}
                        registration={register('title', createBoardTitleRules)}
                        error={errors.title?.message}
                        inputProps={{
                          type: 'text',
                          placeholder: 'Board title...',
                        }}
                      />
                    </li>
                  )}
                  {!noBoardsMatches &&
                    filteredBoards.map((board) => (
                      <BoardItem
                        key={board.id}
                        board={board}
                        to={`/boards/${board.id}`}
                        disableDelete={isSubmitting}
                        onDeleteBoardButtonClick={deleteBoardHandler}
                      />
                    ))}
                </ul>
                {noBoardsMatches && <p>Boards not found</p>}
              </>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardsPage

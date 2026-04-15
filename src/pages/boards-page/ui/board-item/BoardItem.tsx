import { Link } from 'react-router-dom'
import type { LocalBoard } from '@/shared/mocks/taskflowData'
import styles from './BoardItem.module.scss'
import Button from '@/shared/ui/button'

type Props = {
  board: LocalBoard
  to: string
  disableDelete?: boolean
  onDeleteBoardButtonClick: (boardId: string) => void
}

const BoardItem = ({ board, to, disableDelete = false, onDeleteBoardButtonClick }: Props) => {
  return (
    <li className={styles.board}>
      <Button
        variant='secondary'
        isIconOnly
        className={styles.button}
        onClick={() => onDeleteBoardButtonClick(board.id)}
        disabled={disableDelete}
      >
        <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true'>
          <path
            d='M12 4L4 12M4 4L12 12'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </Button>
      <div className={styles.body}>
        <Link className={styles.link} to={to}>
          <h3 className={styles.title}>{board.title}</h3>
        </Link>
      </div>
    </li>
  )
}

export default BoardItem

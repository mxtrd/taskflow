import { Link } from 'react-router-dom'
import type { LocalBoard } from '@/shared/mocks/taskflowData'
import styles from './BoardItem.module.scss'
import Button from '@/shared/ui/button'

type Props = {
  board: LocalBoard
  to: string
  onDeleteBoardButtonClick: (boardId: string) => void
}

const BoardItem = ({ board, to, onDeleteBoardButtonClick }: Props) => {
  return (
    <li className={styles.board}>
      <Button
        variant='secondary'
        className={styles.button}
        onClick={() => onDeleteBoardButtonClick(board.id)}
      >
        Delete
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

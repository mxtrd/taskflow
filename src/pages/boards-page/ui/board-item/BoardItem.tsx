import { Link } from 'react-router-dom'
import type { LocalBoard } from '@/shared/mocks/taskflowData'
import styles from './BoardItem.module.scss'

type Props = {
  board: LocalBoard
  to: string
  onDeleteBoardButtonClick: (boardId: string) => void
}

const BoardItem = ({ board, to, onDeleteBoardButtonClick }: Props) => {
  return (
    <li className={styles.board}>
      <button
        className={styles.button}
        onClick={() => onDeleteBoardButtonClick(board.id)}
      >
        Delete
      </button>
      <div className={styles.body}>
        <Link className={styles.link} to={to}>
          <h3 className={styles.title}>{board.title}</h3>
        </Link>
      </div>
    </li>
  )
}

export default BoardItem

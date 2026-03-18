import { Link } from "react-router-dom"
import styles from "./BoardItem.module.scss"

type Props = {
  board: {
    id: string
    attributes: {
      title: string
    }
  }
  to: string
}

const BoardItem = ({ board, to }: Props) => {
  return (
    <li className={styles.board}>
      <Link className={styles.boardLink} to={to}>
        <h3 className={styles.boardTitle}>{board.attributes.title}</h3>
      </Link>
    </li>
  )
}

export default BoardItem

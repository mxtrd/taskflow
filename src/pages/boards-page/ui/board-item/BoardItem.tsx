import styles from "../BoardsPage.module.scss"

type Props = {
  board: {
    id: string
    attributes: {
      title: string
    }
  }
}

const BoardItem = ({ board }: Props) => {
  return (
    <li className={styles.board}>
      <a className={styles.boardLink} href="#">
        <h3 className={styles.boardTitle}>{board.attributes.title}</h3>
      </a>
    </li>
  )
}

export default BoardItem

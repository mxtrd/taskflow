import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import styles from "./BoardsPage.module.scss"

const BoardsPage = () => {
  return (
    <BaseLayout title="Taskflow" description="Taskflow - boards page">
      <section className={styles.boards}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            <h1 className={styles.title}>My Boards</h1>
            <button className={styles.button} type="button">
              Create New Board
            </button>
            <div className={styles.boards}>
              <a className={styles.board} href="#">
                <h3 className={styles.boardTitle}>Work</h3>
              </a>
              <a className={styles.board} href="#">
                <h3 className={styles.boardTitle}>Study</h3>
              </a>
              <a className={styles.board} href="#">
                <h3 className={styles.boardTitle}>Personal</h3>
              </a>
            </div>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardsPage

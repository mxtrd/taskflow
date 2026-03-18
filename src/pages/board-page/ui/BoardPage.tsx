import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import styles from "./BoardPage.module.scss"

const BoardPage = () => {
  return (
    <BaseLayout title="Taskflow" description="Taskflow - board page">
      <section className={styles.board}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            <h1 className={styles.boardTitle}>Study Board</h1>
            <button className={styles.button} type="button">
              New Task
            </button>
            <ul className={`${styles.tasks} ${baseStyles.listReset}`}>
              <li className={styles.task}>
                <div className={styles.left}>
                  <input type="checkbox" id="1" />
                  <label htmlFor="1">Learn TypeScript</label>
                </div>
                <div className={styles.right}>
                  <button className={styles.contextButton}>...</button>
                  <ul className={styles.dropdown}>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Open</button>
                    </li>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Edit</button>
                    </li>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Delete</button>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={styles.task}>
                <div className={styles.left}>
                  <input type="checkbox" id="2" />
                  <label htmlFor="2">Learn TypeScript</label>
                </div>
                <div className={styles.right}>
                  <button className={styles.contextButton}>...</button>
                  <ul className={styles.dropdown}>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Open</button>
                    </li>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Edit</button>
                    </li>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Delete</button>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={styles.task}>
                <div className={styles.left}>
                  <input type="checkbox" id="3" />
                  <label htmlFor="3">Learn TypeScript</label>
                </div>
                <div className={styles.right}>
                  <button className={styles.contextButton}>...</button>
                  <ul className={styles.dropdown}>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Open</button>
                    </li>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Edit</button>
                    </li>
                    <li className={styles.dropdownItem}>
                      <button className={styles.dropdownButton}>Delete</button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default BoardPage

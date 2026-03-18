import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import styles from "./TaskPage.module.scss"

const TaskPage = () => {
  return (
    <BaseLayout title="Taskflow" description="Taskflow - task page">
      <section className={styles.task}>
        <div className={baseStyles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Task Details</h1>
            <form className={styles.form} action="#">
              <div className={styles.column}>
                <label className={styles.label} htmlFor="title">Title</label>
                <input className={styles.input} type="text" id="title" />
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor="description">Description</label>
                <textarea className={styles.description} type="textarea" id="description" rows="5"></textarea>
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor="status">Status</label>
                <select className={styles.select} name="select" id="status">
                  <option className={styles.option} value="In Progress">In Progress</option>
                  <option className={styles.option} value="Super Progress">Super Progress</option>
                  <option className={styles.option} value="Not in Progress">Not in Progress</option>
                </select>
              </div>
              <div className={styles.column}>
                <button className={styles.button} type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default TaskPage

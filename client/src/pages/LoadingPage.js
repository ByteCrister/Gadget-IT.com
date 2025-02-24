import React from 'react'
import styles from '../styles/ErrorAndLoading/loading.module.css'

const LoadingPage = () => {
  return (
    <section className={styles['spinner']}>
      <div className={styles["dot-spinner"]}>
        {
          Array.from({ length: 8 }).map((_, index) => {
            return <div key={index} className={styles["dot-spinner__dot"]}></div>
          })
        }
      </div>
    </section>
  )
}

export default LoadingPage
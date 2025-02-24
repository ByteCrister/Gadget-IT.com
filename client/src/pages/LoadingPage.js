import React from 'react'
import styles from '../styles/ErrorAndLoading/loading.module.css'

const LoadingPage = () => {
  return (
    <div className={styles["dot-spinner"]}>
    <div className={styles["dot-spinner__dot"]}></div>
    <div class={styles["dot-spinner__dot"]}></div>
    <div class={styles["dot-spinner__dot"]}></div>
    <div class={styles["dot-spinner__dot"]}></div>
    <div class={styles["dot-spinner__dot"]}></div>
    <div class={styles["dot-spinner__dot"]}></div>
    <div class={styles["dot-spinner__dot"]}></div>
    <div class={styles["dot-spinner__dot"]}></div>
</div>
  )
}

export default LoadingPage
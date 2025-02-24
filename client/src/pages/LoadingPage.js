import React from 'react'
import styles from '../styles/ErrorAndLoading/loading.module.css'

const LoadingPage = () => {
  return (
   <div className={styles.mainLoadingContainer}>
    <div className={styles.loader}></div>
   </div>
  )
}

export default LoadingPage
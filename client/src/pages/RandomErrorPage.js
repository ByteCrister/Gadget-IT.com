import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/ErrorAndLoading/error.module.css'

const RandomErrorPage = () => {
  return (
    <div className={styles['error-container']}>
      <div className={styles['error-title']}>404</div>
      <div className={styles['error-message']}>Oops! The page you're looking for doesn't exist.</div>
      <Link to="/" className={styles['back-home']}>Go Back Home</Link>
    </div>
  )
}

export default RandomErrorPage
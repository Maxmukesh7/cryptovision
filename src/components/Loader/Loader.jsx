import React from 'react'
import styles from './Loader.module.css'

function Loader({ size = 'md', label = 'Loading...' }) {
  const sizeClass = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  }[size] || styles.md

  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <div className={`${styles.spinner} ${sizeClass}`}>
        <div className={styles.ring} />
        <div className={styles.ring} />
        <div className={styles.ring} />
      </div>
      {label && <p className={styles.label}>{label}</p>}
    </div>
  )
}

export default Loader

import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <div className={styles.container} role="main">
      <div className={styles.content}>
        <div className={styles.glowOrb} aria-hidden="true" />

        <div className={styles.errorCode} aria-hidden="true">
          <span className={styles.digit}>4</span>
          <span className={styles.zeroWrapper}>
            <span className={styles.zeroInner}>0</span>
          </span>
          <span className={styles.digit}>4</span>
        </div>

        <div className={styles.textGroup}>
          <h1 className={styles.heading}>Page Not Found</h1>
          <p className={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            <br />
            Let&apos;s get you back to the dashboard.
          </p>
        </div>

        <Link id="back-home" to="/" className={styles.homeButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </Link>

        <div className={styles.decorGrid} aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={styles.decorCell} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotFound

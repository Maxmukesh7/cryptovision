import React from 'react'
import styles from './ErrorState.module.css'

const AlertIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.iconWrapper}>
        <AlertIcon />
      </div>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>{message || 'Failed to load cryptocurrency data.'}</p>
      {onRetry && (
        <button
          id="retry-btn"
          className={styles.retryButton}
          onClick={onRetry}
        >
          <RefreshIcon />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}

export default ErrorState

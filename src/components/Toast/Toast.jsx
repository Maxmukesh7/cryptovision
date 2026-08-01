import React from 'react'
import { useApp } from '../../context/AppContext'
import styles from './Toast.module.css'

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

function ToastContainer() {
  const { toasts, removeToast } = useApp()

  if (!toasts || toasts.length === 0) return null

  return (
    <div className={styles.toastContainer} role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.toastIcon}>
            {toast.type === 'success' ? <CheckCircleIcon /> : <InfoIcon />}
          </span>
          <span className={styles.toastMessage}>{toast.message}</span>
          <button
            className={styles.closeBtn}
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer

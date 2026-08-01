import React from 'react'
import styles from './ErrorBoundary.module.css'

const AlertTriangleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('CryptoVision ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.fallbackContainer} role="alert">
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <AlertTriangleIcon />
            </div>
            <h1 className={styles.title}>Something Went Wrong</h1>
            <p className={styles.message}>
              An unexpected application error occurred. Don&apos;t worry, your portfolio and settings are safely stored.
            </p>
            <button className={styles.resetBtn} onClick={this.handleReset}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

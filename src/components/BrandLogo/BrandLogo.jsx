import React from 'react'
import styles from './BrandLogo.module.css'

export const BrandMarkIcon = ({ size = 26, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${styles.markSvg} ${className}`}
  >
    {/* Geometric C arc */}
    <path
      d="M 23 8.5 A 11 11 0 1 0 23 23.5"
      className={styles.arcPath}
      strokeWidth="2.75"
      strokeLinecap="round"
    />
    {/* Trend chart line rising out of the center */}
    <path
      d="M 11 17.5 L 15 13.5 L 18.5 16.5 L 26.5 8.5"
      className={styles.arrowPath}
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrowhead */}
    <path
      d="M 21.5 8.5 H 26.5 V 13.5"
      className={styles.arrowPath}
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function BrandLogo({ size = 26, showText = true, className = '' }) {
  return (
    <div className={`${styles.brandContainer} ${className}`}>
      <div className={styles.markWrapper}>
        <BrandMarkIcon size={size} />
      </div>

      {showText && (
        <span className={styles.wordmark}>
          <span className={styles.cryptoText}>Crypto</span>
          <span className={styles.visionText}>Vision</span>
        </span>
      )}
    </div>
  )
}

export default React.memo(BrandLogo)

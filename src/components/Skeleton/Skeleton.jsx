import React from 'react'
import styles from './Skeleton.module.css'

export function SkeletonBox({ width, height, borderRadius, style }) {
  return (
    <div
      className={styles.skeleton}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius || 'var(--radius-sm)',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={styles.header}>
        <SkeletonBox width="60%" height="14px" />
        <SkeletonBox width="40px" height="40px" borderRadius="var(--radius-md)" />
      </div>
      <SkeletonBox width="80%" height="28px" style={{ marginTop: '12px' }} />
      <SkeletonBox width="40%" height="16px" style={{ marginTop: '8px' }} />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className={styles.tableSkeleton}>
      <div className={styles.toolbarSkeleton}>
        <SkeletonBox width="280px" height="38px" borderRadius="var(--radius-md)" />
        <SkeletonBox width="100px" height="20px" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.rowSkeleton}>
          <SkeletonBox width="30px" height="16px" />
          <div className={styles.coinSkeleton}>
            <SkeletonBox width="32px" height="32px" borderRadius="50%" />
            <SkeletonBox width="100px" height="18px" />
          </div>
          <SkeletonBox width="80px" height="16px" />
          <SkeletonBox width="60px" height="16px" />
          <SkeletonBox width="90px" height="16px" />
          <SkeletonBox width="90px" height="16px" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonMovers() {
  return (
    <div className={styles.moversSkeletonGrid}>
      {[1, 2].map((group) => (
        <div key={group} className={styles.moversCardSkeleton}>
          <SkeletonBox width="50%" height="20px" style={{ marginBottom: '16px' }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.moverRowSkeleton}>
              <SkeletonBox width="28px" height="28px" borderRadius="50%" />
              <SkeletonBox width="90px" height="16px" />
              <SkeletonBox width="70px" height="16px" style={{ marginLeft: 'auto' }} />
              <SkeletonBox width="50px" height="20px" borderRadius="99px" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className={styles.chartSkeleton}>
      <div className={styles.header}>
        <SkeletonBox width="200px" height="20px" />
        <SkeletonBox width="100px" height="20px" />
      </div>
      <SkeletonBox width="100%" height="240px" borderRadius="var(--radius-md)" style={{ marginTop: '16px' }} />
    </div>
  )
}

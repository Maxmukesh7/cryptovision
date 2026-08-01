import React from 'react'
import styles from './DashboardCard.module.css'

function DashboardCard({ title, value, subtitle, icon, trend, trendValue, accentColor }) {
  const isPositive = trend === 'up'

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.title}>{title}</p>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div
          className={styles.iconWrapper}
          style={{ '--card-accent': accentColor || 'var(--color-primary)' }}
        >
          {icon}
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.value}>{value}</p>
        {trendValue !== undefined && (
          <div className={`${styles.trend} ${isPositive ? styles.trendUp : styles.trendDown}`}>
            <span className={styles.trendArrow}>{isPositive ? '↑' : '↓'}</span>
            <span className={styles.trendValue}>{trendValue}</span>
          </div>
        )}
      </div>

      <div className={styles.sparklineArea} aria-hidden="true">
        <div className={styles.sparklinePlaceholder} />
      </div>
    </article>
  )
}

export default DashboardCard

import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import styles from './DashboardCustomizer.module.css'

const SlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
)

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SECTIONS = [
  { key: 'globalOverview', label: 'Global Market Overview' },
  { key: 'trendingCoins', label: 'Trending Cryptocurrencies' },
  { key: 'marketSentiment', label: 'Market Sentiment & Highlights' },
  { key: 'topMovers', label: 'Top Gainers & Losers' },
  { key: 'marketCharts', label: 'Market Analytics Charts' },
  { key: 'marketTable', label: 'Cryptocurrency Table' },
  { key: 'cryptoNews', label: 'Latest Crypto News' },
]

function DashboardCustomizer() {
  const { dashboardLayout, toggleLayoutSection } = useApp()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.customizerWrapper}>
      <button
        id="customize-dashboard-btn"
        className={styles.customizeBtn}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Customize Dashboard Widgets"
      >
        <SlidersIcon />
        <span>Customize Dashboard</span>
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog" aria-label="Dashboard widget visibility">
          <div className={styles.popoverHeader}>
            <span className={styles.popoverTitle}>Dashboard Layout</span>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className={styles.popoverList}>
            {SECTIONS.map(({ key, label }) => (
              <label key={key} className={styles.toggleRow}>
                <span className={styles.toggleLabel}>{label}</span>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={dashboardLayout[key] ?? true}
                  onChange={() => toggleLayoutSection(key)}
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(DashboardCustomizer)

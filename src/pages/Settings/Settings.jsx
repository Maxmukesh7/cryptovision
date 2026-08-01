import React from 'react'
import { useApp } from '../../context/AppContext'
import styles from './Settings.module.css'

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const RotateCcwIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
)

function Settings() {
  const {
    theme,
    toggleTheme,
    refreshInterval,
    setRefreshInterval,
    currency,
    setCurrency,
    watchlist,
    portfolio,
    exportData,
    resetPreferences,
  } = useApp()

  return (
    <section className={styles.container} aria-labelledby="settings-heading">
      <header className={styles.header}>
        <div>
          <h1 id="settings-heading" className={styles.title}>Application Settings</h1>
          <p className={styles.subtitle}>Customize your theme, refresh rates, currency &amp; data exports</p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* ── 1. Appearance & Theme ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Appearance &amp; Theme</h2>
          <p className={styles.cardDesc}>Choose between clean Light mode and sleek Dark mode</p>
          <div className={styles.themeOptions}>
            <button
              className={`${styles.themeBox} ${theme === 'light' ? styles.themeBoxActive : ''}`}
              onClick={toggleTheme}
            >
              <SunIcon />
              <span>Light Mode</span>
            </button>
            <button
              className={`${styles.themeBox} ${theme === 'dark' ? styles.themeBoxActive : ''}`}
              onClick={toggleTheme}
            >
              <MoonIcon />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* ── 2. Data & Auto Refresh Settings ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Data &amp; Auto Refresh</h2>
          <p className={styles.cardDesc}>Set automated polling frequency for market data</p>
          <div className={styles.formRow}>
            <label htmlFor="refresh-select" className={styles.label}>Refresh Interval:</label>
            <select
              id="refresh-select"
              className={styles.selectInput}
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
            >
              <option value={30000}>30 Seconds (Fast)</option>
              <option value={60000}>60 Seconds (Recommended)</option>
              <option value={120000}>2 Minutes (Conservative)</option>
              <option value={0}>Disabled (Manual Only)</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="currency-select" className={styles.label}>Default Currency:</label>
            <select
              id="currency-select"
              className={styles.selectInput}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($ - United States Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
            </select>
          </div>
        </div>

        {/* ── 3. Data Export ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Export Data</h2>
          <p className={styles.cardDesc}>Download your watchlist and portfolio data in CSV or JSON format</p>
          <div className={styles.exportGroup}>
            <div className={styles.exportItem}>
              <span>Watchlist Data ({watchlist.length} items)</span>
              <div className={styles.btnRow}>
                <button
                  className={styles.exportBtn}
                  onClick={() => exportData(watchlist.map((id) => ({ coinId: id })), 'cryptovision_watchlist', 'csv')}
                >
                  <DownloadIcon /> CSV
                </button>
                <button
                  className={styles.exportBtn}
                  onClick={() => exportData(watchlist, 'cryptovision_watchlist', 'json')}
                >
                  <DownloadIcon /> JSON
                </button>
              </div>
            </div>

            <div className={styles.exportItem}>
              <span>Portfolio Data ({portfolio.length} items)</span>
              <div className={styles.btnRow}>
                <button
                  className={styles.exportBtn}
                  onClick={() => exportData(portfolio, 'cryptovision_portfolio', 'csv')}
                >
                  <DownloadIcon /> CSV
                </button>
                <button
                  className={styles.exportBtn}
                  onClick={() => exportData(portfolio, 'cryptovision_portfolio', 'json')}
                >
                  <DownloadIcon /> JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Danger Zone / Reset ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Reset Preferences</h2>
          <p className={styles.cardDesc}>Restore default theme, interval settings, and layout preferences</p>
          <button className={styles.resetBtn} onClick={resetPreferences}>
            <RotateCcwIcon />
            <span>Reset All Preferences</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default React.memo(Settings)

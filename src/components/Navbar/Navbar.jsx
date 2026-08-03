import React from 'react'
import { useApp } from '../../context/AppContext'
import BrandLogo from '../BrandLogo/BrandLogo'
import styles from './Navbar.module.css'

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme, currency, setCurrency } = useApp()

  const handleShortcutClick = () => {
    const searchInput = document.getElementById('coin-search')
    if (searchInput) {
      searchInput.focus()
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <header className={styles.navbar} role="banner">
      <div className={styles.left}>
        <button
          id="sidebar-toggle"
          className={styles.menuButton}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>

        <BrandLogo size={28} />
      </div>

      <div className={styles.right}>
        {/* Quick Search Shortcut Badge */}
        <button
          className={styles.shortcutBadge}
          onClick={handleShortcutClick}
          title="Press Ctrl+K to Search"
        >
          <SearchIcon />
          <span>Quick Search...</span>
          <kbd>Ctrl+K</kbd>
        </button>

        {/* Currency Switcher Dropdown */}
        <div className={styles.currencySelectWrapper}>
          <select
            id="navbar-currency-select"
            className={styles.currencySelect}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Select currency"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle"
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  )
}

export default React.memo(Navbar)

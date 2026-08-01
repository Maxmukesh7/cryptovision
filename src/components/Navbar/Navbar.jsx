import React from 'react'
import { useApp } from '../../context/AppContext'
import styles from './Navbar.module.css'

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
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
  const { theme, toggleTheme } = useApp()

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

        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <span>CV</span>
          </div>
          <span className={styles.brandName}>
            Crypto<span className={styles.brandAccent}>Vision</span>
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <button
          id="theme-toggle"
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        <button id="profile-avatar" className={styles.avatar} aria-label="Profile">
          <span>MK</span>
        </button>
      </div>
    </header>
  )
}

export default React.memo(Navbar)

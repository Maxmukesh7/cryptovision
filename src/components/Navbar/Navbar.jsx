import React from 'react'
import styles from './Navbar.module.css'

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

function Navbar({ onToggleSidebar }) {
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
        <button id="search-btn" className={styles.iconButton} aria-label="Search">
          <SearchIcon />
        </button>

        <button id="theme-toggle" className={styles.iconButton} aria-label="Toggle theme">
          <SunIcon />
        </button>

        <button id="notifications-btn" className={styles.iconButton} aria-label="Notifications">
          <BellIcon />
          <span className={styles.notificationBadge} aria-hidden="true" />
        </button>

        <button id="profile-avatar" className={styles.avatar} aria-label="Profile">
          <span>MK</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar

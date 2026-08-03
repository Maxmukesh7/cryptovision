import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import styles from './UserProfile.module.css'

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

function UserProfile({
  userName = 'Mukesh Kumar',
  userEmail = 'mukesh@cryptovision.app',
  initials = 'MK',
  avatarUrl = null,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { theme, toggleTheme, addToast } = useApp()

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleAction = (action) => {
    setIsOpen(false)
    if (action === 'settings') {
      navigate('/settings')
    } else if (action === 'theme') {
      toggleTheme()
    } else if (action === 'logout') {
      addToast('Logged out successfully (Placeholder)', 'info')
    } else if (action === 'about') {
      addToast('CryptoVision v1.0.0 Pro Enterprise Edition', 'info')
    } else if (action === 'profile') {
      navigate('/settings')
    }
  }

  return (
    <div className={styles.profileWrapper} ref={menuRef}>
      <button
        id="profile-avatar"
        className={`${styles.triggerBtn} ${isOpen ? styles.triggerActive : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User Account Menu"
      >
        <div className={styles.avatarBox}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className={styles.avatarImg} />
          ) : (
            <span className={styles.initials}>{initials}</span>
          )}
          <span className={styles.statusDot} title="Online" />
        </div>

        <span className={styles.userName}>{userName}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="menu" aria-orientation="vertical">
          {/* User Header Info */}
          <div className={styles.menuHeader}>
            <div className={styles.headerAvatarBox}>
              <span className={styles.headerInitials}>{initials}</span>
            </div>
            <div className={styles.headerMeta}>
              <p className={styles.headerName}>{userName}</p>
              <p className={styles.headerEmail}>{userEmail}</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Menu Actions */}
          <div className={styles.menuList}>
            <button
              className={styles.menuItem}
              onClick={() => handleAction('profile')}
              role="menuitem"
            >
              <span className={styles.itemIcon}><UserIcon /></span>
              <span>Profile</span>
            </button>

            <button
              className={styles.menuItem}
              onClick={() => handleAction('settings')}
              role="menuitem"
            >
              <span className={styles.itemIcon}><SettingsIcon /></span>
              <span>Preferences</span>
            </button>

            <button
              className={styles.menuItem}
              onClick={() => handleAction('theme')}
              role="menuitem"
            >
              <span className={styles.itemIcon}>
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </span>
              <span>Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
            </button>

            <button
              className={styles.menuItem}
              onClick={() => handleAction('about')}
              role="menuitem"
            >
              <span className={styles.itemIcon}><InfoIcon /></span>
              <span>About</span>
            </button>

            <div className={styles.divider} />

            <button
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={() => handleAction('logout')}
              role="menuitem"
            >
              <span className={styles.itemIcon}><LogOutIcon /></span>
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(UserProfile)

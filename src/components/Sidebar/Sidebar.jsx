import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const StarNavIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const CompareNavIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const PortfolioIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
)

const navItems = [
  { id: 'nav-dashboard', to: '/', label: 'Dashboard', icon: <DashboardIcon />, end: true },
  { id: 'nav-watchlist', to: '/watchlist', label: 'Watchlist', icon: <StarNavIcon /> },
  { id: 'nav-compare', to: '/compare', label: 'Compare', icon: <CompareNavIcon /> },
  { id: 'nav-portfolio', to: '/portfolio', label: 'Portfolio', icon: <PortfolioIcon /> },
]

function Sidebar({ collapsed }) {
  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      aria-label="Main navigation"
    >
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map(({ id, to, label, icon, end }) => (
            <li key={id} className={styles.navItem}>
              <NavLink
                id={id}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{icon}</span>
                <span className={styles.navLabel}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <div className={styles.versionBadge}>
          <span className={styles.dot} />
          {!collapsed && <span className={styles.versionText}>v1.0.0 Phase 4</span>}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

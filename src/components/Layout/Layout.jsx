import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import styles from './Layout.module.css'

function Layout({ sidebarCollapsed, onToggleSidebar }) {
  return (
    <div className={styles.layout}>
      <Navbar onToggleSidebar={onToggleSidebar} />
      <div className={styles.body}>
        <Sidebar collapsed={sidebarCollapsed} />
        <main
          className={`${styles.main} ${sidebarCollapsed ? styles.mainExpanded : ''}`}
        >
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

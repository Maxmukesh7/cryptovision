import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import CoinDetails from './pages/CoinDetails/CoinDetails'
import NotFound from './pages/NotFound/NotFound'
import styles from './App.module.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev)

  return (
    <BrowserRouter>
      <div className={styles.appRoot}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={toggleSidebar}
              />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="coin/:id" element={<CoinDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

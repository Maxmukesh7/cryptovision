import React, { useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ToastContainer from './components/Toast/Toast'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import CoinDetails from './pages/CoinDetails/CoinDetails'
import NotFound from './pages/NotFound/NotFound'
import Loader from './components/Loader/Loader'
import styles from './App.module.css'

// Lazy Loading pages for code splitting & performance optimization
const Watchlist = lazy(() => import('./pages/Watchlist/Watchlist'))
const Compare = lazy(() => import('./pages/Compare/Compare'))
const Portfolio = lazy(() => import('./pages/Portfolio/Portfolio'))
const Settings = lazy(() => import('./pages/Settings/Settings'))

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)

  return (
    <AppProvider>
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
              <Route
                path="watchlist"
                element={
                  <Suspense fallback={<Loader size="lg" label="Loading Watchlist..." />}>
                    <Watchlist />
                  </Suspense>
                }
              />
              <Route
                path="compare"
                element={
                  <Suspense fallback={<Loader size="lg" label="Loading Comparison..." />}>
                    <Compare />
                  </Suspense>
                }
              />
              <Route
                path="portfolio"
                element={
                  <Suspense fallback={<Loader size="lg" label="Loading Portfolio..." />}>
                    <Portfolio />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<Loader size="lg" label="Loading Settings..." />}>
                    <Settings />
                  </Suspense>
                }
              />
              <Route path="coin/:id" element={<CoinDetails />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App

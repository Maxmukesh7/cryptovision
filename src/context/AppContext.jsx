import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getExchangeRates,
  FALLBACK_RATES,
  convertFromUsd,
  formatCurrencyVal,
  formatLargeCurrencyVal,
} from '../services/currencyService'

const AppContext = createContext()

const WATCHLIST_KEY = 'cv_watchlist'
const PORTFOLIO_KEY = 'cv_portfolio'
const SEARCH_HISTORY_KEY = 'cv_search_history'
const THEME_KEY = 'cv_theme'
const LAYOUT_KEY = 'cv_dashboard_layout'
const REFRESH_KEY = 'cv_refresh_interval'
const CURRENCY_KEY = 'cv_currency'

const DEFAULT_LAYOUT = {
  globalOverview: true,
  trendingCoins: true,
  marketSentiment: true,
  topMovers: true,
  marketCharts: true,
  marketTable: true,
  cryptoNews: true,
}

export function AppProvider({ children }) {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light'
    } catch {
      return 'light'
    }
  })

  // 2. Watchlist State
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_KEY)
      return saved ? JSON.parse(saved) : ['btc-bitcoin', 'eth-ethereum', 'sol-solana']
    } catch {
      return ['btc-bitcoin', 'eth-ethereum', 'sol-solana']
    }
  })

  // 3. Portfolio State
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const saved = localStorage.getItem(PORTFOLIO_KEY)
      return saved ? JSON.parse(saved) : [
        { coinId: 'btc-bitcoin', quantity: 0.5 },
        { coinId: 'eth-ethereum', quantity: 2.5 },
      ]
    } catch {
      return [
        { coinId: 'btc-bitcoin', quantity: 0.5 },
        { coinId: 'eth-ethereum', quantity: 2.5 },
      ]
    }
  })

  // 4. Search History State
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
      return saved ? JSON.parse(saved) : ['Bitcoin', 'Ethereum', 'SOL']
    } catch {
      return ['Bitcoin', 'Ethereum', 'SOL']
    }
  })

  // 5. Dashboard Layout Preferences State
  const [dashboardLayout, setDashboardLayout] = useState(() => {
    try {
      const saved = localStorage.getItem(LAYOUT_KEY)
      return saved ? { ...DEFAULT_LAYOUT, ...JSON.parse(saved) } : DEFAULT_LAYOUT
    } catch {
      return DEFAULT_LAYOUT
    }
  })

  // 6. Auto Refresh Interval State (in ms)
  const [refreshInterval, setRefreshInterval] = useState(() => {
    try {
      const saved = localStorage.getItem(REFRESH_KEY)
      return saved ? Number(saved) : 60000
    } catch {
      return 60000
    }
  })

  // 7. Default Currency State
  const [currency, setCurrencyState] = useState(() => {
    try {
      return localStorage.getItem(CURRENCY_KEY) || 'USD'
    } catch {
      return 'USD'
    }
  })

  // 8. Exchange Rates State
  const [rates, setRates] = useState(FALLBACK_RATES)

  // 9. Toasts State
  const [toasts, setToasts] = useState([])

  // Fetch Live Exchange Rates on Mount
  useEffect(() => {
    let isMounted = true
    getExchangeRates().then((liveRates) => {
      if (isMounted && liveRates) {
        setRates(liveRates)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Apply Theme Attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
    } catch {
      // ignore
    }
  }, [watchlist])

  useEffect(() => {
    try {
      localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio))
    } catch {
      // ignore
    }
  }, [portfolio])

  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory))
    } catch {
      // ignore
    }
  }, [searchHistory])

  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(dashboardLayout))
    } catch {
      // ignore
    }
  }, [dashboardLayout])

  useEffect(() => {
    try {
      localStorage.setItem(REFRESH_KEY, String(refreshInterval))
    } catch {
      // ignore
    }
  }, [refreshInterval])

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_KEY, currency)
    } catch {
      // ignore
    }
  }, [currency])

  // Toast Helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Currency Change Handler
  const setCurrency = useCallback((newCurr) => {
    setCurrencyState(newCurr)
    addToast(`Display currency changed to ${newCurr}`, 'info')
  }, [addToast])

  // Theme Actions
  const toggleTheme = useCallback(() => {
    let nextTheme = 'light'
    setTheme((prev) => {
      nextTheme = prev === 'light' ? 'dark' : 'light'
      return nextTheme
    })
    addToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info')
  }, [addToast])

  // Watchlist Actions
  const toggleWatchlist = useCallback((coinId, coinName) => {
    let isAlreadySaved = false
    setWatchlist((prev) => {
      isAlreadySaved = prev.includes(coinId)
      return isAlreadySaved ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    })
    if (isAlreadySaved) {
      addToast(`Removed ${coinName || coinId} from Watchlist`, 'info')
    } else {
      addToast(`Added ${coinName || coinId} to Watchlist`, 'success')
    }
  }, [addToast])

  const isInWatchlist = useCallback((coinId) => {
    return watchlist.includes(coinId)
  }, [watchlist])

  // Portfolio Actions
  const addPortfolioAsset = useCallback((coinId, quantity, coinName) => {
    setPortfolio((prev) => {
      const existing = prev.find((item) => item.coinId === coinId)
      if (existing) {
        return prev.map((item) =>
          item.coinId === coinId
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        )
      }
      return [...prev, { coinId, quantity: Number(quantity) }]
    })
    addToast(`Added ${quantity} ${coinName || coinId} to Portfolio`, 'success')
  }, [addToast])

  const removePortfolioAsset = useCallback((coinId, coinName) => {
    setPortfolio((prev) => prev.filter((item) => item.coinId !== coinId))
    addToast(`Removed ${coinName || coinId} from Portfolio`, 'info')
  }, [addToast])

  // Dashboard Layout Actions
  const toggleLayoutSection = useCallback((sectionKey) => {
    setDashboardLayout((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }, [])

  // Search History Actions
  const addSearchQuery = useCallback((query) => {
    if (!query || !query.trim()) return
    const trimmed = query.trim()
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())
      return [trimmed, ...filtered].slice(0, 6)
    })
  }, [])

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  // Export Data Helper (CSV / JSON)
  const exportData = useCallback((data, filename, format = 'json') => {
    try {
      let content, mimeType, ext
      if (format === 'csv') {
        mimeType = 'text/csv;charset=utf-8;'
        ext = 'csv'
        if (Array.isArray(data) && data.length > 0) {
          const keys = Object.keys(data[0])
          const header = keys.join(',')
          const rows = data.map((obj) =>
            keys.map((k) => JSON.stringify(obj[k] ?? '')).join(',')
          )
          content = [header, ...rows].join('\n')
        } else {
          content = JSON.stringify(data)
        }
      } else {
        mimeType = 'application/json;charset=utf-8;'
        ext = 'json'
        content = JSON.stringify(data, null, 2)
      }

      const blob = new Blob([content], { type: mimeType })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${filename}.${ext}`
      link.click()
      URL.revokeObjectURL(link.href)
      addToast(`Exported ${filename}.${ext} successfully`, 'success')
    } catch {
      addToast('Failed to export data', 'info')
    }
  }, [addToast])

  // Reset Preferences
  const resetPreferences = useCallback(() => {
    setTheme('light')
    setDashboardLayout(DEFAULT_LAYOUT)
    setRefreshInterval(60000)
    setCurrencyState('USD')
    setSearchHistory([])
    addToast('Preferences reset to default values', 'success')
  }, [addToast])

  // Formatting helpers with current rates and currency
  const formatCurrency = useCallback((usdAmount, maxDigits = 2) => {
    return formatCurrencyVal(usdAmount, currency, rates, maxDigits)
  }, [currency, rates])

  const formatLargeNumber = useCallback((usdAmount) => {
    return formatLargeCurrencyVal(usdAmount, currency, rates)
  }, [currency, rates])

  const convertUsd = useCallback((usdAmount) => {
    return convertFromUsd(usdAmount, currency, rates)
  }, [currency, rates])

  const value = {
    theme,
    toggleTheme,
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    portfolio,
    addPortfolioAsset,
    removePortfolioAsset,
    searchHistory,
    addSearchQuery,
    clearSearchHistory,
    dashboardLayout,
    toggleLayoutSection,
    refreshInterval,
    setRefreshInterval,
    currency,
    setCurrency,
    rates,
    formatCurrency,
    formatLargeNumber,
    convertUsd,
    exportData,
    resetPreferences,
    toasts,
    addToast,
    removeToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

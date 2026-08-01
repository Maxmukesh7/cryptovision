import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext()

const WATCHLIST_KEY = 'cv_watchlist'
const PORTFOLIO_KEY = 'cv_portfolio'
const SEARCH_HISTORY_KEY = 'cv_search_history'

export function AppProvider({ children }) {
  // 1. Watchlist state
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_KEY)
      return saved ? JSON.parse(saved) : ['btc-bitcoin', 'eth-ethereum', 'sol-solana']
    } catch {
      return ['btc-bitcoin', 'eth-ethereum', 'sol-solana']
    }
  })

  // 2. Portfolio state
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

  // 3. Search History state
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
      return saved ? JSON.parse(saved) : ['Bitcoin', 'Ethereum', 'SOL']
    } catch {
      return ['Bitcoin', 'Ethereum', 'SOL']
    }
  })

  // 4. Toast notifications
  const [toasts, setToasts] = useState([])

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

  // Watchlist Actions
  const toggleWatchlist = useCallback((coinId, coinName) => {
    setWatchlist((prev) => {
      const isAlreadySaved = prev.includes(coinId)
      if (isAlreadySaved) {
        addToast(`Removed ${coinName || coinId} from Watchlist`, 'info')
        return prev.filter((id) => id !== coinId)
      } else {
        addToast(`Added ${coinName || coinId} to Watchlist`, 'success')
        return [...prev, coinId]
      }
    })
  }, [addToast])

  const isInWatchlist = useCallback((coinId) => {
    return watchlist.includes(coinId)
  }, [watchlist])

  // Portfolio Actions
  const addPortfolioAsset = useCallback((coinId, quantity, coinName) => {
    setPortfolio((prev) => {
      const existing = prev.find((item) => item.coinId === coinId)
      let updated
      if (existing) {
        updated = prev.map((item) =>
          item.coinId === coinId
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        )
      } else {
        updated = [...prev, { coinId, quantity: Number(quantity) }]
      }
      addToast(`Added ${quantity} ${coinName || coinId} to Portfolio`, 'success')
      return updated
    })
  }, [addToast])

  const removePortfolioAsset = useCallback((coinId, coinName) => {
    setPortfolio((prev) => {
      addToast(`Removed ${coinName || coinId} from Portfolio`, 'info')
      return prev.filter((item) => item.coinId !== coinId)
    })
  }, [addToast])

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

  const value = {
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    portfolio,
    addPortfolioAsset,
    removePortfolioAsset,
    searchHistory,
    addSearchQuery,
    clearSearchHistory,
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

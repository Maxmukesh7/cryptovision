import { useState, useEffect, useCallback } from 'react'
import { fetchTopCoins } from '../services/cryptoApi'

/**
 * useCoins — fetches the top 100 cryptocurrencies from CoinPaprika with client-side caching.
 *
 * @returns {{ coins: Array, loading: boolean, error: string|null, refetch: Function }}
 */
function useCoins() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTopCoins(forceRefresh)
      setCoins(data)
    } catch (err) {
      const message =
        err.response?.status === 429 || err.response?.status === 402
          ? 'Rate limit reached. Please wait a moment and try again.'
          : err.message || 'Failed to load cryptocurrency data.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(false)
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  return { coins, loading, error, refetch }
}

export default useCoins

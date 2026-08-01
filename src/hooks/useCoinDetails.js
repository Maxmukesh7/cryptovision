import { useState, useEffect, useCallback } from 'react'
import { getCoinDetails, getCoinMarketChart } from '../services/cryptoApi'

/**
 * useCoinDetails — fetches full coin data and 7-day price chart for a given coin id from CoinPaprika.
 *
 * @param {string} coinId - CoinPaprika coin id (e.g. "btc-bitcoin")
 * @returns {{
 *   coin: Object|null,
 *   chartData: { labels: string[], prices: number[] }|null,
 *   loading: boolean,
 *   error: string|null,
 *   refetch: Function
 * }}
 */
function useCoinDetails(coinId) {
  const [coin, setCoin] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!coinId) return
    setLoading(true)
    setError(null)

    try {
      const [details, marketChart] = await Promise.all([
        getCoinDetails(coinId),
        getCoinMarketChart(coinId),
      ])

      setCoin(details)

      if (marketChart && marketChart.prices) {
        const labels = marketChart.prices.map(([timestamp]) => timestamp)
        const prices = marketChart.prices.map(([, price]) => price)
        setChartData({ labels, prices })
      }
    } catch (err) {
      const message =
        err.response?.status === 404
          ? `Coin "${coinId}" was not found. Check the URL and try again.`
          : err.response?.status === 429 || err.response?.status === 402
          ? 'Rate limit reached. Please wait a moment and try again.'
          : err.message || 'Failed to load coin data.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [coinId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { coin, chartData, loading, error, refetch: fetchData }
}

export default useCoinDetails

import React, { useMemo } from 'react'
import useCoins from '../../hooks/useCoins'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import CoinTable from '../../components/CoinTable/CoinTable'
import Loader from '../../components/Loader/Loader'
import ErrorState from '../../components/ErrorState/ErrorState'
import { formatLargeNumber, formatPercent, average } from '../../utils/formatters'
import styles from './Dashboard.module.css'

const CoinsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
)

const TrophyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="8 21 12 17 16 21" />
    <path d="M7 4H17L17 11C17 14.3 14.3 17 11 17H13C9.7 17 7 14.3 7 11Z" />
    <path d="M7 8H3v2a4 4 0 0 0 4 4" />
    <path d="M17 8h4v2a4 4 0 0 1-4 4" />
  </svg>
)

const PriceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const TrendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

function Dashboard() {
  const { coins, loading, error, refetch } = useCoins()

  const stats = useMemo(() => {
    if (!coins.length) return null

    const totalCoins = coins.length

    const topMarketCap = coins.reduce((prev, cur) =>
      cur.market_cap > prev.market_cap ? cur : prev, coins[0])

    const topPrice = coins.reduce((prev, cur) =>
      cur.current_price > prev.current_price ? cur : prev, coins[0])

    const changes = coins
      .map(c => c.price_change_percentage_24h)
      .filter(v => v !== null && v !== undefined)
    const avgChange = average(changes)

    return { totalCoins, topMarketCap, topPrice, avgChange }
  }, [coins])

  const cards = stats
    ? [
        {
          id: 'card-total-coins',
          title: 'Total Coins',
          subtitle: 'Tracked assets',
          value: stats.totalCoins.toLocaleString(),
          icon: <CoinsIcon />,
          accentColor: '#7c3aed',
        },
        {
          id: 'card-top-market-cap',
          title: 'Top Market Cap',
          subtitle: stats.topMarketCap.name,
          value: formatLargeNumber(stats.topMarketCap.market_cap),
          trend: stats.topMarketCap.price_change_percentage_24h >= 0 ? 'up' : 'down',
          trendValue: formatPercent(stats.topMarketCap.price_change_percentage_24h),
          icon: <TrophyIcon />,
          accentColor: '#f59e0b',
        },
        {
          id: 'card-highest-price',
          title: 'Highest Price',
          subtitle: stats.topPrice.name,
          value: `$${stats.topPrice.current_price.toLocaleString()}`,
          trend: stats.topPrice.price_change_percentage_24h >= 0 ? 'up' : 'down',
          trendValue: formatPercent(stats.topPrice.price_change_percentage_24h),
          icon: <PriceIcon />,
          accentColor: '#1a6fff',
        },
        {
          id: 'card-avg-change',
          title: 'Avg 24H Change',
          subtitle: 'Across all coins',
          value: formatPercent(stats.avgChange),
          trend: stats.avgChange >= 0 ? 'up' : 'down',
          trendValue: stats.avgChange >= 0 ? 'Bullish' : 'Bearish',
          icon: <TrendIcon />,
          accentColor: stats.avgChange >= 0 ? '#10b981' : '#ef4444',
        },
      ]
    : []

  return (
    <section className={styles.dashboard} aria-labelledby="dashboard-heading">
      <header className={styles.pageHeader}>
        <div>
          <h1 id="dashboard-heading" className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Live cryptocurrency market data</p>
        </div>
        <div className={styles.dateBadge}>
          <span className={styles.liveIndicator} />
          <span>Live Data</span>
        </div>
      </header>

      {loading && (
        <div className={styles.loaderWrapper}>
          <Loader size="lg" label="Fetching market data..." />
        </div>
      )}

      {error && !loading && (
        <ErrorState message={error} onRetry={refetch} />
      )}

      {!loading && !error && stats && (
        <>
          <div className={styles.cardsGrid}>
            {cards.map(card => (
              <DashboardCard key={card.id} {...card} />
            ))}
          </div>

          <div className={styles.tableSection}>
            <div className={styles.tableSectionHeader}>
              <h2 className={styles.sectionTitle}>Top 100 Cryptocurrencies</h2>
              <p className={styles.sectionSubtitle}>
                Ranked by market capitalization
              </p>
            </div>
            <CoinTable coins={coins} />
          </div>
        </>
      )}
    </section>
  )
}

export default Dashboard

import React from 'react'
import { useApp } from '../../context/AppContext'
import { formatPercent, average, getChangeDirection } from '../../utils/formatters'
import styles from './DashboardStats.module.css'

const ActivityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

function DashboardStats({ coins = [] }) {
  const { formatCurrency, formatLargeNumber, currency } = useApp()

  if (!coins || coins.length === 0) return null

  // Calculate statistics
  const highestPriceCoin = coins.reduce(
    (prev, cur) => ((cur.current_price || 0) > (prev.current_price || 0) ? cur : prev),
    coins[0]
  )
  const lowestPriceCoin = coins.reduce(
    (prev, cur) => ((cur.current_price || 0) < (prev.current_price || 0) ? cur : prev),
    coins[0]
  )

  const avgCap = average(coins.map((c) => c.market_cap || 0))
  const avgVol = average(coins.map((c) => c.total_volume || 0))
  const avgChg = average(coins.map((c) => c.price_change_percentage_24h || 0))

  const positiveCount = coins.filter((c) => (c.price_change_percentage_24h || 0) > 0).length
  const negativeCount = coins.filter((c) => (c.price_change_percentage_24h || 0) < 0).length

  const avgDir = getChangeDirection(avgChg)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBadge}>
          <ActivityIcon />
        </div>
        <div>
          <h2 className={styles.title}>Market Statistics &amp; Averages ({currency})</h2>
          <p className={styles.subtitle}>Aggregated statistical metrics for the top 100 cryptocurrencies</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Highest Price */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Highest Price Coin</span>
          <span className={styles.statMain}>{highestPriceCoin.name} ({highestPriceCoin.symbol?.toUpperCase()})</span>
          <span className={styles.statVal}>{formatCurrency(highestPriceCoin.current_price, 2)}</span>
        </div>

        {/* Lowest Price */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Lowest Price Coin</span>
          <span className={styles.statMain}>{lowestPriceCoin.name} ({lowestPriceCoin.symbol?.toUpperCase()})</span>
          <span className={styles.statVal}>{formatCurrency(lowestPriceCoin.current_price, 4)}</span>
        </div>

        {/* Average Market Cap */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Average Market Cap</span>
          <span className={styles.statVal}>{formatLargeNumber(avgCap)}</span>
          <span className={styles.statSub}>Across {coins.length} coins</span>
        </div>

        {/* Average Volume */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Average Trading Volume</span>
          <span className={styles.statVal}>{formatLargeNumber(avgVol)}</span>
          <span className={styles.statSub}>24h Average Volume</span>
        </div>

        {/* Average 24h Change */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Average 24H Change</span>
          <span className={`${styles.statVal} ${styles[avgDir]}`}>{formatPercent(avgChg)}</span>
          <span className={styles.statSub}>Across all listed assets</span>
        </div>

        {/* Market Breadth (Bullish / Bearish count) */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Market Ratio (Gainers / Losers)</span>
          <div className={styles.ratioRow}>
            <span className={styles.greenText}>▲ {positiveCount} Gainers</span>
            <span className={styles.redText}>▼ {negativeCount} Losers</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DashboardStats)

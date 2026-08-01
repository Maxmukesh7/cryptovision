import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatPercent, getChangeDirection } from '../../utils/formatters'
import styles from './TrendingCoins.module.css'

const FireIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.5-1.5-2.5-2.5-4-1.5 2.5-2.5 3-2.5 4z" />
    <path d="M12 2c1.78 4.22 4.14 5.37 5.5 8.5A7.5 7.5 0 1 1 5 11c0-2.3 1.5-4.5 4-7.5 0 2.5 1.5 3 3 5.5z" />
  </svg>
)

function TrendingCoins({ coins = [] }) {
  const navigate = useNavigate()

  if (!coins || coins.length === 0) return null

  // Sort by combination of 24h volume & gain for trending rank
  const trendingList = [...coins]
    .sort((a, b) => (b.total_volume || 0) * Math.abs(b.price_change_percentage_24h || 1) - (a.total_volume || 0) * Math.abs(a.price_change_percentage_24h || 1))
    .slice(0, 10)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.fireBadge}>
            <FireIcon />
          </div>
          <div>
            <h2 className={styles.title}>Trending Cryptocurrencies</h2>
            <p className={styles.subtitle}>Top 10 highest market momentum assets today</p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {trendingList.map((coin, index) => {
          const dir = getChangeDirection(coin.price_change_percentage_24h)
          return (
            <div
              key={`trending-${coin.id}`}
              className={styles.card}
              onClick={() => navigate(`/coin/${coin.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/coin/${coin.id}`)
                }
              }}
            >
              <div className={styles.rankBadge}>#{index + 1}</div>
              <div className={styles.coinMeta}>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className={styles.logo}
                  width={36}
                  height={36}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className={styles.names}>
                  <span className={styles.name}>{coin.name}</span>
                  <span className={styles.symbol}>{coin.symbol?.toUpperCase()}</span>
                </div>
              </div>

              <div className={styles.priceMeta}>
                <span className={styles.price}>{formatCurrency(coin.current_price)}</span>
                <span className={`${styles.badge} ${styles[dir]}`}>
                  {formatPercent(coin.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(TrendingCoins)

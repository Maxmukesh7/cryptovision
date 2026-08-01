import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatPercent, getChangeDirection } from '../../utils/formatters'
import styles from './TopMovers.module.css'

const TrendingUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const TrendingDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
)

function MoverRow({ coin, isGainer }) {
  const navigate = useNavigate()
  const { formatCurrency } = useApp()
  const direction = getChangeDirection(coin.price_change_percentage_24h)

  return (
    <div
      className={styles.moverRow}
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
      <div className={styles.coinMeta}>
        <img
          src={coin.image}
          alt={`${coin.name} logo`}
          className={styles.coinLogo}
          width={28}
          height={28}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className={styles.coinNames}>
          <span className={styles.coinName}>{coin.name}</span>
          <span className={styles.coinSymbol}>{coin.symbol?.toUpperCase()}</span>
        </div>
      </div>

      <div className={styles.coinPriceBlock}>
        <span className={styles.coinPrice}>{formatCurrency(coin.current_price)}</span>
        <span className={`${styles.changeBadge} ${styles[direction]}`}>
          {isGainer ? '↑ ' : '↓ '}
          {formatPercent(coin.price_change_percentage_24h)}
        </span>
      </div>
    </div>
  )
}

function TopMovers({ gainers = [], losers = [] }) {
  return (
    <div className={styles.moversGrid}>
      <div className={`${styles.moversCard} ${styles.gainersCard}`}>
        <div className={styles.cardHeader}>
          <div className={`${styles.iconWrapper} ${styles.gainerIcon}`}>
            <TrendingUpIcon />
          </div>
          <div>
            <h3 className={styles.cardTitle}>Top 5 Gainers (24H)</h3>
            <p className={styles.cardSubtitle}>Highest price percentage increase</p>
          </div>
        </div>
        <div className={styles.moverList}>
          {gainers.slice(0, 5).map((coin) => (
            <MoverRow key={`gainer-${coin.id}`} coin={coin} isGainer={true} />
          ))}
        </div>
      </div>

      <div className={`${styles.moversCard} ${styles.losersCard}`}>
        <div className={styles.cardHeader}>
          <div className={`${styles.iconWrapper} ${styles.loserIcon}`}>
            <TrendingDownIcon />
          </div>
          <div>
            <h3 className={styles.cardTitle}>Top 5 Losers (24H)</h3>
            <p className={styles.cardSubtitle}>Highest price percentage decrease</p>
          </div>
        </div>
        <div className={styles.moverList}>
          {losers.slice(0, 5).map((coin) => (
            <MoverRow key={`loser-${coin.id}`} coin={coin} isGainer={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(TopMovers)

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import useCoinDetails from '../../hooks/useCoinDetails'
import PriceChart from '../../components/PriceChart/PriceChart'
import Loader from '../../components/Loader/Loader'
import ErrorState from '../../components/ErrorState/ErrorState'
import {
  formatCurrency,
  formatLargeNumber,
  formatPercent,
  formatNumber,
  formatDateTime,
  getChangeDirection,
} from '../../utils/formatters'
import styles from './CoinDetails.module.css'

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const StarIcon = ({ filled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? '#f59e0b' : 'none'}
    stroke={filled ? '#f59e0b' : 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

function StatCard({ id, label, value, subValue, direction }) {
  return (
    <div id={id} className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      {subValue !== undefined && subValue !== null && (
        <p className={`${styles.statSub} ${direction ? styles[direction] : ''}`}>
          {subValue}
        </p>
      )}
    </div>
  )
}

function CoinDetails() {
  const { id } = useParams()
  const { coin, chartData, loading, error, refetch } = useCoinDetails(id)
  const { isInWatchlist, toggleWatchlist } = useApp()

  if (loading) {
    return (
      <div className={styles.centerState}>
        <Loader size="lg" label="Loading coin data..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.centerState}>
        <Link id="back-to-dashboard" to="/" className={styles.backButton}>
          <ArrowLeftIcon />
          <span>Back to Dashboard</span>
        </Link>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    )
  }

  if (!coin) return null

  const isFavorite = isInWatchlist(coin.id)
  const market = coin.market_data
  const change24h = market?.price_change_percentage_24h
  const changeDirection = getChangeDirection(change24h)
  const isPositive = changeDirection === 'positive'

  const statCards = [
    {
      id: 'stat-price',
      label: 'Current Price',
      value: formatCurrency(market?.current_price?.usd, 6),
      subValue: formatPercent(change24h),
      direction: changeDirection,
    },
    {
      id: 'stat-market-cap',
      label: 'Market Cap',
      value: formatLargeNumber(market?.market_cap?.usd),
      subValue: formatPercent(market?.market_cap_change_percentage_24h),
      direction: getChangeDirection(market?.market_cap_change_percentage_24h),
    },
    {
      id: 'stat-volume',
      label: '24H Volume',
      value: formatLargeNumber(market?.total_volume?.usd),
    },
    {
      id: 'stat-24h-high',
      label: '24H High',
      value: formatCurrency(market?.high_24h?.usd),
    },
    {
      id: 'stat-24h-low',
      label: '24H Low',
      value: formatCurrency(market?.low_24h?.usd),
    },
    {
      id: 'stat-rank',
      label: 'Market Rank',
      value: coin.market_cap_rank ? `#${coin.market_cap_rank}` : '—',
    },
    {
      id: 'stat-circulating',
      label: 'Circulating Supply',
      value: market?.circulating_supply
        ? `${formatNumber(Math.round(market.circulating_supply))} ${coin.symbol?.toUpperCase()}`
        : '—',
    },
    {
      id: 'stat-total-supply',
      label: 'Total Supply',
      value: market?.total_supply
        ? `${formatNumber(Math.round(market.total_supply))} ${coin.symbol?.toUpperCase()}`
        : '∞',
    },
    {
      id: 'stat-ath',
      label: 'All Time High',
      value: formatCurrency(market?.ath?.usd),
      subValue: formatPercent(market?.ath_change_percentage?.usd),
      direction: getChangeDirection(market?.ath_change_percentage?.usd),
    },
    {
      id: 'stat-atl',
      label: 'All Time Low',
      value: formatCurrency(market?.atl?.usd, 6),
      subValue: formatPercent(market?.atl_change_percentage?.usd),
      direction: getChangeDirection(market?.atl_change_percentage?.usd),
    },
    {
      id: 'stat-fdv',
      label: 'Fully Diluted Valuation',
      value: formatLargeNumber(market?.fully_diluted_valuation?.usd),
    },
    {
      id: 'stat-updated',
      label: 'Last Updated',
      value: formatDateTime(market?.last_updated),
    },
  ]

  return (
    <section className={styles.coinDetails} aria-labelledby="coin-heading">
      <header className={styles.pageHeader}>
        <Link id="back-to-dashboard" to="/" className={styles.backButton}>
          <ArrowLeftIcon />
          <span>Back to Dashboard</span>
        </Link>

        <button
          className={styles.watchlistBtn}
          onClick={() => toggleWatchlist(coin.id, coin.name)}
          title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <StarIcon filled={isFavorite} />
          <span>{isFavorite ? 'In Watchlist' : 'Add to Watchlist'}</span>
        </button>
      </header>

      {/* ── Hero ── */}
      <div className={styles.coinHero}>
        <div className={styles.coinIdentity}>
          {coin.image?.large ? (
            <img
              src={coin.image.large}
              alt={`${coin.name} logo`}
              className={styles.coinLogoImg}
              width={64}
              height={64}
            />
          ) : (
            <div className={styles.coinLogo} aria-label={`${coin.name} logo`}>
              <span>{coin.symbol?.slice(0, 2).toUpperCase()}</span>
            </div>
          )}

          <div className={styles.coinMeta}>
            <h1 id="coin-heading" className={styles.coinName}>{coin.name}</h1>
            <div className={styles.coinBadges}>
              <span className={styles.badge}>{coin.symbol?.toUpperCase()}</span>
              {coin.market_cap_rank && (
                <span className={styles.badge}>#{coin.market_cap_rank}</span>
              )}
              {coin.links?.homepage?.[0] && (
                <a
                  href={coin.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.badge} ${styles.badgeLink}`}
                  id="coin-website-link"
                >
                  Website <ExternalLinkIcon />
                </a>
              )}
              <span className={`${styles.badge} ${styles.badgeLive}`}>● Live</span>
            </div>
          </div>
        </div>

        <div className={styles.heroPriceBlock}>
          <p className={styles.currentPrice} id="current-price">
            {formatCurrency(market?.current_price?.usd, 6)}
          </p>
          <div className={styles.priceChange}>
            <span className={`${styles.changeValue} ${styles[changeDirection]}`}>
              {isPositive ? '↑' : '↓'} {formatPercent(change24h)}
            </span>
            <span className={styles.changePeriod}>24h</span>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* ── Price Chart ── */}
      <div className={styles.chartSection}>
        <div className={styles.chartCard}>
          <div className={styles.chartCardHeader}>
            <div>
              <h2 className={styles.chartTitle}>7-Day Price Chart</h2>
              <p className={styles.chartSubtitle}>USD — Last 7 days</p>
            </div>
            <div className={styles.chartBadge}>
              <span className={styles.chartBadgeDot} />
              Live
            </div>
          </div>

          {chartData ? (
            <PriceChart
              labels={chartData.labels}
              prices={chartData.prices}
              coinName={coin.name}
            />
          ) : (
            <div className={styles.chartLoader}>
              <Loader size="sm" label="Loading chart..." />
            </div>
          )}
        </div>
      </div>

      {/* ── About ── */}
      {coin.description?.en && (
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>About {coin.name}</h2>
            <p
              className={styles.infoText}
              dangerouslySetInnerHTML={{
                __html: coin.description.en.split('. ').slice(0, 5).join('. ') + '.',
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default React.memo(CoinDetails)

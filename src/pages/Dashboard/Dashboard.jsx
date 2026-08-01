import React, { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import useCoins from '../../hooks/useCoins'
import { useAutoRefresh } from '../../hooks/useAutoRefresh'
import GlobalOverview from '../../components/GlobalOverview/GlobalOverview'
import TrendingCoins from '../../components/TrendingCoins/TrendingCoins'
import MarketSentiment from '../../components/MarketSentiment/MarketSentiment'
import CryptoNews from '../../components/CryptoNews/CryptoNews'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import TopMovers from '../../components/TopMovers/TopMovers'
import DashboardCharts from '../../components/DashboardCharts/DashboardCharts'
import CoinTable from '../../components/CoinTable/CoinTable'
import DashboardCustomizer from '../../components/DashboardCustomizer/DashboardCustomizer'
import ErrorState from '../../components/ErrorState/ErrorState'
import {
  SkeletonCard,
  SkeletonTable,
  SkeletonMovers,
  SkeletonChart,
} from '../../components/Skeleton/Skeleton'
import { formatLargeNumber, formatPercent, formatCurrency } from '../../utils/formatters'
import styles from './Dashboard.module.css'

const CoinsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
)

const MarketCapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const VolumeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20v-6" />
  </svg>
)

const DominanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 10 10h-10z" />
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const TrendingDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
)

const RefreshIcon = ({ isSpinning }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={isSpinning ? styles.spinning : ''}
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

function Dashboard() {
  const { coins = [], loading, error, refetch } = useCoins()
  const { dashboardLayout, refreshInterval } = useApp()

  // Auto Refresh based on user setting
  useAutoRefresh(refetch, refreshInterval)

  // Calculate 6 Top Analytics Cards & Movers with useMemo
  const { cards, gainers, losers } = useMemo(() => {
    if (!coins || coins.length === 0) {
      return { cards: [], gainers: [], losers: [] }
    }

    const totalCoins = coins.length
    const totalMarketCap = coins.reduce((acc, c) => acc + (c.market_cap || 0), 0)
    const totalVolume = coins.reduce((acc, c) => acc + (c.total_volume || 0), 0)

    const btcCoin = coins.find((c) => c.symbol?.toLowerCase() === 'btc')
    const btcMarketCap = btcCoin?.market_cap || 0
    const btcDominance = totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0

    const sortedByChange = [...coins].sort(
      (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    )

    const topGainer = sortedByChange[0]
    const topLoser = sortedByChange[sortedByChange.length - 1]

    const topGainersList = sortedByChange.filter((c) => (c.price_change_percentage_24h || 0) > 0)
    const topLosersList = [...sortedByChange]
      .reverse()
      .filter((c) => (c.price_change_percentage_24h || 0) < 0)

    const cardsData = [
      {
        id: 'card-total-coins',
        title: 'Total Cryptocurrencies',
        subtitle: 'Listed assets',
        value: totalCoins.toLocaleString(),
        icon: <CoinsIcon />,
        accentColor: '#7c3aed',
      },
      {
        id: 'card-total-market-cap',
        title: 'Total Market Cap',
        subtitle: 'Global crypto cap',
        value: formatLargeNumber(totalMarketCap),
        icon: <MarketCapIcon />,
        accentColor: '#1a6fff',
      },
      {
        id: 'card-total-volume',
        title: 'Total 24H Volume',
        subtitle: 'Global 24h trading volume',
        value: formatLargeNumber(totalVolume),
        icon: <VolumeIcon />,
        accentColor: '#06b6d4',
      },
      {
        id: 'card-btc-dominance',
        title: 'Bitcoin Dominance',
        subtitle: 'BTC market share',
        value: `${btcDominance.toFixed(1)}%`,
        icon: <DominanceIcon />,
        accentColor: '#f59e0b',
      },
      {
        id: 'card-top-gainer',
        title: 'Top Gainer (24H)',
        subtitle: topGainer ? `${topGainer.name} (${topGainer.symbol?.toUpperCase()})` : '—',
        value: topGainer ? formatPercent(topGainer.price_change_percentage_24h) : '—',
        trend: 'up',
        trendValue: topGainer ? formatCurrency(topGainer.current_price) : '',
        icon: <TrendingUpIcon />,
        accentColor: '#10b981',
      },
      {
        id: 'card-top-loser',
        title: 'Top Loser (24H)',
        subtitle: topLoser ? `${topLoser.name} (${topLoser.symbol?.toUpperCase()})` : '—',
        value: topLoser ? formatPercent(topLoser.price_change_percentage_24h) : '—',
        trend: 'down',
        trendValue: topLoser ? formatCurrency(topLoser.current_price) : '',
        icon: <TrendingDownIcon />,
        accentColor: '#ef4444',
      },
    ]

    return {
      cards: cardsData,
      gainers: topGainersList,
      losers: topLosersList,
    }
  }, [coins])

  return (
    <section className={styles.dashboard} aria-labelledby="dashboard-heading">
      {/* ── Page Header ── */}
      <header className={styles.pageHeader}>
        <div>
          <h1 id="dashboard-heading" className={styles.pageTitle}>Cryptocurrency Market Analytics</h1>
          <p className={styles.pageSubtitle}>Real-time global metrics, trending coins &amp; market intelligence</p>
        </div>
        <div className={styles.headerActions}>
          <DashboardCustomizer />
          <button
            id="refresh-data-btn"
            className={styles.refreshButton}
            onClick={refetch}
            disabled={loading}
            aria-label="Refresh market data"
          >
            <RefreshIcon isSpinning={loading} />
            <span>Refresh</span>
          </button>
          <div className={styles.dateBadge}>
            <span className={styles.liveIndicator} />
            <span>{refreshInterval ? `Auto-Refresh ${refreshInterval / 1000}s` : 'Live Data'}</span>
          </div>
        </div>
      </header>

      {/* ── Initial Skeleton Loading State ── */}
      {loading && coins.length === 0 && (
        <div className={styles.skeletonGrid}>
          <div className={styles.cards6Grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <SkeletonMovers />
          <SkeletonChart />
          <SkeletonTable />
        </div>
      )}

      {/* ── Error State (Only if no coins available) ── */}
      {error && !loading && coins.length === 0 && (
        <ErrorState message={error} onRetry={refetch} />
      )}

      {/* ── Main Content ── */}
      {coins.length > 0 && (
        <>
          {/* 1. Global Market Overview Section */}
          {dashboardLayout.globalOverview && <GlobalOverview coins={coins} />}

          {/* 2. Trending Coins Section */}
          {dashboardLayout.trendingCoins && <TrendingCoins coins={coins} />}

          {/* 3. Market Sentiment & Quick Highlights Widgets */}
          {dashboardLayout.marketSentiment && <MarketSentiment coins={coins} />}

          {/* 4. Top Gainers & Top Losers */}
          {dashboardLayout.topMovers && <TopMovers gainers={gainers} losers={losers} />}

          {/* 5. Market Analytics Charts (Bar, Doughnut, Line) */}
          {dashboardLayout.marketCharts && <DashboardCharts coins={coins} />}

          {/* 6. Cryptocurrency Market Table */}
          {dashboardLayout.marketTable && (
            <div className={styles.tableSection}>
              <div className={styles.tableSectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Cryptocurrency Market Rankings</h2>
                  <p className={styles.sectionSubtitle}>
                    Top assets ranked by market capitalization and 24h volume
                  </p>
                </div>
              </div>
              <CoinTable coins={coins} />
            </div>
          )}

          {/* 7. Latest Crypto News Section */}
          {dashboardLayout.cryptoNews && <CryptoNews />}
        </>
      )}
    </section>
  )
}

export default Dashboard

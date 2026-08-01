import React from 'react'
import { useApp } from '../../context/AppContext'
import { formatPercent, getChangeDirection } from '../../utils/formatters'
import styles from './GlobalOverview.module.css'

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const BarChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const BtcIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.5 8h4a2 2 0 0 1 0 4h-4zm0 4h4.5a2 2 0 0 1 0 4H9.5z" />
  </svg>
)

const EthIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="12 2 19 12 12 16 5 12 12 2" />
    <polygon points="12 16 19 12 12 22 5 12 12 16" />
  </svg>
)

const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)

const ExchangeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
)

function GlobalOverview({ coins = [] }) {
  const { formatLargeNumber, currency } = useApp()

  if (!coins || coins.length === 0) return null

  const totalMarketCap = coins.reduce((acc, c) => acc + (c.market_cap || 0), 0)
  const totalVolume = coins.reduce((acc, c) => acc + (c.total_volume || 0), 0)

  const btcCoin = coins.find((c) => c.symbol?.toLowerCase() === 'btc')
  const ethCoin = coins.find((c) => c.symbol?.toLowerCase() === 'eth')

  const btcCap = btcCoin?.market_cap || 0
  const ethCap = ethCoin?.market_cap || 0

  const btcDominance = totalMarketCap > 0 ? (btcCap / totalMarketCap) * 100 : 0
  const ethDominance = totalMarketCap > 0 ? (ethCap / totalMarketCap) * 100 : 0

  const avgChange =
    coins.reduce((acc, c) => acc + (c.price_change_percentage_24h || 0), 0) / coins.length

  const changeDirection = getChangeDirection(avgChange)

  const stats = [
    {
      id: 'g-mcap',
      label: `Global Market Cap (${currency})`,
      value: formatLargeNumber(totalMarketCap),
      sub: formatPercent(avgChange),
      dir: changeDirection,
      icon: <GlobeIcon />,
      color: '#1a6fff',
    },
    {
      id: 'g-vol',
      label: `24H Global Volume (${currency})`,
      value: formatLargeNumber(totalVolume),
      sub: 'All Exchanges',
      icon: <BarChartIcon />,
      color: '#7c3aed',
    },
    {
      id: 'g-btc',
      label: 'Bitcoin Dominance',
      value: `${btcDominance.toFixed(1)}%`,
      sub: 'BTC Share',
      icon: <BtcIcon />,
      color: '#f59e0b',
    },
    {
      id: 'g-eth',
      label: 'Ethereum Dominance',
      value: `${ethDominance.toFixed(1)}%`,
      sub: 'ETH Share',
      icon: <EthIcon />,
      color: '#8b5cf6',
    },
    {
      id: 'g-crypto',
      label: 'Active Cryptos',
      value: '14,892',
      sub: 'Tracked Assets',
      icon: <LayersIcon />,
      color: '#10b981',
    },
    {
      id: 'g-exchanges',
      label: 'Active Exchanges',
      value: '748',
      sub: 'Spot & Derivatives',
      icon: <ExchangeIcon />,
      color: '#06b6d4',
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Global Market Statistics</h2>
        <p className={styles.subtitle}>Macro economic metrics for the cryptocurrency ecosystem</p>
      </div>

      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.label}>{stat.label}</span>
              <div
                className={styles.iconWrapper}
                style={{ color: stat.color, background: `${stat.color}15` }}
              >
                {stat.icon}
              </div>
            </div>
            <p className={styles.value}>{stat.value}</p>
            {stat.sub && (
              <span className={`${styles.sub} ${stat.dir ? styles[stat.dir] : ''}`}>
                {stat.sub}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(GlobalOverview)

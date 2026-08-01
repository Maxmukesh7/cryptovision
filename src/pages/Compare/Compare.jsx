import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import useCoins from '../../hooks/useCoins'
import {
  formatPercent,
  getChangeDirection,
} from '../../utils/formatters'
import Loader from '../../components/Loader/Loader'
import styles from './Compare.module.css'

function Compare() {
  const { coins, loading } = useCoins()
  const { formatCurrency, formatLargeNumber, currency } = useApp()

  const [coin1Id, setCoin1Id] = useState('btc-bitcoin')
  const [coin2Id, setCoin2Id] = useState('eth-ethereum')

  const coin1 = useMemo(() => coins.find((c) => c.id === coin1Id) || coins[0], [coins, coin1Id])
  const coin2 = useMemo(() => coins.find((c) => c.id === coin2Id) || coins[1] || coins[0], [coins, coin2Id])

  if (loading && coins.length === 0) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="lg" label="Loading cryptocurrencies for comparison..." />
      </div>
    )
  }

  if (!coin1 || !coin2) return null

  const rows = [
    {
      label: `Current Price (${currency})`,
      val1: formatCurrency(coin1.current_price),
      val2: formatCurrency(coin2.current_price),
      winner: coin1.current_price > coin2.current_price ? 1 : 2,
    },
    {
      label: `Market Cap (${currency})`,
      val1: formatLargeNumber(coin1.market_cap),
      val2: formatLargeNumber(coin2.market_cap),
      winner: (coin1.market_cap || 0) > (coin2.market_cap || 0) ? 1 : 2,
    },
    {
      label: '24H Price Change',
      val1: formatPercent(coin1.price_change_percentage_24h),
      val2: formatPercent(coin2.price_change_percentage_24h),
      dir1: getChangeDirection(coin1.price_change_percentage_24h),
      dir2: getChangeDirection(coin2.price_change_percentage_24h),
      winner: (coin1.price_change_percentage_24h || 0) > (coin2.price_change_percentage_24h || 0) ? 1 : 2,
    },
    {
      label: `24H Volume (${currency})`,
      val1: formatLargeNumber(coin1.total_volume),
      val2: formatLargeNumber(coin2.total_volume),
      winner: (coin1.total_volume || 0) > (coin2.total_volume || 0) ? 1 : 2,
    },
    {
      label: 'Market Rank',
      val1: coin1.market_cap_rank ? `#${coin1.market_cap_rank}` : '—',
      val2: coin2.market_cap_rank ? `#${coin2.market_cap_rank}` : '—',
      winner: (coin1.market_cap_rank || 999) < (coin2.market_cap_rank || 999) ? 1 : 2,
    },
  ]

  return (
    <section className={styles.container} aria-labelledby="compare-heading">
      <header className={styles.header}>
        <div>
          <h1 id="compare-heading" className={styles.title}>Cryptocurrency Comparison</h1>
          <p className={styles.subtitle}>Side-by-side feature and metric analysis ({currency})</p>
        </div>
      </header>

      {/* ── Selectors Header Card ── */}
      <div className={styles.selectorsCard}>
        <div className={styles.selectorBox}>
          <label htmlFor="coin1-select" className={styles.selectLabel}>Asset 1:</label>
          <select
            id="coin1-select"
            className={styles.selectInput}
            value={coin1.id}
            onChange={(e) => setCoin1Id(e.target.value)}
          >
            {coins.map((c) => (
              <option key={`c1-${c.id}`} value={c.id}>
                {c.name} ({c.symbol?.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.vsBadge}>VS</div>

        <div className={styles.selectorBox}>
          <label htmlFor="coin2-select" className={styles.selectLabel}>Asset 2:</label>
          <select
            id="coin2-select"
            className={styles.selectInput}
            value={coin2.id}
            onChange={(e) => setCoin2Id(e.target.value)}
          >
            {coins.map((c) => (
              <option key={`c2-${c.id}`} value={c.id}>
                {c.name} ({c.symbol?.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <div className={styles.tableCard}>
        <div className={styles.heroRow}>
          <div className={styles.heroCell}>
            <span className={styles.heroLabel}>Metrics</span>
          </div>

          <div className={styles.heroCell}>
            <img src={coin1.image} alt={coin1.name} className={styles.coinLogo} />
            <div>
              <h3 className={styles.coinName}>{coin1.name}</h3>
              <span className={styles.coinSymbol}>{coin1.symbol?.toUpperCase()}</span>
            </div>
          </div>

          <div className={styles.heroCell}>
            <img src={coin2.image} alt={coin2.name} className={styles.coinLogo} />
            <div>
              <h3 className={styles.coinName}>{coin2.name}</h3>
              <span className={styles.coinSymbol}>{coin2.symbol?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {rows.map((row, idx) => (
          <div key={idx} className={styles.dataRow}>
            <div className={styles.labelCell}>
              <span className={styles.metricName}>{row.label}</span>
            </div>

            <div className={`${styles.valueCell} ${row.winner === 1 ? styles.winnerHighlight : ''}`}>
              <span className={`${styles.valueText} ${row.dir1 ? styles[row.dir1] : ''}`}>
                {row.val1}
              </span>
              {row.winner === 1 && <span className={styles.leaderBadge}>Leader</span>}
            </div>

            <div className={`${styles.valueCell} ${row.winner === 2 ? styles.winnerHighlight : ''}`}>
              <span className={`${styles.valueText} ${row.dir2 ? styles[row.dir2] : ''}`}>
                {row.val2}
              </span>
              {row.winner === 2 && <span className={styles.leaderBadge}>Leader</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default React.memo(Compare)

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatLargeNumber, formatPercent } from '../../utils/formatters'
import styles from './MarketSentiment.module.css'

const GaugeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
  </svg>
)

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

function MarketSentiment({ coins = [] }) {
  const navigate = useNavigate()

  if (!coins || coins.length === 0) return null

  // Calculate market sentiment based on 24h changes
  const positiveCoins = coins.filter((c) => (c.price_change_percentage_24h || 0) > 0)
  const bullishPct = Math.round((positiveCoins.length / coins.length) * 100)
  const bearishPct = 100 - bullishPct

  let status = 'Neutral'
  let statusColorClass = styles.neutralStatus
  if (bullishPct >= 60) {
    status = 'Bullish'
    statusColorClass = styles.bullishStatus
  } else if (bullishPct <= 40) {
    status = 'Bearish'
    statusColorClass = styles.bearishStatus
  }

  // Quick stats calculations
  const sortedByChange = [...coins].sort(
    (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
  )
  const sortedByVolume = [...coins].sort(
    (a, b) => (b.total_volume || 0) - (a.total_volume || 0)
  )
  const sortedByCap = [...coins].sort(
    (a, b) => (b.market_cap || 0) - (a.market_cap || 0)
  )

  const topGainer = sortedByChange[0]
  const topLoser = sortedByChange[sortedByChange.length - 1]
  const topVolume = sortedByVolume[0]
  const topMarketCap = sortedByCap[0]

  return (
    <div className={styles.widgetsGrid}>
      {/* ── Market Sentiment Widget ── */}
      <div className={styles.widgetCard}>
        <div className={styles.widgetHeader}>
          <div className={styles.iconBadge}>
            <GaugeIcon />
          </div>
          <div>
            <h3 className={styles.widgetTitle}>Market Sentiment</h3>
            <p className={styles.widgetSubtitle}>Community fear &amp; greed ratio</p>
          </div>
        </div>

        <div className={styles.sentimentBody}>
          <div className={styles.statusDisplay}>
            <span className={styles.statusLabel}>Current Mood</span>
            <span className={`${styles.statusPill} ${statusColorClass}`}>{status}</span>
          </div>

          <div className={styles.meterBar}>
            <div
              className={styles.bullishBar}
              style={{ width: `${bullishPct}%` }}
              title={`Bullish: ${bullishPct}%`}
            />
            <div
              className={styles.bearishBar}
              style={{ width: `${bearishPct}%` }}
              title={`Bearish: ${bearishPct}%`}
            />
          </div>

          <div className={styles.pctRow}>
            <div className={styles.pctItem}>
              <span className={styles.dotBullish} />
              <span>Bullish: {bullishPct}%</span>
            </div>
            <div className={styles.pctItem}>
              <span className={styles.dotBearish} />
              <span>Bearish: {bearishPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Market Stats Widget ── */}
      <div className={styles.widgetCard}>
        <div className={styles.widgetHeader}>
          <div className={`${styles.iconBadge} ${styles.zapIcon}`}>
            <ZapIcon />
          </div>
          <div>
            <h3 className={styles.widgetTitle}>Quick Market Highlights</h3>
            <p className={styles.widgetSubtitle}>Outperforming asset leaders</p>
          </div>
        </div>

        <div className={styles.quickGrid}>
          {topGainer && (
            <div
              className={styles.quickItem}
              onClick={() => navigate(`/coin/${topGainer.id}`)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.quickLabel}>Top Gainer</span>
              <div className={styles.quickCoin}>
                <img src={topGainer.image} alt={topGainer.name} className={styles.miniLogo} />
                <span className={styles.quickName}>{topGainer.symbol?.toUpperCase()}</span>
                <span className={styles.positiveVal}>
                  {formatPercent(topGainer.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          )}

          {topLoser && (
            <div
              className={styles.quickItem}
              onClick={() => navigate(`/coin/${topLoser.id}`)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.quickLabel}>Top Loser</span>
              <div className={styles.quickCoin}>
                <img src={topLoser.image} alt={topLoser.name} className={styles.miniLogo} />
                <span className={styles.quickName}>{topLoser.symbol?.toUpperCase()}</span>
                <span className={styles.negativeVal}>
                  {formatPercent(topLoser.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          )}

          {topVolume && (
            <div
              className={styles.quickItem}
              onClick={() => navigate(`/coin/${topVolume.id}`)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.quickLabel}>Highest Volume</span>
              <div className={styles.quickCoin}>
                <img src={topVolume.image} alt={topVolume.name} className={styles.miniLogo} />
                <span className={styles.quickName}>{topVolume.symbol?.toUpperCase()}</span>
                <span className={styles.neutralVal}>{formatLargeNumber(topVolume.total_volume)}</span>
              </div>
            </div>
          )}

          {topMarketCap && (
            <div
              className={styles.quickItem}
              onClick={() => navigate(`/coin/${topMarketCap.id}`)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.quickLabel}>Highest Cap</span>
              <div className={styles.quickCoin}>
                <img src={topMarketCap.image} alt={topMarketCap.name} className={styles.miniLogo} />
                <span className={styles.quickName}>{topMarketCap.symbol?.toUpperCase()}</span>
                <span className={styles.neutralVal}>{formatLargeNumber(topMarketCap.market_cap)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(MarketSentiment)

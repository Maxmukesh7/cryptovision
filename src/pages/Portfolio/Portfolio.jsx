import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import useCoins from '../../hooks/useCoins'
import {
  formatPercent,
  getChangeDirection,
} from '../../utils/formatters'
import Loader from '../../components/Loader/Loader'
import styles from './Portfolio.module.css'

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

function Portfolio() {
  const { portfolio, addPortfolioAsset, removePortfolioAsset, formatCurrency, currency } = useApp()
  const { coins, loading } = useCoins()

  const [selectedCoinId, setSelectedCoinId] = useState('btc-bitcoin')
  const [quantity, setQuantity] = useState('1')

  // Calculate Portfolio Value & Metrics
  const { holdings, totalValue, totalChange24h, avgChangePct } = useMemo(() => {
    let sumValue = 0
    let weightedChangeSum = 0

    const items = portfolio.map((item) => {
      const coinData = coins.find((c) => c.id === item.coinId) || {
        id: item.coinId,
        name: item.coinId,
        symbol: item.coinId.slice(0, 4).toUpperCase(),
        current_price: 100,
        price_change_percentage_24h: 0,
        image: '',
      }

      const itemValue = (coinData.current_price || 0) * item.quantity
      sumValue += itemValue
      weightedChangeSum += itemValue * (coinData.price_change_percentage_24h || 0)

      return {
        ...item,
        coin: coinData,
        itemValue,
      }
    })

    const avgChange = sumValue > 0 ? weightedChangeSum / sumValue : 0

    return {
      holdings: items,
      totalValue: sumValue,
      totalChange24h: (sumValue * avgChange) / 100,
      avgChangePct: avgChange,
    }
  }, [portfolio, coins])

  const handleAddAsset = (e) => {
    e.preventDefault()
    if (!quantity || Number(quantity) <= 0) return
    const coin = coins.find((c) => c.id === selectedCoinId)
    addPortfolioAsset(selectedCoinId, Number(quantity), coin?.name)
    setQuantity('1')
  }

  if (loading && coins.length === 0) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="lg" label="Loading portfolio simulator..." />
      </div>
    )
  }

  const changeDirection = getChangeDirection(avgChangePct)

  return (
    <section className={styles.container} aria-labelledby="portfolio-heading">
      <header className={styles.header}>
        <div>
          <h1 id="portfolio-heading" className={styles.title}>Portfolio Simulator</h1>
          <p className={styles.subtitle}>Simulate &amp; track your crypto holdings value in real time ({currency})</p>
        </div>
      </header>

      {/* ── Summary Stats Cards ── */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Total Portfolio Balance ({currency})</p>
          <h2 className={styles.summaryValue}>{formatCurrency(totalValue)}</h2>
          <span className={`${styles.changeBadge} ${styles[changeDirection]}`}>
            {avgChangePct >= 0 ? '↑ ' : '↓ '}
            {formatPercent(avgChangePct)} (24h)
          </span>
        </div>

        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>24H Profit / Loss ({currency})</p>
          <h2 className={`${styles.summaryValue} ${styles[changeDirection]}`}>
            {totalChange24h >= 0 ? '+' : ''}{formatCurrency(totalChange24h)}
          </h2>
          <span className={styles.summarySub}>Estimated 24h change</span>
        </div>

        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Total Assets Held</p>
          <h2 className={styles.summaryValue}>{holdings.length} Assets</h2>
          <span className={styles.summarySub}>Stored in local session</span>
        </div>
      </div>

      {/* ── Add Asset Form ── */}
      <div className={styles.formCard}>
        <h3 className={styles.formTitle}>Add Asset to Portfolio</h3>
        <form className={styles.form} onSubmit={handleAddAsset}>
          <div className={styles.inputGroup}>
            <label htmlFor="coin-select" className={styles.label}>Cryptocurrency</label>
            <select
              id="coin-select"
              className={styles.selectInput}
              value={selectedCoinId}
              onChange={(e) => setSelectedCoinId(e.target.value)}
            >
              {coins.map((c) => (
                <option key={`p-${c.id}`} value={c.id}>
                  {c.name} ({c.symbol?.toUpperCase()}) — {formatCurrency(c.current_price)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="quantity-input" className={styles.label}>Quantity Owned</label>
            <input
              id="quantity-input"
              type="number"
              step="any"
              min="0.0001"
              className={styles.numInput}
              placeholder="e.g. 1.5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.addBtn}>
            <PlusIcon />
            Add to Portfolio
          </button>
        </form>
      </div>

      {/* ── Holdings Table ── */}
      <div className={styles.tableCard}>
        <h3 className={styles.tableTitle}>Your Asset Holdings</h3>
        {holdings.length > 0 ? (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th className={styles.thRight}>Price ({currency})</th>
                  <th className={styles.thRight}>Holdings</th>
                  <th className={styles.thRight}>Total Value ({currency})</th>
                  <th className={styles.thRight}>24h Change</th>
                  <th className={styles.thCenter}>Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map(({ coinId, quantity: qty, coin, itemValue }) => {
                  const dir = getChangeDirection(coin.price_change_percentage_24h)
                  return (
                    <tr key={`holding-${coinId}`} className={styles.row}>
                      <td>
                        <div className={styles.coinCell}>
                          <img src={coin.image} alt={coin.name} className={styles.coinLogo} />
                          <div>
                            <span className={styles.coinName}>{coin.name}</span>
                            <span className={styles.coinSymbol}>{coin.symbol?.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tdRight}>{formatCurrency(coin.current_price)}</td>
                      <td className={styles.tdRight}>
                        {qty} {coin.symbol?.toUpperCase()}
                      </td>
                      <td className={styles.tdRight}>{formatCurrency(itemValue)}</td>
                      <td className={styles.tdRight}>
                        <span className={`${styles.badge} ${styles[dir]}`}>
                          {formatPercent(coin.price_change_percentage_24h)}
                        </span>
                      </td>
                      <td className={styles.tdCenter}>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removePortfolioAsset(coinId, coin.name)}
                          title="Remove asset"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyHoldings}>
            <p>No assets in portfolio yet. Use the form above to add an asset!</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default React.memo(Portfolio)

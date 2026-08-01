import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatLargeNumber, formatPercent, getChangeDirection } from '../../utils/formatters'
import styles from './CoinTable.module.css'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

function CoinTable({ coins }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filteredCoins = coins.filter(coin => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      coin.name.toLowerCase().includes(q) ||
      coin.symbol.toLowerCase().includes(q)
    )
  })

  const handleRowClick = (coinId) => {
    navigate(`/coin/${coinId}`)
  }

  const handleKeyDown = (e, coinId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(`/coin/${coinId}`)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            id="coin-search"
            type="search"
            className={styles.searchInput}
            placeholder="Search by name or symbol..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search coins"
          />
          {query && (
            <button
              className={styles.clearButton}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}
        </div>
        <p className={styles.resultCount} aria-live="polite">
          {filteredCoins.length === coins.length
            ? `${coins.length} coins`
            : `${filteredCoins.length} of ${coins.length} coins`}
        </p>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table} aria-label="Cryptocurrency market data">
          <thead>
            <tr>
              <th className={styles.thRank}>#</th>
              <th className={styles.thCoin}>Coin</th>
              <th className={styles.thNumeric}>Price</th>
              <th className={styles.thNumeric}>24h Change</th>
              <th className={styles.thNumeric}>Market Cap</th>
              <th className={styles.thNumeric}>24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.length > 0 ? (
              filteredCoins.map(coin => {
                const direction = getChangeDirection(coin.price_change_percentage_24h)
                return (
                  <tr
                    key={coin.id}
                    id={`row-${coin.id}`}
                    className={styles.row}
                    onClick={() => handleRowClick(coin.id)}
                    onKeyDown={e => handleKeyDown(e, coin.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${coin.name}`}
                  >
                    <td className={styles.tdRank}>
                      <span className={styles.rank}>{coin.market_cap_rank}</span>
                    </td>

                    <td className={styles.tdCoin}>
                      <div className={styles.coinCell}>
                        <img
                          src={coin.image}
                          alt={`${coin.name} logo`}
                          className={styles.coinLogo}
                          width={32}
                          height={32}
                          loading="lazy"
                          onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                        <div className={styles.coinMeta}>
                          <span className={styles.coinName}>{coin.name}</span>
                          <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
                        </div>
                      </div>
                    </td>

                    <td className={styles.tdNumeric}>
                      {formatCurrency(coin.current_price)}
                    </td>

                    <td className={styles.tdNumeric}>
                      <span className={`${styles.changeBadge} ${styles[direction]}`}>
                        {formatPercent(coin.price_change_percentage_24h)}
                      </span>
                    </td>

                    <td className={styles.tdNumeric}>
                      {formatLargeNumber(coin.market_cap)}
                    </td>

                    <td className={styles.tdNumeric}>
                      {formatLargeNumber(coin.total_volume)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  No coins found matching &quot;{query}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CoinTable

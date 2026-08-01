import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
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

const StarIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
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

function CoinTable({ coins = [] }) {
  const navigate = useNavigate()
  const { isInWatchlist, toggleWatchlist, searchHistory, addSearchQuery, clearSearchHistory } = useApp()

  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [sortField, setSortField] = useState('rank') // 'rank' | 'name' | 'price' | 'change' | 'market_cap' | 'volume'
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' | 'desc'
  const [limit, setLimit] = useState(100) // 10 | 25 | 50 | 100

  // 1. Filtering & Sorting with useMemo
  const processedCoins = useMemo(() => {
    let result = [...coins]

    const q = query.toLowerCase().trim()
    if (q) {
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(q) ||
          coin.symbol.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let valA, valB
      switch (sortField) {
        case 'name':
          valA = a.name.toLowerCase()
          valB = b.name.toLowerCase()
          break
        case 'price':
          valA = a.current_price ?? 0
          valB = b.current_price ?? 0
          break
        case 'change':
          valA = a.price_change_percentage_24h ?? 0
          valB = b.price_change_percentage_24h ?? 0
          break
        case 'market_cap':
          valA = a.market_cap ?? 0
          valB = b.market_cap ?? 0
          break
        case 'volume':
          valA = a.total_volume ?? 0
          valB = b.total_volume ?? 0
          break
        case 'rank':
        default:
          valA = a.market_cap_rank ?? 999
          valB = b.market_cap_rank ?? 999
          break
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result.slice(0, limit)
  }, [coins, query, sortField, sortOrder, limit])

  const handleSearchChange = (e) => {
    setQuery(e.target.value)
    setShowSuggestions(true)
  }

  const handleSearchSubmit = (searchVal) => {
    setQuery(searchVal)
    setShowSuggestions(false)
    addSearchQuery(searchVal)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder(field === 'rank' || field === 'name' ? 'asc' : 'desc')
    }
  }

  const renderSortIndicator = (field) => {
    if (sortField !== field) return <span className={styles.sortArrowInactive}>↕</span>
    return <span className={styles.sortArrowActive}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
  }

  const handleRowClick = (coinId) => {
    addSearchQuery(query)
    navigate(`/coin/${coinId}`)
  }

  const handleKeyDown = (e, coinId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      addSearchQuery(query)
      navigate(`/coin/${coinId}`)
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* ── Toolbar ── */}
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
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(query)
            }}
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

          {/* Search Suggestions & Recent Searches Dropdown */}
          {showSuggestions && searchHistory && searchHistory.length > 0 && !query && (
            <div className={styles.suggestionsDropdown}>
              <div className={styles.suggestionsHeader}>
                <span>Recent Searches</span>
                <button
                  className={styles.clearHistoryBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    clearSearchHistory()
                  }}
                >
                  Clear History
                </button>
              </div>
              {searchHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={styles.suggestionItem}
                  onClick={() => handleSearchSubmit(item)}
                >
                  🔍 {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.controlsGroup}>
          <div className={styles.selectWrapper}>
            <label htmlFor="sort-select" className={styles.selectLabel}>Sort:</label>
            <select
              id="sort-select"
              className={styles.selectInput}
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-')
                setSortField(f)
                setSortOrder(o)
              }}
            >
              <option value="rank-asc">Rank (1 → 100)</option>
              <option value="market_cap-desc">Market Cap (High → Low)</option>
              <option value="price-desc">Price (High → Low)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="change-desc">24h Change (Highest)</option>
              <option value="change-asc">24h Change (Lowest)</option>
              <option value="name-asc">Alphabetical (A → Z)</option>
            </select>
          </div>

          <div className={styles.selectWrapper}>
            <label htmlFor="limit-select" className={styles.selectLabel}>Show:</label>
            <select
              id="limit-select"
              className={styles.selectInput}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={10}>Top 10</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          </div>

          <p className={styles.resultCount} aria-live="polite">
            Showing {processedCoins.length} of {coins.length}
          </p>
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableScroll}>
        <table className={styles.table} aria-label="Cryptocurrency market data">
          <thead>
            <tr>
              <th className={styles.thStar}>Fav</th>
              <th className={`${styles.thRank} ${styles.sortableHeader}`} onClick={() => handleSort('rank')}>
                # {renderSortIndicator('rank')}
              </th>
              <th className={`${styles.thCoin} ${styles.sortableHeader}`} onClick={() => handleSort('name')}>
                Coin {renderSortIndicator('name')}
              </th>
              <th className={`${styles.thNumeric} ${styles.sortableHeader}`} onClick={() => handleSort('price')}>
                Price {renderSortIndicator('price')}
              </th>
              <th className={`${styles.thNumeric} ${styles.sortableHeader}`} onClick={() => handleSort('change')}>
                24h Change {renderSortIndicator('change')}
              </th>
              <th className={`${styles.thNumeric} ${styles.sortableHeader}`} onClick={() => handleSort('market_cap')}>
                Market Cap {renderSortIndicator('market_cap')}
              </th>
              <th className={`${styles.thNumeric} ${styles.sortableHeader}`} onClick={() => handleSort('volume')}>
                24h Volume {renderSortIndicator('volume')}
              </th>
            </tr>
          </thead>
          <tbody>
            {processedCoins.length > 0 ? (
              processedCoins.map((coin) => {
                const direction = getChangeDirection(coin.price_change_percentage_24h)
                const isFavorite = isInWatchlist(coin.id)

                return (
                  <tr
                    key={coin.id}
                    id={`row-${coin.id}`}
                    className={styles.row}
                    onClick={() => handleRowClick(coin.id)}
                    onKeyDown={(e) => handleKeyDown(e, coin.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${coin.name}`}
                  >
                    <td
                      className={styles.tdStar}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWatchlist(coin.id, coin.name)
                      }}
                      title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <button
                        className={styles.starBtn}
                        aria-label={isFavorite ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
                      >
                        <StarIcon filled={isFavorite} />
                      </button>
                    </td>

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
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <div className={styles.coinMeta}>
                          <span className={styles.coinName}>{coin.name}</span>
                          <span className={styles.coinSymbol}>{coin.symbol?.toUpperCase()}</span>
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
                <td colSpan={7} className={styles.emptyRow}>
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

export default React.memo(CoinTable)

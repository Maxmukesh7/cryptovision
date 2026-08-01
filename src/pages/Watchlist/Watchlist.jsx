import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import useCoins from '../../hooks/useCoins'
import CoinTable from '../../components/CoinTable/CoinTable'
import Loader from '../../components/Loader/Loader'
import styles from './Watchlist.module.css'

const StarIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

function Watchlist() {
  const { watchlist } = useApp()
  const { coins, loading } = useCoins()

  const watchlistedCoins = coins.filter((coin) => watchlist.includes(coin.id))

  return (
    <section className={styles.container} aria-labelledby="watchlist-heading">
      <header className={styles.header}>
        <div>
          <h1 id="watchlist-heading" className={styles.title}>My Watchlist</h1>
          <p className={styles.subtitle}>Track your bookmarked cryptocurrencies in real time</p>
        </div>
      </header>

      {loading && coins.length === 0 ? (
        <div className={styles.loaderWrapper}>
          <Loader size="lg" label="Loading watchlist..." />
        </div>
      ) : watchlistedCoins.length > 0 ? (
        <CoinTable coins={watchlistedCoins} />
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.iconWrapper}>
            <StarIcon />
          </div>
          <h2 className={styles.emptyTitle}>Your Watchlist is Empty</h2>
          <p className={styles.emptySubtitle}>
            Click the star icon next to any cryptocurrency on the Dashboard or Coin Details page to add it to your watchlist.
          </p>
          <Link to="/" className={styles.dashboardBtn}>
            Explore Dashboard
          </Link>
        </div>
      )}
    </section>
  )
}

export default React.memo(Watchlist)

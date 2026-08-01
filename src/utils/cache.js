/**
 * CryptoVision — localStorage Cache Utility
 *
 * Provides simple key-based caching with TTL (time-to-live).
 * All errors are caught silently so a full/unavailable localStorage
 * never breaks the application.
 */

/** Cache TTL in milliseconds — 60 seconds. */
const TTL_MS = 60 * 1000

/**
 * Read a cached entry from localStorage.
 *
 * @param {string} key
 * @returns {{ data: any, isExpired: boolean } | null}
 *   - null   → no entry exists
 *   - data   → the cached value
 *   - isExpired → true when the entry is older than TTL_MS
 */
export function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    const isExpired = Date.now() - timestamp > TTL_MS
    return { data, isExpired }
  } catch {
    return null
  }
}

/**
 * Write a value to localStorage with the current timestamp.
 * Silently ignores errors (e.g. storage quota exceeded).
 *
 * @param {string} key
 * @param {any} data
 */
export function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // localStorage full or unavailable — degrade gracefully
  }
}

/**
 * Cache key constants shared between the service and hooks.
 */
export const CACHE_KEYS = {
  topCoins: 'cv_top_coins',
  coinDetail: (id) => `cv_coin_${id}`,
  coinChart: (id) => `cv_chart_${id}`,
}

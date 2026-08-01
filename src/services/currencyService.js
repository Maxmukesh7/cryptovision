/**
 * CryptoVision — Currency Service
 * Manages live exchange rates from https://open.er-api.com/v6/latest/USD with 1-hour LocalStorage caching.
 * Provides monetary conversion and formatting without modifying CoinPaprika USD base data.
 */

const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest/USD'
const CACHE_KEY_RATES = 'cv_exchange_rates'
const CACHE_KEY_TIMESTAMP = 'cv_rates_timestamp'
const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 Hour

export const FALLBACK_RATES = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155.0,
}

export const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
}

export const CURRENCY_LOCALES = {
  USD: 'en-US',
  INR: 'en-IN',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
}

/**
 * Fetch exchange rates with 1-hour LocalStorage caching.
 * @returns {Promise<Record<string, number>>}
 */
export async function getExchangeRates() {
  try {
    const cachedRatesStr = localStorage.getItem(CACHE_KEY_RATES)
    const cachedTimestampStr = localStorage.getItem(CACHE_KEY_TIMESTAMP)
    const now = Date.now()

    if (cachedRatesStr && cachedTimestampStr) {
      const cachedTimestamp = Number(cachedTimestampStr)
      if (now - cachedTimestamp < CACHE_DURATION_MS) {
        const parsed = JSON.parse(cachedRatesStr)
        return { ...FALLBACK_RATES, ...parsed }
      }
    }

    const response = await fetch(EXCHANGE_API_URL)
    if (!response.ok) {
      throw new Error(`Exchange rate API responded with status ${response.status}`)
    }

    const data = await response.json()
    if (data && data.rates) {
      const freshRates = {
        USD: 1,
        INR: data.rates.INR || FALLBACK_RATES.INR,
        EUR: data.rates.EUR || FALLBACK_RATES.EUR,
        GBP: data.rates.GBP || FALLBACK_RATES.GBP,
        JPY: data.rates.JPY || FALLBACK_RATES.JPY,
      }

      localStorage.setItem(CACHE_KEY_RATES, JSON.stringify(freshRates))
      localStorage.setItem(CACHE_KEY_TIMESTAMP, String(now))
      return freshRates
    }
  } catch (err) {
    console.warn('CryptoVision: Failed to fetch live exchange rates, using cached or fallback rates.', err)
  }

  // Fallback to cached rates if present, otherwise default fallback rates
  try {
    const cachedRatesStr = localStorage.getItem(CACHE_KEY_RATES)
    if (cachedRatesStr) {
      return { ...FALLBACK_RATES, ...JSON.parse(cachedRatesStr) }
    }
  } catch {
    // ignore
  }

  return FALLBACK_RATES
}

/**
 * Convert USD amount to target currency.
 * @param {number} usdAmount
 * @param {string} targetCurrency - 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY'
 * @param {Record<string, number>} rates
 * @returns {number}
 */
export function convertFromUsd(usdAmount, targetCurrency = 'USD', rates = FALLBACK_RATES) {
  if (usdAmount === null || usdAmount === undefined || isNaN(usdAmount)) return 0
  const rate = rates[targetCurrency] || FALLBACK_RATES[targetCurrency] || 1
  return usdAmount * rate
}

/**
 * Format monetary amount with appropriate symbol using Intl.NumberFormat.
 * @param {number} usdAmount - Value in base USD
 * @param {string} currencyCode - 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY'
 * @param {Record<string, number>} rates
 * @param {number} [maxDigits=2]
 * @returns {string} e.g. "₹5,364,875.00" or "¥9,500"
 */
export function formatCurrencyVal(usdAmount, currencyCode = 'USD', rates = FALLBACK_RATES, maxDigits = 2) {
  if (usdAmount === null || usdAmount === undefined || isNaN(usdAmount)) return '—'
  const converted = convertFromUsd(usdAmount, currencyCode, rates)
  const locale = CURRENCY_LOCALES[currencyCode] || 'en-US'
  const digits = currencyCode === 'JPY' ? 0 : maxDigits

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: digits,
  }).format(converted)
}

/**
 * Format large monetary amount with T / B / M suffixes and target currency symbol.
 * @param {number} usdAmount - Value in base USD
 * @param {string} currencyCode - 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY'
 * @param {Record<string, number>} rates
 * @returns {string} e.g. "₹200.50B" or "€2.21T"
 */
export function formatLargeCurrencyVal(usdAmount, currencyCode = 'USD', rates = FALLBACK_RATES) {
  if (usdAmount === null || usdAmount === undefined || isNaN(usdAmount)) return '—'
  const converted = convertFromUsd(usdAmount, currencyCode, rates)
  const symbol = CURRENCY_SYMBOLS[currencyCode] || '$'

  if (converted >= 1e12) return `${symbol}${(converted / 1e12).toFixed(2)}T`
  if (converted >= 1e9) return `${symbol}${(converted / 1e9).toFixed(2)}B`
  if (converted >= 1e6) return `${symbol}${(converted / 1e6).toFixed(2)}M`
  return formatCurrencyVal(usdAmount, currencyCode, rates, 2)
}

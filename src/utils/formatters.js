/**
 * CryptoVision — Utility Formatters
 * Shared formatting helpers integrated with currencyService for dynamic exchange rates.
 */

import {
  FALLBACK_RATES,
  CURRENCY_SYMBOLS,
  CURRENCY_LOCALES,
  formatCurrencyVal,
  formatLargeCurrencyVal,
  convertFromUsd,
} from '../services/currencyService'

export { FALLBACK_RATES, CURRENCY_SYMBOLS, CURRENCY_LOCALES, convertFromUsd }

/**
 * Format a USD base number as a converted currency string using Intl.NumberFormat.
 * @param {number} value - Base USD value
 * @param {number} [maximumFractionDigits=2]
 * @param {string} [currencyCode='USD']
 * @param {Record<string, number>} [rates]
 * @returns {string} e.g. "€62,037.44" or "₹5,364,875.00"
 */
export function formatCurrency(value, maximumFractionDigits = 2, currencyCode = 'USD', rates = FALLBACK_RATES) {
  return formatCurrencyVal(value, currencyCode, rates, maximumFractionDigits)
}

/**
 * Format a large number with currency symbol and T / B / M suffixes.
 * @param {number} value - Base USD value
 * @param {string} [currencyCode='USD']
 * @param {Record<string, number>} [rates]
 * @returns {string} e.g. "$2.41T" or "€2.21T"
 */
export function formatLargeNumber(value, currencyCode = 'USD', rates = FALLBACK_RATES) {
  return formatLargeCurrencyVal(value, currencyCode, rates)
}

/**
 * Format a percentage value with a leading + or -.
 * @param {number} value
 * @param {number} [digits=2]
 * @returns {string} e.g. "+2.41%"
 */
export function formatPercent(value, digits = 2) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}%`
}

/**
 * Return "positive" | "negative" | "neutral" based on value sign.
 * @param {number} value
 * @returns {'positive'|'negative'|'neutral'}
 */
export function getChangeDirection(value) {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'neutral'
}

/**
 * Compute the arithmetic mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
export function average(values) {
  if (!values || values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

/**
 * Format a Unix timestamp (ms) as a short date string.
 * @param {number} timestamp
 * @param {Intl.DateTimeFormatOptions} [opts]
 * @returns {string} e.g. "Jan 26"
 */
export function formatDate(timestamp, opts = { month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', opts).format(new Date(timestamp))
}

/**
 * Format a full ISO date string to a readable local date-time.
 * @param {string} isoString
 * @returns {string} e.g. "Aug 2, 2026, 1:09 AM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString))
}

/**
 * Format a raw number with thousand separators (no currency symbol).
 * @param {number} value
 * @returns {string} e.g. "19,784,312"
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

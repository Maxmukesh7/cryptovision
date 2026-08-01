import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  formatCurrencyVal,
  formatLargeCurrencyVal,
  CURRENCY_SYMBOLS,
} from './currencyService'

/**
 * Generates and triggers download of a professional PDF Report (CryptoVision_Report.pdf)
 *
 * @param {Object} options
 * @param {Array} options.coins - Array of top coins
 * @param {Array} options.watchlist - Array of watchlisted coin IDs
 * @param {Array} options.portfolio - Array of portfolio items [{ coinId, quantity }]
 * @param {string} options.currency - Active currency code (USD, EUR, GBP, INR, JPY)
 * @param {Object} options.rates - Active exchange rates
 */
export function generatePdfReport({
  coins = [],
  watchlist = [],
  portfolio = [],
  currency = 'USD',
  rates = {},
}) {
  const doc = jsPDF ? new jsPDF({ unit: 'pt', format: 'a4' }) : null
  if (!doc) return

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  let currentY = 40

  const primaryColor = [26, 111, 255] // #1a6fff
  const darkTextColor = [13, 27, 62] // #0d1b3e
  const mutedTextColor = [143, 160, 192] // #8fa0c0
  const cardBgColor = [240, 244, 255] // #f0f4ff

  // helper formatters
  const fmtCurr = (val, maxDigits = 2) => formatCurrencyVal(val, currency, rates, maxDigits)
  const fmtLarge = (val) => formatLargeCurrencyVal(val, currency, rates)
  const fmtPct = (val) => (val !== undefined && val !== null ? `${val >= 0 ? '+' : ''}${val.toFixed(2)}%` : '—')

  // ── HEADER ──
  doc.setFillColor(...primaryColor)
  doc.rect(margin, currentY, pageWidth - margin * 2, 60, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('Helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('CryptoVision Analytics', margin + 20, currentY + 36)

  doc.setFontSize(10)
  doc.setFont('Helvetica', 'normal')
  doc.text('EXECUTIVE MARKET & PORTFOLIO REPORT', margin + 20, currentY + 50)

  const reportDate = new Date().toLocaleString()
  doc.setFontSize(9)
  doc.text(`Date: ${reportDate}`, pageWidth - margin - 20, currentY + 30, { align: 'right' })
  doc.text(`Currency: ${currency} (${CURRENCY_SYMBOLS[currency] || '$'})`, pageWidth - margin - 20, currentY + 46, { align: 'right' })

  currentY += 80

  // ── EXECUTIVE MARKET OVERVIEW ──
  doc.setTextColor(...darkTextColor)
  doc.setFont('Helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Executive Market Summary', margin, currentY)

  currentY += 12

  if (coins.length > 0) {
    const totalCap = coins.reduce((acc, c) => acc + (c.market_cap || 0), 0)
    const totalVol = coins.reduce((acc, c) => acc + (c.total_volume || 0), 0)
    const btcCoin = coins.find((c) => c.symbol?.toLowerCase() === 'btc')
    const btcCap = btcCoin?.market_cap || 0
    const btcDominance = totalCap > 0 ? (btcCap / totalCap) * 100 : 0

    const sortedByChange = [...coins].sort(
      (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    )
    const topGainer = sortedByChange[0]
    const topLoser = sortedByChange[sortedByChange.length - 1]

    const statsData = [
      ['Total Cryptocurrencies', `${coins.length} Assets`],
      ['Total Market Cap', fmtLarge(totalCap)],
      ['24H Global Trading Volume', fmtLarge(totalVol)],
      ['Bitcoin Dominance', `${btcDominance.toFixed(1)}%`],
      ['Top Gainer (24H)', topGainer ? `${topGainer.name} (${fmtPct(topGainer.price_change_percentage_24h)})` : '—'],
      ['Top Loser (24H)', topLoser ? `${topLoser.name} (${fmtPct(topLoser.price_change_percentage_24h)})` : '—'],
    ]

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Metric', 'Value']],
      body: statsData,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 200 } },
    })

    currentY = doc.lastAutoTable.finalY + 24
  }

  // ── WATCHLIST SECTION ──
  const watchlistedCoins = coins.filter((c) => watchlist.includes(c.id))
  if (watchlistedCoins.length > 0) {
    doc.setTextColor(...darkTextColor)
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Watchlist Holdings', margin, currentY)
    currentY += 10

    const watchlistRows = watchlistedCoins.map((c) => [
      `#${c.market_cap_rank || '—'}`,
      c.name,
      c.symbol?.toUpperCase(),
      fmtCurr(c.current_price, 4),
      fmtPct(c.price_change_percentage_24h),
      fmtLarge(c.market_cap),
    ])

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Rank', 'Coin Name', 'Symbol', `Price (${currency})`, '24H Change', `Market Cap (${currency})`]],
      body: watchlistRows,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
      },
    })

    currentY = doc.lastAutoTable.finalY + 24
  }

  // ── PORTFOLIO SECTION ──
  if (portfolio.length > 0) {
    // Check if we need a page break
    if (currentY > 650) {
      doc.addPage()
      currentY = 40
    }

    doc.setTextColor(...darkTextColor)
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Portfolio Holdings & Performance', margin, currentY)
    currentY += 10

    let totalValUSD = 0
    let totalPnlUSD = 0

    const portfolioRows = portfolio.map((item) => {
      const coin = coins.find((c) => c.id === item.coinId) || {
        name: item.coinId,
        symbol: item.coinId.slice(0, 4).toUpperCase(),
        current_price: 0,
        price_change_percentage_24h: 0,
      }

      const itemValUSD = (coin.current_price || 0) * item.quantity
      const itemPnlUSD = (itemValUSD * (coin.price_change_percentage_24h || 0)) / 100

      totalValUSD += itemValUSD
      totalPnlUSD += itemPnlUSD

      return [
        `${coin.name} (${coin.symbol?.toUpperCase()})`,
        item.quantity.toString(),
        fmtCurr(coin.current_price, 4),
        fmtCurr(itemValUSD),
        fmtPct(coin.price_change_percentage_24h),
        `${itemPnlUSD >= 0 ? '+' : ''}${fmtCurr(itemPnlUSD)}`,
      ]
    })

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Asset', 'Quantity', `Price (${currency})`, `Holding Value (${currency})`, '24H Change', `Est. 24H P&L (${currency})`]],
      body: portfolioRows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
      },
    })

    currentY = doc.lastAutoTable.finalY + 12

    // Summary Card Box for Portfolio
    doc.setFillColor(...cardBgColor)
    doc.rect(margin, currentY, pageWidth - margin * 2, 40, 'F')
    doc.setTextColor(...darkTextColor)
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(`Total Portfolio Value: ${fmtCurr(totalValUSD)}`, margin + 15, currentY + 24)
    doc.text(`Estimated 24H Profit/Loss: ${totalPnlUSD >= 0 ? '+' : ''}${fmtCurr(totalPnlUSD)}`, pageWidth - margin - 15, currentY + 24, { align: 'right' })

    currentY += 50
  }

  // ── FOOTER ON ALL PAGES ──
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...mutedTextColor)
    doc.text('Generated by CryptoVision Analytics Dashboard', margin, 820)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 820, { align: 'right' })
  }

  doc.save('CryptoVision_Report.pdf')
}

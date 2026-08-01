import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { formatLargeNumber, formatCurrency } from '../../utils/formatters'
import styles from './DashboardCharts.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function DashboardCharts({ coins = [] }) {
  const [activeTab, setActiveTab] = useState('bar')

  if (!coins || coins.length === 0) return null

  // 1. Bar Chart Data: Top 10 Coins by Market Cap
  const top10 = coins.slice(0, 10)
  const barData = {
    labels: top10.map((c) => c.symbol?.toUpperCase()),
    datasets: [
      {
        label: 'Market Cap (USD)',
        data: top10.map((c) => c.market_cap),
        backgroundColor: [
          '#1a6fff',
          '#7c3aed',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#06b6d4',
          '#8b5cf6',
          '#ec4899',
          '#14b8a6',
          '#64748b',
        ],
        borderRadius: 6,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` Market Cap: ${formatLargeNumber(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter, sans-serif' } },
      },
      y: {
        grid: { color: 'rgba(226, 232, 248, 0.6)' },
        ticks: {
          font: { family: 'Inter, sans-serif' },
          callback: (value) => formatLargeNumber(value),
        },
      },
    },
  }

  // 2. Doughnut Chart Data: Market Cap Distribution (Top 5 + Others)
  const top5 = coins.slice(0, 5)
  const totalMarketCap = coins.reduce((acc, c) => acc + (c.market_cap || 0), 0)
  const top5MarketCap = top5.reduce((acc, c) => acc + (c.market_cap || 0), 0)
  const othersMarketCap = Math.max(0, totalMarketCap - top5MarketCap)

  const doughnutData = {
    labels: [...top5.map((c) => c.name), 'Others'],
    datasets: [
      {
        data: [...top5.map((c) => c.market_cap), othersMarketCap],
        backgroundColor: ['#1a6fff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#cbd5e1'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { family: 'Inter, sans-serif', size: 12 },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw
            const pct = totalMarketCap > 0 ? ((val / totalMarketCap) * 100).toFixed(1) : 0
            return ` ${context.label}: ${formatLargeNumber(val)} (${pct}%)`
          },
        },
      },
    },
    cutout: '65%',
  }

  // 3. Line Chart Data: Top 10 Price Comparison / Trend
  const lineData = {
    labels: top10.map((c) => c.symbol?.toUpperCase()),
    datasets: [
      {
        label: 'Current Price (USD)',
        data: top10.map((c) => c.current_price),
        borderColor: '#1a6fff',
        backgroundColor: 'rgba(26, 111, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#1a6fff',
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` Price: ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        type: 'logarithmic',
        grid: { color: 'rgba(226, 232, 248, 0.6)' },
        ticks: {
          callback: (value) => formatCurrency(value, 0),
        },
      },
    },
  }

  return (
    <div className={styles.chartsContainer}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Market Analytics</h2>
          <p className={styles.subtitle}>Visual breakdown of market cap and asset metrics</p>
        </div>
        <div className={styles.tabs} role="tablist">
          <button
            className={`${styles.tab} ${activeTab === 'bar' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('bar')}
            role="tab"
            aria-selected={activeTab === 'bar'}
          >
            Market Cap
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'doughnut' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('doughnut')}
            role="tab"
            aria-selected={activeTab === 'doughnut'}
          >
            Distribution
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'line' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('line')}
            role="tab"
            aria-selected={activeTab === 'line'}
          >
            Price Overview
          </button>
        </div>
      </div>

      <div className={styles.chartCanvasArea}>
        {activeTab === 'bar' && (
          <div className={styles.chartBox}>
            <Bar data={barData} options={barOptions} />
          </div>
        )}
        {activeTab === 'doughnut' && (
          <div className={styles.chartBox}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        )}
        {activeTab === 'line' && (
          <div className={styles.chartBox}>
            <Line data={lineData} options={lineOptions} />
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(DashboardCharts)

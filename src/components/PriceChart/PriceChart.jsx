import React, { useRef, useEffect } from 'react'
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { formatDate, formatCurrency } from '../../utils/formatters'
import styles from './PriceChart.module.css'

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
)

const CHART_COLOR = 'rgba(26, 111, 255, 1)'
const CHART_FILL = 'rgba(26, 111, 255, 0.08)'

function PriceChart({ labels, prices, coinName }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !labels?.length || !prices?.length) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, canvasRef.current.offsetHeight || 320)
    gradient.addColorStop(0, 'rgba(26, 111, 255, 0.18)')
    gradient.addColorStop(1, 'rgba(26, 111, 255, 0)')

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(ts => formatDate(ts)),
        datasets: [
          {
            label: `${coinName} Price (USD)`,
            data: prices,
            borderColor: CHART_COLOR,
            backgroundColor: gradient,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: CHART_COLOR,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 3,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#0d1b3e',
            titleColor: '#8fa0c0',
            bodyColor: '#ffffff',
            borderColor: 'rgba(26, 111, 255, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (items) => {
                const ts = labels[items[0].dataIndex]
                return formatDate(ts, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              },
              label: (item) => ` ${formatCurrency(item.parsed.y, 6)}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: '#8fa0c0',
              font: { size: 11, family: 'Inter, sans-serif' },
              maxTicksLimit: 8,
              maxRotation: 0,
            },
          },
          y: {
            position: 'right',
            grid: {
              color: 'rgba(226, 232, 248, 0.6)',
              drawBorder: false,
            },
            border: {
              display: false,
              dash: [4, 4],
            },
            ticks: {
              color: '#8fa0c0',
              font: { size: 11, family: 'Inter, sans-serif' },
              maxTicksLimit: 6,
              callback: (value) => formatCurrency(value, 0),
            },
          },
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [labels, prices, coinName])

  return (
    <div className={styles.chartWrapper}>
      <canvas ref={canvasRef} aria-label={`7-day price chart for ${coinName}`} role="img" />
    </div>
  )
}

export default PriceChart

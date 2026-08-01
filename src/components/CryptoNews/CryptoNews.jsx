import React, { useState, useEffect } from 'react'
import { formatDate } from '../../utils/formatters'
import styles from './CryptoNews.module.css'

const NewsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
    <line x1="7" y1="8" x2="13" y2="8" />
    <line x1="7" y1="12" x2="13" y2="12" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const FALLBACK_NEWS = [
  {
    id: 1,
    title: 'Bitcoin Regains Momentum Above $64,000 as Institutional Inflows Surge',
    description: 'Bitcoin has reclaimed key technical resistance levels supported by heavy ETF inflows and renewed spot market accumulation.',
    source: 'CoinDesk',
    published_at: Date.now() - 3600000 * 2,
    url: 'https://coindesk.com',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Ethereum Layer-2 Network Activity Hits New All-Time Highs',
    description: 'Total value locked across Ethereum rollup protocols has surged, driven by lower transaction fees and decentralized finance volume.',
    source: 'CoinTelegraph',
    published_at: Date.now() - 3600000 * 5,
    url: 'https://cointelegraph.com',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Global Regulators Align on Standardized Digital Asset Frameworks',
    description: 'International financial bodies have published new guidelines aimed at promoting transparency and consumer protection in crypto markets.',
    source: 'Decrypt',
    published_at: Date.now() - 3600000 * 8,
    url: 'https://decrypt.co',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Solana Ecosystem Expands as Decentralized Exchange Volume Soars',
    description: 'Solana DEX trading volume reached milestone figures this week following high liquidity pool participation and new dApp launches.',
    source: 'The Block',
    published_at: Date.now() - 3600000 * 12,
    url: 'https://theblock.co',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'Crypto Staking Rewards Attract Traditional Wealth Managers',
    description: 'Yield-seeking institutional investors are increasingly allocating capital toward proof-of-stake network validation rewards.',
    source: 'Bloomberg Crypto',
    published_at: Date.now() - 3600000 * 16,
    url: 'https://bloomberg.com',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    title: 'Zero-Knowledge Proof Innovations Drive Web3 Privacy Solutions',
    description: 'Developers are rolling out ZK-rollup scaling solutions that enable secure, private verifiable computations for decentralized apps.',
    source: 'CryptoSlate',
    published_at: Date.now() - 3600000 * 20,
    url: 'https://cryptoslate.com',
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    title: 'Central Bank Digital Currency Tests Enter Next Phase in Asia',
    description: 'Multiple Asian monetary authorities have initiated cross-border retail CBDC settlement trials to increase remittance speed.',
    source: 'CoinDesk',
    published_at: Date.now() - 3600000 * 24,
    url: 'https://coindesk.com',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    title: 'DeFi Total Value Locked Surpasses $100 Billion Milestone',
    description: 'Automated market maker protocols and lending pools have recorded substantial growth as stablecoin liquidity expands globally.',
    source: 'DeFi Llama',
    published_at: Date.now() - 3600000 * 28,
    url: 'https://defillama.com',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    title: 'Crypto Mining Energy Efficiency Reaches Historic Benchmark',
    description: 'Sustainable energy usage across major Bitcoin mining facilities now accounts for over 60% of total network power consumption.',
    source: 'CoinTelegraph',
    published_at: Date.now() - 3600000 * 32,
    url: 'https://cointelegraph.com',
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    title: 'Decentralized Oracle Networks Boost Cross-Chain Data Interoperability',
    description: 'Chainlink and secondary data oracle providers are launching real-world asset price feeds for institutional smart contracts.',
    source: 'Decrypt',
    published_at: Date.now() - 3600000 * 36,
    url: 'https://decrypt.co',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
  },
]

function CryptoNews() {
  const [articles, setArticles] = useState(FALLBACK_NEWS)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBadge}>
          <NewsIcon />
        </div>
        <div>
          <h2 className={styles.title}>Latest Crypto News &amp; Headlines</h2>
          <p className={styles.subtitle}>Curated market insights and breaking Web3 news</p>
        </div>
      </div>

      <div className={styles.grid}>
        {articles.slice(0, 10).map((article) => (
          <div key={article.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={article.image}
                alt={article.title}
                className={styles.image}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=600&q=80'
                }}
              />
              <span className={styles.sourceBadge}>{article.source}</span>
            </div>

            <div className={styles.content}>
              <span className={styles.date}>{formatDate(article.published_at)}</span>
              <h3 className={styles.cardTitle}>{article.title}</h3>
              <p className={styles.description}>{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.readMoreBtn}
              >
                <span>Read Full Article</span>
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(CryptoNews)

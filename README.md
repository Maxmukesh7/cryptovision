# CryptoVision 🚀 | Cryptocurrency Analytics Dashboard

**CryptoVision** is a production-ready, high-performance Cryptocurrency Analytics Dashboard built with **React.js**, **Vite**, **Chart.js**, and **Vanilla CSS Modules**. It delivers real-time market data, macro statistics, interactive visual charts, customizable widget layouts, watchlist tracking, side-by-side asset comparison, and a portfolio simulator.

---

## 🌟 Key Features

### 📊 1. Market Intelligence & Global Stats
- **Macro Market Overview:** Global Market Cap, 24H Trading Volume, Bitcoin Dominance (%), Ethereum Dominance (%), Active Cryptocurrencies, and Exchange counts.
- **Six Top Analytics Cards:** Instant visibility into Total Cryptos, Global Market Cap, Global Volume, BTC Dominance, 24H Top Gainer, and 24H Top Loser.
- **Top 10 Trending Coins:** Real-time momentum ranking based on volume and price volatility.
- **Market Sentiment Gauge:** Fear & Greed community sentiment meter with Bullish/Bearish percentage breakdown.

### 📈 2. Interactive Charts & Data Visualization
- **Bar Chart:** Market Cap breakdown across top 10 cryptocurrencies.
- **Doughnut Chart:** Market Cap distribution showing Top 5 assets + "Others" allocation.
- **Line Chart:** Logarithmic price trend comparison over key market leaders.
- **7-Day Coin History:** Interactive price action chart powered by Chart.js.

### 🔍 3. Advanced Search, Filtering & Sorting
- **Instant Search:** Search assets by name or symbol with recent search history memory (`localStorage`).
- **Column Header Sorting:** Sort table rows by Market Cap, Price, 24H Change, or Alphabetical (Ascending/Descending).
- **Limit Selectors:** View Top 10, Top 25, Top 50, or Top 100 cryptocurrencies.

### ⭐️ 4. Watchlist & Favorites
- Bookmark favorite cryptocurrencies with star toggles.
- Dedicated `/watchlist` page with instant persistence and empty state fallbacks.

### ⚔️ 5. Side-by-Side Asset Comparison (`/compare`)
- Compare any two cryptocurrencies across Price, Market Cap, 24H Volume, Rank, 24H Change, and Supply metrics with automatic **Leader** highlights.

### 💼 6. Portfolio Simulator (`/portfolio`)
- Enter holdings quantity for any asset.
- Live calculation of **Total Balance ($)**, **Total 24H Profit/Loss ($ & %)**, and individual asset holdings value.

### 🌗 7. Light / Dark Mode & Customization
- **Theme Switcher:** Navbar toggle switching between Light and Dark mode (`[data-theme='dark']`).
- **Custom Dashboard Layout:** Show or hide any dashboard widget (Global Stats, Trending, Sentiment, Charts, Table, News).
- **Export Data:** Download Watchlist and Portfolio data in `.csv` or `.json` formats.

---

## 🛠️ Tech Stack

- **Core:** React 18, Vite
- **Routing:** React Router DOM v6 (Client-side SPA with `React.lazy` code splitting)
- **HTTP Client:** Axios with timeout configurations and multi-tier API fallbacks
- **Data Visualization:** Chart.js, React-ChartJS-2
- **Styling:** Modular CSS Modules, CSS Custom Properties (Variables)
- **State Management:** React Context API (`AppProvider`), custom hooks (`useCoins`, `useCoinDetails`, `useAutoRefresh`)
- **Persistence:** LocalStorage API (`cv_theme`, `cv_watchlist`, `cv_portfolio`, `cv_search_history`, `cv_dashboard_layout`)

---

## 📁 Project Structure

```
cryptovision/
├── public/
│   ├── favicon.svg
│   └── _redirects              # Netlify SPA route fallback
├── src/
│   ├── assets/                 # SVGs and static brand assets
│   ├── components/
│   │   ├── CoinTable/          # Searchable, sortable crypto table with Star toggles
│   │   ├── CryptoNews/         # 10 latest Web3 news cards with source badges
│   │   ├── DashboardCard/      # Analytics stat cards
│   │   ├── DashboardCharts/    # Bar, Doughnut, Line Chart.js components
│   │   ├── DashboardCustomizer/# Widget visibility popover
│   │   ├── ErrorBoundary/      # Class-based React Error Boundary
│   │   ├── ErrorState/         # Friendly API error UI with retry action
│   │   ├── GlobalOverview/     # Macro market stats section
│   │   ├── Layout/             # Main layout with Navbar, Sidebar, Content outlet
│   │   ├── Loader/             # Animated loader
│   │   ├── MarketSentiment/    # Sentiment gauge & quick market highlights
│   │   ├── Navbar/             # Header bar with Brand, Search, Theme toggle
│   │   ├── PriceChart/         # 7-day detail price chart
│   │   ├── Sidebar/            # Collapsible navigation sidebar
│   │   ├── Skeleton/           # Shimmer skeleton loaders for cards, table, charts
│   │   ├── Toast/              # Floating toast notification system
│   │   └── TopMovers/          # Top 5 Gainers & Top 5 Losers split cards
│   ├── context/
│   │   └── AppContext.jsx      # Global state for theme, watchlist, portfolio, toasts
│   ├── hooks/
│   │   ├── useAutoRefresh.js   # 60s background data poller with cleanup locks
│   │   ├── useCoinDetails.js   # Coin detail & chart fetcher
│   │   └── useCoins.js         # Top 100 coins fetcher
│   ├── pages/
│   │   ├── CoinDetails/        # Dynamic coin detail view (/coin/:id)
│   │   ├── Compare/            # Side-by-side asset comparison (/compare)
│   │   ├── Dashboard/          # Main analytics platform (/)
│   │   ├── NotFound/           # Animated 404 page
│   │   ├── Portfolio/          # Portfolio simulator (/portfolio)
│   │   ├── Settings/           # Preferences, theme, currency, exports (/settings)
│   │   └── Watchlist/          # Bookmarked coins table (/watchlist)
│   ├── services/
│   │   └── cryptoApi.js        # Multi-tiered API service (CoinPaprika + Fallbacks + Cache)
│   ├── styles/
│   │   └── global.css          # CSS Variables for Light & Dark mode
│   ├── utils/
│   │   ├── cache.js            # 60s TTL LocalStorage caching module
│   │   └── formatters.js       # Currency, percentage, large number formatters
│   ├── App.jsx                 # App routes with Suspense & ErrorBoundary
│   └── main.jsx
├── vercel.json                 # Vercel SPA route rewrite
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/cryptovision.git
   cd cryptovision
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🚀 Deployment Instructions

### Deploy to Vercel
1. Push code to GitHub.
2. Import repository in Vercel.
3. Vercel automatically detects Vite. Build command: `npm run build`, Output directory: `dist`.
4. `vercel.json` included in root handles SPA route rewrites automatically.

### Deploy to Netlify
1. Import repository in Netlify.
2. Build command: `npm run build`, Publish directory: `dist`.
3. `public/_redirects` handles SPA client-side routing.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

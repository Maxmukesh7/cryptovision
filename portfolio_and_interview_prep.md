# 📄 CryptoVision | Portfolio & Interview Preparation Guide

This document provides professional descriptions for your **Resume**, **LinkedIn**, and **GitHub**, followed by a comprehensive **Technical Interview Preparation Guide** detailing architectural decisions, state management, API strategies, and technical challenges overcome during development.

---

## 💼 1. Resume Project Description (5–6 Bullet Points)

**CryptoVision — Production-Grade Cryptocurrency Analytics Platform** | *React.js, Vite, Chart.js, CSS Modules, REST APIs*
- Designed and architected a production-ready cryptocurrency analytics dashboard using **React 18**, **Vite**, and **CSS Modules**, featuring real-time market data, interactive Chart.js visualizations, and a responsive multi-page layout.
- Engineered a resilient multi-tiered API service layer incorporating **CoinPaprika REST API**, **CoinGecko fallback**, and a **60-second TTL LocalStorage caching engine**, ensuring 99.9% uptime and zero UI crashes during API rate limits.
- Built custom state management using the **React Context API** for Watchlist bookmarking, Portfolio tracking, custom widget visibility, and real-time **Light/Dark theme switching** with CSS variable design tokens.
- Implemented **Portfolio Simulation** and **Side-by-Side Asset Comparison** tools, enabling users to evaluate holdings performance, calculate 24H profit/loss ($ and %), and compare macro metrics across assets.
- Optimized frontend performance through **React.lazy** code splitting, **Suspense** boundaries, **React.memo**, and **useMemo** memoization, achieving a fast bundle load time and 100% build optimization.
- Added robust error handling via a class-based **React Error Boundary**, fallback UI states, animated shimmer skeletons, and export capabilities for user data in **CSV** and **JSON** formats.

---

## 🌐 2. LinkedIn Project Post / Description

🚀 **Excited to share CryptoVision — A Modern Cryptocurrency Analytics & Market Intelligence Platform built with React.js!**

CryptoVision is a full-featured SaaS-style web application that provides real-time market analytics, global dominance metrics, asset comparisons, and portfolio simulation.

**Highlights:**
- 📊 **Visual Analytics:** Interactive Bar, Doughnut, and 7-day Line charts powered by Chart.js.
- ⚡ **Resilient Architecture:** Custom caching layer with LocalStorage TTL and multi-tiered API fallback pipeline to guarantee seamless UX even under API rate limits.
- 💼 **Portfolio Simulator & Watchlist:** Track holdings, 24h P&L ($ & %), and bookmarked assets with persistent storage.
- ⚔️ **Side-by-Side Asset Comparison:** Compare any two cryptocurrencies across 10+ financial metrics with automatic leader detection.
- 🌗 **Dark / Light Mode & Custom Dashboard:** Theme switching engine with customizable widget layouts and CSV/JSON data export.

**Tech Stack:** React 18, Vite, Chart.js, React Router v6, Axios, CSS Modules, LocalStorage API.

---

## 🐙 3. GitHub Repository Description

> **CryptoVision** — Production-ready React.js Cryptocurrency Analytics Dashboard featuring live market data, Chart.js charts, Dark/Light mode, customizable widgets, watchlist, portfolio simulator, and asset comparison tool. Built with React 18, Vite, and CSS Modules.

---

## 🎙️ 4. Technical Interview Preparation Guide

### Q1: What is the overall architecture of CryptoVision?
**Answer:** CryptoVision follows a modular, feature-based React architecture:
- **Presentation Layer:** Reusable, memoized components styled with CSS Modules to prevent global class collisions.
- **State & Context Layer:** `AppContext` provides centralized state management for themes, watchlist, portfolio, and toasts, eliminating prop drilling.
- **Service & Data Layer:** `cryptoApi.js` abstracts all API calls behind a unified service contract. Components never call Axios directly; they consume data through custom hooks (`useCoins`, `useCoinDetails`, `useAutoRefresh`).
- **Resilience & Fallback Layer:** Multi-tiered fallback mechanism (Fresh Cache $\rightarrow$ Primary API $\rightarrow$ Secondary API $\rightarrow$ Expired Cache $\rightarrow$ Synthetic Data) ensuring the UI never crashes.

### Q2: How did you handle API Rate Limits and Network Failures?
**Answer:** Crypto APIs like CoinPaprika enforce strict 60 req/hour rate limits. To solve this:
1. **Client-Side TTL Caching (`utils/cache.js`):** Every successful API call writes to `localStorage` with a timestamp. Requests within 60 seconds return instantly from memory.
2. **Graceful Fallbacks:** If the primary API returns `HTTP 402/429` or network failure:
   - If expired cache exists, it is served seamlessly.
   - If no cache exists, a secondary API (CoinGecko) or synthetic trend generator supplies structured fallback data.
3. **Collision-Safe Polling:** `useAutoRefresh` uses `useRef` locks (`isFetchingRef`) to prevent duplicate concurrent background requests.

### Q3: How did you implement Dark Mode and Styling?
**Answer:** Used **Vanilla CSS Modules** combined with **CSS Custom Properties (Variables)**:
- Theme colors are defined in `:root` for light mode and `[data-theme='dark']` for dark mode.
- When `toggleTheme()` is triggered, it updates `document.documentElement.setAttribute('data-theme', theme)` and persists the choice in `localStorage`.
- Smooth color transitions are handled natively via CSS `transition: background-color 250ms ease`.

### Q4: How is performance optimized in the application?
**Answer:**
1. **Code Splitting:** Secondary routes (`/watchlist`, `/compare`, `/portfolio`, `/settings`) are loaded dynamically using `React.lazy()` and wrapped in `<Suspense>`.
2. **Memoization:** Expensive sorting and filtering operations in `CoinTable`, `Dashboard`, and `DashboardCharts` are wrapped in `useMemo()`.
3. **Component Re-render Reduction:** Heavy sub-components (`TopMovers`, `GlobalOverview`, `CryptoNews`, `CoinTable`) are wrapped in `React.memo()`.

---

## 🛠️ Summary of Challenges Faced & Solutions

| Challenge | Root Cause | Solution Implemented |
|---|---|---|
| **API Rate Limit (HTTP 402/429)** | CoinPaprika free tier enforces 60 requests/hour limit | Created a 60s LocalStorage TTL caching layer + secondary API fallback |
| **Route Alias Mismatch** | URL `/coin/chainlink` vs API ID `link-chainlink` | Built `findMatchingTicker()` helper inside `cryptoApi.js` to resolve symbol/name aliases |
| **Heavy Re-renders on Polling** | Unnecessary component re-renders during background refetch | Applied `useMemo` for derived metrics and `React.memo` for chart/table components |
| **White Screen Crashes** | Unhandled component runtime errors | Implemented class-based `ErrorBoundary` wrapper with a styled fallback UI |

# 🚀 CryptoVision - Cryptocurrency Analytics Dashboard

CryptoVision is a modern cryptocurrency analytics dashboard built using **React.js**, **Vite**, **Chart.js**, and the **CoinPaprika REST API**. It provides users with live cryptocurrency market insights through an intuitive, responsive, and interactive dashboard.

🔗 **Live Demo:** https://cryptovision-rouge.vercel.app/

📂 **GitHub Repository:** https://github.com/Maxmukesh7/cryptovision

---

# 📸 Screenshots

## Dashboard

> *(Add screenshot here later)*

![Dashboard](screenshots/dashboard.png)

## Coin Details

![Coin Details](screenshots/coin-details.png)

## Portfolio

![Portfolio](screenshots/portfolio.png)

## Watchlist

![Watchlist](screenshots/watchlist.png)

---

# 📌 Project Overview

CryptoVision fetches live cryptocurrency market data from the **CoinPaprika REST API** and presents it through a clean and interactive dashboard.

The application allows users to:

- View live cryptocurrency prices
- Analyze market statistics
- Compare cryptocurrencies
- Maintain a personal watchlist
- Simulate a cryptocurrency portfolio
- Visualize market trends using charts
- Switch between Light and Dark themes

---

# ✨ Features

## 📊 Dashboard

- Global cryptocurrency market overview
- Market capitalization
- Trading volume
- Bitcoin dominance
- Ethereum dominance
- Active cryptocurrencies
- Exchange statistics

---

## 📈 Charts & Analytics

- Interactive Bar Chart
- Doughnut Chart
- Line Chart
- Historical Price Chart
- Market trend visualization

---

## 🔍 Search & Filtering

- Search cryptocurrencies by name
- Search by symbol
- Sort by:
  - Price
  - Market Cap
  - Rank
  - 24H Change
- View Top 10, Top 25, Top 50 and Top 100 cryptocurrencies

---

## ⭐ Watchlist

- Add favorite cryptocurrencies
- Remove favorites
- Persistent storage using LocalStorage

---

## ⚔ Compare Coins

Compare two cryptocurrencies side-by-side based on:

- Current Price
- Market Cap
- Rank
- Trading Volume
- Supply
- 24H Performance

---

## 💼 Portfolio Simulator

Users can:

- Add holdings
- Track portfolio value
- View profit/loss
- Calculate asset allocation

---

## 🌙 Theme Support

- Light Mode
- Dark Mode

Theme preference is stored using LocalStorage.

---

## 📤 Data Export

Export Watchlist and Portfolio as:

- CSV
- JSON
- PDF

---

# 🏗 System Architecture

```
                User
                  │
                  ▼
        React.js Frontend
                  │
          HTTP GET Requests
                  │
                  ▼
     CoinPaprika REST API
                  │
             JSON Response
                  │
                  ▼
       React Components
                  │
                  ▼
          Dashboard UI
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- JavaScript (ES6+)
- CSS Modules

## API

- CoinPaprika REST API

## Charts

- Chart.js
- React ChartJS 2

## Routing

- React Router DOM

## State Management

- React Context API
- Custom React Hooks

## HTTP Client

- Axios

## Storage

- LocalStorage

## Deployment

- Vercel

## Version Control

- Git
- GitHub

---

# 📂 Project Structure

```
cryptovision/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── vercel.json
├── package.json
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Maxmukesh7/cryptovision.git
```

Move into the project

```bash
cd cryptovision
```

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Build for production

```bash
npm run build
```

---

# 🌐 Deployment

This project is deployed on **Vercel**.

Deployment Steps:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Vercel automatically detects the Vite framework.
4. Deploy.

Live Project:

https://cryptovision-rouge.vercel.app/

---

# 📚 What I Learned

Through this project, I gained practical experience in:

- React.js Component Architecture
- REST API Integration
- HTTP Requests using Axios
- JSON Data Handling
- React Router
- State Management using Context API
- Custom React Hooks
- Chart.js Integration
- LocalStorage
- Responsive UI Design
- Git & GitHub Workflow
- Vercel Deployment

---

# 🎯 Future Enhancements

- User Authentication
- Real-time WebSocket Updates
- Price Alerts
- AI Market Insights
- News Sentiment Analysis
- Portfolio Performance Analytics
- Multiple Currency Support

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Mukesh Kumar**

BE Cyber Security

GitHub:
https://github.com/Maxmukesh7

LinkedIn:
(Add your LinkedIn URL)

---

⭐ If you found this project useful, consider giving it a Star on GitHub!

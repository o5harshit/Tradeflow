# TradeFlow – Real-Time Stock Market Simulation Platform

TradeFlow is a full-stack stock market simulation platform designed to provide real-time market monitoring and historical price analysis. It consumes simulated market data, processes live price updates, stores historical market information, and visualizes stock movements through interactive candlestick charts.

The project focuses on building a real-time data pipeline using **Node.js, Express.js, Redis, WebSockets, and MongoDB**.

> 🚧 **Project Status: Under Active Development**
>
> The initial market data module has been implemented. I am currently working on additional trading features, system improvements, and production readiness. More features will be shipped in upcoming releases.

---

## Features Implemented

### 1. Live Market Data Integration
- Integrated CuckooTrade as a simulated market data provider.
- Consume continuous stock price updates using Server-Sent Events (SSE).
- Normalize incoming market ticks into a consistent data structure.
- Currently supports instruments such as AAPL and CUCKOO.

### 2. Market Dashboard
- Interactive market dashboard built with Next.js and React.
- Display available instruments and their latest prices.
- Search instruments by symbol, company name, or exchange.
- Display price movements and percentage changes.
- Monitor live market connection status.

### 3. Individual Stock Details
- Dedicated dynamic pages for individual instruments.
- Display current simulated price and instrument information.
- Show price movement since the initial connection.
- Display the latest market update timestamp.

### 4. Redis Caching and Pub/Sub
- Use Redis Hashes to maintain the latest market prices.
- Implement Redis Pub/Sub to distribute incoming price updates.
- Separate Redis publisher and subscriber connections.
- Reduce repeated database reads for frequently accessed latest prices.

### 5. Real-Time Communication with WebSockets
- Implemented a WebSocket server using the `ws` library.
- Broadcast live market price updates to connected clients.
- Send initial cached prices when a client connects.
- Handle client disconnections and reconnect attempts on the frontend.

### 6. Historical Market Data Storage
- Store historical market data in MongoDB using Mongoose.
- Implement OHLC (Open, High, Low, Close) candlestick generation.
- Maintain one-minute market candles.
- Update existing candles as new price ticks arrive.
- Use compound indexing for symbol, interval, and timestamp.

### 7. Interactive Candlestick Charts
- Integrated Lightweight Charts for financial data visualization.
- Fetch historical market candles through Express REST APIs.
- Display historical price movements.
- Update the current candlestick using incoming WebSocket price updates.

### 8. Multiple Chart Timeframes
- Support multiple chart intervals:
  - 1 Minute (1m)
  - 5 Minutes (5m)
  - 15 Minutes (15m)
  - 1 Hour (1h)
  - 1 Day (1d)
- Use MongoDB aggregation pipelines to generate larger timeframes from stored one-minute candles.
- Allow users to switch between chart intervals.

---

## System Architecture

TradeFlow follows a modular full-stack architecture with separate frontend and backend applications.

```text
                 CuckooTrade
               (Simulated Feed)
                      |
                      | SSE
                      v
              CuckooTrade Provider
                      |
                      v
                Market Service
                      |
          +-----------+-----------+
          |                       |
          v                       v
       Redis                   MongoDB
   Latest Prices             OHLC Candles
          |
          v
     Redis Pub/Sub
          |
          v
    WebSocket Server
          |
          v
     Next.js Frontend
          |
          v
   Live Market Dashboard
          |
          v
   Individual Stock Pages
          |
          v
   Historical Candlestick Charts
```

### Market Data Flow

1. CuckooTrade provides simulated market prices through an SSE stream.
2. The backend provider reads and normalizes incoming price ticks.
3. The Market Service processes each tick.
4. Redis stores the latest price for each instrument.
5. Redis Pub/Sub publishes the new price update.
6. The WebSocket server receives the published message.
7. Connected frontend clients receive the price update.
8. React updates the market dashboard and stock details.
9. The candle service stores and updates historical OHLC records in MongoDB.
10. The historical chart API retrieves and aggregates candle data for visualization.

### Historical Chart Data Flow

1. The frontend requests historical data through an Express API.
2. The market controller queries MongoDB.
3. MongoDB aggregation combines one-minute candles into the requested timeframe.
4. The API returns the historical candle data.
5. Lightweight Charts renders the data in the frontend.

---

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Caching | Redis |
| Messaging | Redis Pub/Sub |
| Real-Time Communication | WebSocket (`ws`) |
| Market Data | CuckooTrade SSE |
| Charts | Lightweight Charts |
| API Communication | REST APIs, WebSocket |

---

## Project Structure

```text
TradeFlow/
│
├── apps/
│   │
│   ├── api/
│   │   ├── index.js
│   │   │
│   │   └── src/
│   │       ├── config/
│   │       │   ├── database.js
│   │       │   └── redis.js
│   │       │
│   │       ├── controllers/
│   │       │   └── market.controller.js
│   │       │
│   │       ├── models/
│   │       │   └── MarketCandle.js
│   │       │
│   │       ├── routes/
│   │       │   └── market.routes.js
│   │       │
│   │       └── services/
│   │           └── market/
│   │               ├── cuckooTrade.provider.js
│   │               ├── market.service.js
│   │               └── candle.service.js
│   │
│   └── web/
│       └── src/
│           ├── app/
│           │   └── dashboard/
│           │       └── markets/
│           │           ├── page.js
│           │           └── [symbol]/
│           │               └── page.js
│           │
│           └── components/
│               └── market/
│                   ├── MarketDashboard.jsx
│                   ├── StockDetails.jsx
│                   └── CandleChart.jsx
│
└── README.md
```

*Note: This shows the main market module files; other application files are omitted for readability.*

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB (local installation or Atlas)
- Redis (local installation or hosted instance)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/o5harshit/Tradeflow.git

cd Tradeflow
```

### 2. Backend Setup

```bash
cd apps/api

npm install
```

Configure your backend environment variables in the `.env` file.

Example configuration:

```env
PORT=5173

MONGO_URI=your_mongodb_connection_string

REDIS_URL=redis://localhost:6379

CLIENT_URL=http://localhost:3000
```

Use the exact environment variable names expected by your backend configuration.

Start the backend using the development script configured in `apps/api/package.json`.

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd apps/web

npm install
```

Create the frontend `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5173
```

Start the frontend:

```bash
npm run dev
```

### 4. Open TradeFlow

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5173
```

Market Dashboard:

```text
http://localhost:3000/dashboard/markets
```

---

## API Endpoints

### Market Data

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/market/prices` | Retrieve latest market prices |
| GET | `/api/market/:symbol/history?interval=1m` | Retrieve historical candles |

Supported historical intervals:

```text
1m
5m
15m
1h
1d
```

Example:

```http
GET /api/market/AAPL/history?interval=5m&limit=100
```

### WebSocket

Connect to:

```text
ws://localhost:5173
```

Message types:

| Message | Purpose |
|---|---|
| `INITIAL_PRICES` | Sends cached prices when a client connects |
| `PRICE_UPDATE` | Sends incoming live market price updates |

---

## Important Notes

- TradeFlow currently uses simulated market data from CuckooTrade.
- These prices are not official exchange quotes or guaranteed real-time exchange prices.
- MongoDB is the persistent database for historical market data.
- Redis is used for caching and Pub/Sub.
- Redis Pub/Sub is used for live message distribution, not durable event storage.
- Historical data is collected from the time candle storage is enabled; older market history is not automatically available.
- Daily candles currently use UTC time boundaries.

---

## Upcoming Features & Roadmap

The project is actively being developed. The following features are planned or under development:

- [ ] Buy and Sell order placement.
- [ ] Order validation and order management.
- [ ] Matching Engine for simulated trade execution.
- [ ] Portfolio management and holdings tracking.
- [ ] Kafka-based event-driven communication.
- [ ] Real-time trade and order notifications.
- [ ] Improved authentication and authorization.
- [ ] API rate limiting and additional security measures.
- [ ] Docker-based containerization.
- [ ] CI/CD pipeline integration.
- [ ] AWS deployment, monitoring, and production infrastructure.

> I am continuously improving TradeFlow, focusing on building a reliable trading workflow, strengthening the backend architecture, and preparing the application for a production release. These features will be shipped incrementally as they are completed and tested.

---

## Author

**Harshit Srivastava**

Full Stack Developer | Backend Development Enthusiast

- GitHub: [@o5harshit](https://github.com/o5harshit)
- Project Repository: [TradeFlow](https://github.com/o5harshit/Tradeflow)

---

**TradeFlow — Building a real-time market simulation platform, one feature at a time.**

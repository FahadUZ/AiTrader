# AI Trading Signal Terminal for XAU/USD & BTC/USD

## Overview

This is a professional AI-powered trading terminal that generates and displays real-time trading signals for Gold (XAU/USD) and Bitcoin (BTC/USD) markets. The application provides traders with precise entry points, stop-loss levels, and multiple take-profit targets, along with comprehensive technical analysis across multiple timeframes.

The system uses OpenAI's API to analyze market data and generate intelligent trading signals based on technical indicators including RSI, MACD, EMA, Bollinger Bands, and Stochastic oscillators. Real-time price data is fetched from Binance's API, with WebSocket connections providing live updates to connected clients.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data caching

**UI Framework & Styling**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design system inspired by professional trading terminals (TradingView, Bloomberg)
- Custom color system for trading-specific states (buy/sell signals, profit/loss indicators)
- Dark mode support with theme persistence via localStorage

**State Management**
- React Query for server state, with infinite stale time for price data
- React Context API for theme management
- WebSocket hook (`useWebSocket`) for real-time data streaming
- Local component state for UI interactions

**Key Design Principles**
- Information density prioritized over aesthetics (trading terminal approach)
- High-contrast color coding for instant signal recognition
- Monospace fonts for numerical data (prices, indicators)
- Responsive grid layouts: 60/40 split on desktop, stacked on mobile

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routes
- Node.js with ES modules (type: "module")
- TypeScript for type safety across the entire stack
- WebSocket Server (ws library) for real-time bidirectional communication

**API Structure**
- RESTful endpoints for market data:
  - `/api/price/:market` - Current price data for XAU/USD or BTC/USD
  - `/api/candles/:market` - Historical candlestick data with configurable intervals
  - `/api/indicators/:market` - Technical indicator calculations
  - `/api/analysis/:market` - Multi-timeframe analysis results
- WebSocket endpoint at `/ws` for real-time price updates and signal notifications

**Service Layer Architecture**
- `marketDataService` - Fetches live prices and candles from Binance API, implements caching
- `indicatorsService` - Calculates technical indicators using the technicalindicators library
- `aiSignalGenerator` - Uses OpenAI API to generate trading signals based on market analysis
- `TradingWebSocketServer` - Manages WebSocket connections and broadcasts updates

**Data Flow**
1. Market data fetched from Binance API every few seconds
2. Technical indicators calculated from candlestick data
3. AI service analyzes indicators and generates signals when confidence threshold met (>65%)
4. Signals and price updates broadcast to all connected clients via WebSocket
5. Frontend updates UI reactively through React Query invalidation

### Data Storage Solutions

**Current Implementation: In-Memory Storage**
- `MemStorage` class implements `IStorage` interface
- Uses JavaScript Map structures for users and signals
- No persistence - data lost on server restart
- Suitable for development and MVP demonstration

**Schema Design (Drizzle ORM)**
- PostgreSQL schema defined in `shared/schema.ts`
- Users table with username/password authentication
- Signal generation history tracking (planned)
- Drizzle configuration points to PostgreSQL via `DATABASE_URL` environment variable
- Migration support via `drizzle-kit` (run with `npm run db:push`)

**Data Models**
- `PriceData` - Market price with 24h high/low, change percentage
- `Signal` - Trading signal with direction, entry, stop-loss, multiple TP levels, confidence score
- `TechnicalIndicator` - Indicator name, value, and signal interpretation
- `TimeframeAnalysis` - Multi-timeframe trend analysis

**Future Database Integration**
- Neon serverless PostgreSQL configured via `@neondatabase/serverless`
- Replace `MemStorage` with database-backed implementation
- Persist signal history, user preferences, and performance tracking

### Authentication & Authorization

**Current State: Minimal Authentication**
- User schema defined with username/password fields
- No active authentication implemented in routes
- Session management dependency installed (`connect-pg-simple`)
- Ready for authentication layer addition

**Planned Authentication Flow**
- Session-based authentication with PostgreSQL session store
- Password hashing (bcrypt or argon2)
- Protected WebSocket connections
- User-specific signal history and preferences

### External Dependencies

**Market Data APIs**
- **Binance Public API** - Primary source for BTC/USD and XAU/USD (via PAXG proxy) price data
  - Endpoints: `/api/v3/ticker/24hr` for price, `/api/v3/klines` for candlestick data
  - No authentication required for public endpoints
  - Rate limits apply but not currently enforced in code
- **Twelve Data API** - Configured but not actively used (API key in environment variable)
  - Backup option for financial data if Binance unavailable

**AI Services**
- **OpenAI API** - GPT model for signal generation
  - Analyzes technical indicators, price movements, support/resistance
  - Generates structured JSON responses with entry/SL/TP levels
  - Returns null when no clear signal (confidence < 65%)
  - API key required via `OPENAI_API_KEY` environment variable

**Technical Analysis Libraries**
- **technicalindicators** npm package - Pure JavaScript implementations of:
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - EMA (Exponential Moving Average)
  - Bollinger Bands
  - Stochastic Oscillator

**Database (Configured, Not Active)**
- **Neon Serverless PostgreSQL** - Cloud-native Postgres
  - Connection via `@neondatabase/serverless` adapter
  - Drizzle ORM for schema management and queries
  - `DATABASE_URL` environment variable for connection string

**Development & Deployment**
- **Replit-specific plugins** - Development tooling
  - Runtime error overlay for debugging
  - Cartographer for code navigation
  - Dev banner for environment awareness

**UI Component Libraries**
- **Radix UI** - Headless component primitives (dialogs, dropdowns, tooltips, etc.)
  - Provides accessibility and keyboard navigation
  - All styling handled via Tailwind CSS
- **Lucide React** - Icon library for UI elements
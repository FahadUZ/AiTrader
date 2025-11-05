# Design Guidelines: AI Trading Signal Terminal for XAU/USD & BTC/USD

## Design Approach: Professional Trading Terminal System

**Selected Approach**: Design System (Utility-Focused)
**Primary Reference**: TradingView and Bloomberg Terminal design patterns
**Rationale**: Trading platforms demand clarity, information density, and instant comprehension. Visual appeal is secondary to functionality, speed of data consumption, and decision-making efficiency.

**Key Design Principles**:
- Information hierarchy optimized for split-second decision-making
- High-density layouts without clutter
- Professional financial interface standards
- Real-time data visualization clarity
- Critical data prominence (Entry/SL/TP levels)

---

## Typography System

**Font Family**: 
- Primary: 'Inter' or 'IBM Plex Sans' (exceptional legibility for numbers and data)
- Monospace: 'JetBrains Mono' or 'Roboto Mono' (for prices, numerical data)

**Type Scale**:
- Hero Numbers (Price Display): text-4xl to text-6xl, font-bold, monospace
- Signal Cards Title: text-lg, font-semibold
- Entry/SL/TP Labels: text-sm, font-medium, uppercase, tracking-wide
- Price Values: text-base to text-lg, monospace, font-medium
- Technical Indicators: text-sm, font-normal
- Timestamps/Metadata: text-xs, font-normal
- R:R Ratios: text-sm, font-bold

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 3, 4, 6, and 8
- Component padding: p-4, p-6
- Card spacing: gap-4, space-y-4
- Section margins: mb-6, mb-8
- Inline elements: gap-2, gap-3
- Dense data rows: py-2, gap-2

**Grid Structure**:
- Desktop: Two-column layout (60/40 split) - Left: Charts, Right: Signal Feed & Indicators
- Tablet: Stacked single column with priority given to active signals
- Mobile: Full-width stacked, collapsible sections

**Container Strategy**:
- Full-width application (no max-width constraint)
- Edge-to-edge panels with internal padding (px-4 to px-6)
- No centered containers - utilize full viewport

---

## Component Library

### A. Navigation & Header
**Top Navigation Bar** (h-14 to h-16):
- Logo/branding (left)
- Market pair selector tabs (XAU/USD | BTC/USD) - prominent, easily switchable
- Timeframe selector (1m, 5m, 15m, 30m, 1h) - pill-style toggles
- Connection status indicator (Live/Delayed badge)
- AI confidence meter (circular progress indicator)

### B. Price Display Panel
**Large Price Cards** (one per market):
- Current price (text-5xl, monospace, dominant placement)
- Price change (+/- value and percentage in smaller text)
- 24h High/Low range bar visualization
- Last update timestamp
- Mini sparkline chart (simplified price movement)

### C. Signal Cards (Primary Component)
**Structure** (border, rounded-lg, p-6):
- Header: Direction badge (BUY/SELL), Signal strength (0-100%), Timestamp
- Entry Section:
  - Label: "ENTRY PRICE"
  - Value: Large monospace number
  - Current vs Entry comparison (distance in pips/points, percentage)
- Stop Loss Section:
  - Label: "STOP LOSS (SL)"
  - Value: Price level
  - Distance indicator from entry
- Take Profit Levels:
  - TP1, TP2, TP3 displayed as horizontal progression
  - Each TP shows: Price level, pip distance, cumulative R:R ratio
- Risk/Reward Summary:
  - Overall R:R ratio (e.g., "1:3.5")
  - Potential profit/loss in points
- AI Reasoning (collapsible):
  - Brief analysis text (2-3 sentences)
  - Supporting indicators list

### D. Chart Component
**Candlestick Chart** (h-96 on desktop, h-64 on mobile):
- Live candlestick rendering
- Entry/SL/TP lines overlaid as horizontal markers
- Volume bars beneath price action
- Clean grid lines (subtle)
- Zoom/pan controls (minimal UI)
- Timeframe switcher integrated

### E. Technical Indicators Panel
**Indicator Grid** (grid-cols-2 on desktop):
- Each indicator card shows:
  - Indicator name (RSI, MACD, etc.)
  - Current value (large, monospace)
  - Signal interpretation ("Oversold", "Bullish Cross", etc.)
  - Mini trend line or bar visualization
  - Percentage or value change

### F. Active Signals Feed
**Vertical scrollable list**:
- Most recent signals at top
- Compact signal cards (simplified version of main signal card)
- Status badges: "Active", "Hit TP1", "Stopped Out", "Pending"
- Click to expand full signal details

### G. Multi-Timeframe Analysis Matrix
**Tabular layout**:
- Rows: Timeframes (1m, 5m, 15m, 30m, 1h)
- Columns: Signal direction, Strength, Key indicator values
- Cell styling indicates agreement/divergence across timeframes

### H. Correlation Widget
**Side-by-side comparison**:
- XAU/USD vs BTC/USD correlation coefficient
- Divergence alerts
- Visual correlation graph (scatter plot or line overlay)

---

## Animations & Interactions

**Minimal, purposeful animations**:
- Real-time price updates: Subtle flash/pulse on value change (duration-150)
- New signal arrival: Gentle slide-in from top (duration-300)
- Chart loading: Skeleton state, no spinner
- TP level reached: Brief highlight animation (duration-200)
- Avoid: Complex transitions, hover effects on data elements, distracting movements

**Interactive States**:
- Buttons: Standard hover/active states (no blur backgrounds)
- Tabs: Clear active/inactive distinction
- Charts: Crosshair on hover, no elaborate tooltips
- Signal cards: Click to expand/collapse details

---

## Visual Hierarchy & Data Density

**Critical Information Prioritization**:
1. Current price (largest, most prominent)
2. Active BUY/SELL signals with Entry/SL/TP
3. Signal strength and AI confidence
4. Technical indicator alignment
5. Historical signal performance

**Information Density Rules**:
- No large empty spaces - every pixel serves a purpose
- Compact vertical spacing (py-2, py-3) for data rows
- Tables and lists use minimal row height
- Borders and dividers create clear sections without wasting space

**Section Organization**:
- Fixed header with market selector and timeframe (sticky)
- Main content area: Split-screen (Charts left, Signals/Indicators right)
- Bottom bar: Quick stats, connection status, disclaimer

---

## Responsive Behavior

**Desktop (lg and above)**:
- Two-column layout with fixed proportions
- All components visible simultaneously
- Side-by-side chart comparison for both markets

**Tablet (md)**:
- Stacked layout with tabs to switch between chart and signal feed
- Indicators collapse into expandable panel
- Signal cards maintain full detail

**Mobile (base)**:
- Single column, vertical scroll
- Market selector as dropdown or swipeable tabs
- Chart: Full-width, reduced height (h-56)
- Signal cards: Simplified, essential info only
- "Tap to expand" pattern for detailed signal data

---

## Professional Trading Terminal Characteristics

- No marketing fluff or decorative elements
- No hero sections or landing page patterns
- Immediate access to functionality on load
- Dashboard-centric, data-first layout
- Professional color-coding conventions (separate from overall color scheme):
  - BUY/Long signals and positive values
  - SELL/Short signals and negative values
  - Neutral/informational elements
- Monospace fonts for all numerical data (prices, percentages, ratios)
- Grid lines and borders create clear data cells
- Timestamps in consistent format (HH:MM:SS or relative time)

---

## Accessibility & Usability

- High contrast for all text and data elements
- Large clickable areas for timeframe and market selectors (min h-10)
- Keyboard navigation support for all interactive elements
- Clear focus indicators
- Screen reader labels for all data points
- No auto-playing animations or excessive motion

---

This design creates a professional, high-density trading terminal optimized for rapid decision-making, clear signal comprehension, and efficient market analysis for XAU/USD and BTC/USD scalping strategies.
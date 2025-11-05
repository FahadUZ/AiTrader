import { SignalCard } from "../SignalCard";

export default function SignalCardExample() {
  return (
    <div className="p-6 max-w-2xl">
      <SignalCard
        direction="BUY"
        market="XAU/USD"
        entry={2045.50}
        stopLoss={2043.00}
        takeProfits={[
          { level: 1, price: 2048.00, pips: 25, rr: 1.0 },
          { level: 2, price: 2051.50, pips: 60, rr: 2.4 },
          { level: 3, price: 2055.00, pips: 95, rr: 3.8 },
        ]}
        confidence={87}
        currentPrice={2046.20}
        timestamp="2 minutes ago"
        reasoning="RSI showing oversold conditions on 5m timeframe. MACD bullish crossover detected. Price bouncing off key support at 2043. Strong bullish momentum building with increasing volume."
      />
    </div>
  );
}

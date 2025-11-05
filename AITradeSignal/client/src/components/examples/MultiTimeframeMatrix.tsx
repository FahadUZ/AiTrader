import { MultiTimeframeMatrix } from "../MultiTimeframeMatrix";

export default function MultiTimeframeMatrixExample() {
  const analyses = [
    { timeframe: "1m", signal: "BUY" as const, strength: 75, rsi: 35.2, macd: "Bullish" },
    { timeframe: "5m", signal: "BUY" as const, strength: 82, rsi: 32.5, macd: "Bullish Cross" },
    { timeframe: "15m", signal: "NEUTRAL" as const, strength: 55, rsi: 48.1, macd: "Neutral" },
    { timeframe: "30m", signal: "BUY" as const, strength: 68, rsi: 42.3, macd: "Bullish" },
    { timeframe: "1h", signal: "SELL" as const, strength: 45, rsi: 62.8, macd: "Bearish" },
  ];

  return (
    <div className="p-6">
      <MultiTimeframeMatrix analyses={analyses} />
    </div>
  );
}

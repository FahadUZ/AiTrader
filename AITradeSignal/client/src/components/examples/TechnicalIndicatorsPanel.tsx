import { TechnicalIndicatorsPanel } from "../TechnicalIndicatorsPanel";

export default function TechnicalIndicatorsPanelExample() {
  const indicators = [
    { name: "RSI (14)", value: "32.5", signal: "Oversold" as const, change: -5.2 },
    { name: "MACD", value: "1.24", signal: "Bullish Cross" as const, change: 2.1 },
    { name: "EMA (9)", value: "2044.80", signal: "Bullish" as const },
    { name: "Bollinger Bands", value: "2045.50", signal: "Neutral" as const },
  ];

  return (
    <div className="p-6">
      <TechnicalIndicatorsPanel indicators={indicators} />
    </div>
  );
}

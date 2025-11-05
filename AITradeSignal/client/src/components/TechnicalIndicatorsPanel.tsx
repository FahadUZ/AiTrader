import { TechnicalIndicator } from "./TechnicalIndicator";

interface Indicator {
  name: string;
  value: string;
  signal: "Bullish" | "Bearish" | "Neutral" | "Oversold" | "Overbought" | "Bullish Cross" | "Bearish Cross";
  change?: number;
}

interface TechnicalIndicatorsPanelProps {
  indicators: Indicator[];
}

export function TechnicalIndicatorsPanel({ indicators }: TechnicalIndicatorsPanelProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {indicators.map((indicator) => (
          <TechnicalIndicator key={indicator.name} {...indicator} />
        ))}
      </div>
    </div>
  );
}

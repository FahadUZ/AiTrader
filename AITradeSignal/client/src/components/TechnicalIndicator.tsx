import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TechnicalIndicatorProps {
  name: string;
  value: string;
  signal: "Bullish" | "Bearish" | "Neutral" | "Oversold" | "Overbought" | "Bullish Cross" | "Bearish Cross";
  change?: number;
}

export function TechnicalIndicator({ name, value, signal, change }: TechnicalIndicatorProps) {
  const getSignalColor = () => {
    if (signal.includes("Bullish") || signal === "Oversold") return "text-trading-buy";
    if (signal.includes("Bearish") || signal === "Overbought") return "text-trading-sell";
    return "text-trading-neutral";
  };

  const getBadgeVariant = () => {
    if (signal.includes("Bullish") || signal === "Oversold") return "default";
    if (signal.includes("Bearish") || signal === "Overbought") return "destructive";
    return "secondary";
  };

  return (
    <Card className="p-4" data-testid={`card-indicator-${name.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground">{name}</div>
        <Badge variant={getBadgeVariant()} className="text-xs">
          {signal}
        </Badge>
      </div>
      <div className="text-2xl font-mono font-bold mb-1" data-testid={`text-value-${name.toLowerCase().replace(/\s/g, '-')}`}>
        {value}
      </div>
      {change !== undefined && (
        <div className={`text-sm font-medium ${change >= 0 ? 'text-trading-buy' : 'text-trading-sell'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
      )}
    </Card>
  );
}

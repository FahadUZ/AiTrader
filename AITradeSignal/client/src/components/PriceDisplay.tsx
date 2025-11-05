import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PriceDisplayProps {
  market: "XAU/USD" | "BTC/USD";
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  lastUpdate?: string;
}

export function PriceDisplay({
  market,
  price,
  change,
  changePercent,
  high24h,
  low24h,
  lastUpdate = "Just now",
}: PriceDisplayProps) {
  const isPositive = change >= 0;
  const formattedPrice = market === "XAU/USD" 
    ? price.toFixed(2) 
    : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Card className="p-4" data-testid={`card-price-${market.toLowerCase().replace('/', '-')}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm text-muted-foreground mb-1">{market}</div>
          <div className="text-4xl font-bold font-mono" data-testid={`text-price-${market.toLowerCase().replace('/', '-')}`}>
            {formattedPrice}
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-trading-buy' : 'text-trading-sell'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{isPositive ? '+' : ''}{change.toFixed(2)}</span>
          <span>({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground">24h High</div>
          <div className="font-mono font-medium">{high24h.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">24h Low</div>
          <div className="font-mono font-medium">{low24h.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground">
        Updated: {lastUpdate}
      </div>
    </Card>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface TPLevel {
  level: number;
  price: number;
  pips: number;
  rr: number;
}

interface SignalCardProps {
  direction: "BUY" | "SELL";
  market: "XAU/USD" | "BTC/USD";
  entry: number;
  stopLoss: number;
  takeProfits: TPLevel[];
  confidence: number;
  currentPrice: number;
  timestamp: string;
  reasoning?: string;
}

export function SignalCard({
  direction,
  market,
  entry,
  stopLoss,
  takeProfits,
  confidence,
  currentPrice,
  timestamp,
  reasoning,
}: SignalCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  
  const isBuy = direction === "BUY";
  const slDistance = Math.abs(entry - stopLoss);
  const pipMultiplier = market === "XAU/USD" ? 10 : 1;
  const slPips = Math.round(slDistance * pipMultiplier);
  
  const distanceFromEntry = currentPrice - entry;
  const distancePips = Math.round(Math.abs(distanceFromEntry) * pipMultiplier);

  return (
    <Card className="p-6 border-l-4" style={{ borderLeftColor: isBuy ? 'rgb(34 197 94)' : 'rgb(239 68 68)' }} data-testid={`card-signal-${direction.toLowerCase()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge 
            className={`text-base font-bold px-3 py-1 ${isBuy ? 'bg-trading-buy hover:bg-trading-buy' : 'bg-trading-sell hover:bg-trading-sell'} text-white no-default-hover-elevate`}
            data-testid={`badge-direction-${direction.toLowerCase()}`}
          >
            {direction}
          </Badge>
          <span className="text-lg font-semibold">{market}</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Confidence</div>
          <div className="text-2xl font-bold" data-testid="text-confidence">{confidence}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-accent/30 rounded-md p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
            Entry Price
          </div>
          <div className="text-3xl font-mono font-bold" data-testid="text-entry">
            {entry.toFixed(market === "XAU/USD" ? 2 : 2)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Current: {currentPrice.toFixed(2)} ({distanceFromEntry >= 0 ? '+' : ''}{distancePips} pips)
          </div>
        </div>

        <div className="bg-destructive/10 rounded-md p-3">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
            Stop Loss (SL)
          </div>
          <div className="text-xl font-mono font-bold text-destructive" data-testid="text-stoploss">
            {stopLoss.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            -{slPips} pips from entry
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
            Take Profit Levels
          </div>
          {takeProfits.map((tp) => (
            <div key={tp.level} className="bg-trading-buy/10 rounded-md p-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">TP{tp.level}</div>
                <div className="text-lg font-mono font-bold" data-testid={`text-tp${tp.level}`}>
                  {tp.price.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-trading-buy">
                  +{tp.pips} pips
                </div>
                <div className="text-xs text-muted-foreground">
                  R:R 1:{tp.rr.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {reasoning && (
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReasoning(!showReasoning)}
            className="w-full justify-between"
            data-testid="button-toggle-reasoning"
          >
            <span className="text-sm font-medium">AI Analysis</span>
            {showReasoning ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {showReasoning && (
            <div className="mt-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-md" data-testid="text-reasoning">
              {reasoning}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        Signal generated: {timestamp}
      </div>
    </Card>
  );
}

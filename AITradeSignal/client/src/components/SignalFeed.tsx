import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Signal {
  id: string;
  direction: "BUY" | "SELL";
  market: "XAU/USD" | "BTC/USD";
  entry: number;
  status: "Active" | "Hit TP1" | "Hit TP2" | "Hit TP3" | "Stopped Out" | "Pending";
  timestamp: string;
  confidence: number;
}

interface SignalFeedProps {
  signals: Signal[];
  onSignalClick?: (id: string) => void;
}

export function SignalFeed({ signals, onSignalClick }: SignalFeedProps) {
  const getStatusVariant = (status: string) => {
    if (status.includes("Hit TP")) return "default";
    if (status === "Stopped Out") return "destructive";
    if (status === "Active") return "secondary";
    return "outline";
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Signals</h3>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {signals.map((signal) => (
            <div
              key={signal.id}
              onClick={() => {
                onSignalClick?.(signal.id);
                console.log("Signal clicked:", signal.id);
              }}
              className="p-3 border rounded-md hover-elevate cursor-pointer"
              data-testid={`signal-feed-item-${signal.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`${signal.direction === "BUY" ? 'bg-trading-buy' : 'bg-trading-sell'} text-white no-default-hover-elevate`}
                  >
                    {signal.direction}
                  </Badge>
                  <span className="font-semibold">{signal.market}</span>
                </div>
                <Badge variant={getStatusVariant(signal.status)} className="text-xs">
                  {signal.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Entry: </span>
                  <span className="font-mono font-medium">{signal.entry.toFixed(2)}</span>
                </div>
                <div className="text-muted-foreground">{signal.confidence}%</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{signal.timestamp}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

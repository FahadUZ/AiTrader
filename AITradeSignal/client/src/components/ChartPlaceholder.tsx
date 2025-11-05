import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface ChartPlaceholderProps {
  market: string;
  timeframe: string;
}

export function ChartPlaceholder({ market, timeframe }: ChartPlaceholderProps) {
  return (
    <Card className="p-6 h-96 flex flex-col items-center justify-center bg-muted/20" data-testid="chart-placeholder">
      <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{market} Chart</h3>
      <p className="text-sm text-muted-foreground mb-1">Timeframe: {timeframe}</p>
      <p className="text-xs text-muted-foreground">Live candlestick chart will be integrated here</p>
    </Card>
  );
}

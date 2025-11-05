import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TimeframeAnalysis {
  timeframe: string;
  signal: "BUY" | "SELL" | "NEUTRAL";
  strength: number;
  rsi: number;
  macd: string;
}

interface MultiTimeframeMatrixProps {
  analyses: TimeframeAnalysis[];
}

export function MultiTimeframeMatrix({ analyses }: MultiTimeframeMatrixProps) {
  const getSignalIcon = (signal: string) => {
    if (signal === "BUY") return <TrendingUp className="h-4 w-4" />;
    if (signal === "SELL") return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getSignalColor = (signal: string) => {
    if (signal === "BUY") return "text-trading-buy";
    if (signal === "SELL") return "text-trading-sell";
    return "text-trading-neutral";
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Multi-Timeframe Analysis</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 font-medium text-muted-foreground">Timeframe</th>
              <th className="text-center py-2 px-2 font-medium text-muted-foreground">Signal</th>
              <th className="text-center py-2 px-2 font-medium text-muted-foreground">Strength</th>
              <th className="text-center py-2 px-2 font-medium text-muted-foreground">RSI</th>
              <th className="text-center py-2 px-2 font-medium text-muted-foreground">MACD</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((analysis) => (
              <tr key={analysis.timeframe} className="border-b" data-testid={`row-timeframe-${analysis.timeframe}`}>
                <td className="py-3 px-2 font-mono font-medium">{analysis.timeframe}</td>
                <td className="py-3 px-2">
                  <div className={`flex items-center justify-center gap-1 ${getSignalColor(analysis.signal)}`}>
                    {getSignalIcon(analysis.signal)}
                    <span className="font-semibold">{analysis.signal}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <Badge variant="secondary" className="font-mono">
                    {analysis.strength}%
                  </Badge>
                </td>
                <td className="py-3 px-2 text-center font-mono">{analysis.rsi.toFixed(1)}</td>
                <td className="py-3 px-2 text-center text-xs">{analysis.macd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

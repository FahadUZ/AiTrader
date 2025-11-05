import { useState } from "react";
import { Button } from "@/components/ui/button";

type Timeframe = "1m" | "5m" | "15m" | "30m" | "1h";

interface TimeframeSelectorProps {
  onTimeframeChange?: (timeframe: Timeframe) => void;
}

export function TimeframeSelector({ onTimeframeChange }: TimeframeSelectorProps) {
  const [selected, setSelected] = useState<Timeframe>("5m");
  
  const timeframes: Timeframe[] = ["1m", "5m", "15m", "30m", "1h"];

  const handleSelect = (timeframe: Timeframe) => {
    setSelected(timeframe);
    onTimeframeChange?.(timeframe);
    console.log("Timeframe changed to:", timeframe);
  };

  return (
    <div className="flex gap-2 flex-wrap" data-testid="timeframe-selector">
      {timeframes.map((tf) => (
        <Button
          key={tf}
          variant={selected === tf ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelect(tf)}
          className="font-mono"
          data-testid={`button-timeframe-${tf}`}
        >
          {tf}
        </Button>
      ))}
    </div>
  );
}

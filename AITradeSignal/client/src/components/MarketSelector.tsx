import { useState } from "react";
import { Button } from "@/components/ui/button";

type Market = "XAU/USD" | "BTC/USD";

interface MarketSelectorProps {
  onMarketChange?: (market: Market) => void;
}

export function MarketSelector({ onMarketChange }: MarketSelectorProps) {
  const [selected, setSelected] = useState<Market>("XAU/USD");

  const handleSelect = (market: Market) => {
    setSelected(market);
    onMarketChange?.(market);
    console.log("Market changed to:", market);
  };

  return (
    <div className="flex gap-2" data-testid="market-selector">
      <Button
        variant={selected === "XAU/USD" ? "default" : "outline"}
        onClick={() => handleSelect("XAU/USD")}
        className="font-semibold"
        data-testid="button-market-xauusd"
      >
        XAU/USD
      </Button>
      <Button
        variant={selected === "BTC/USD" ? "default" : "outline"}
        onClick={() => handleSelect("BTC/USD")}
        className="font-semibold"
        data-testid="button-market-btcusd"
      >
        BTC/USD
      </Button>
    </div>
  );
}

import { PriceDisplay } from "../PriceDisplay";

export default function PriceDisplayExample() {
  return (
    <div className="p-6 max-w-md">
      <PriceDisplay
        market="XAU/USD"
        price={2045.50}
        change={12.30}
        changePercent={0.61}
        high24h={2055.80}
        low24h={2032.40}
        lastUpdate="Just now"
      />
    </div>
  );
}

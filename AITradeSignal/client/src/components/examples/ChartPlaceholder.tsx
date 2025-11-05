import { ChartPlaceholder } from "../ChartPlaceholder";

export default function ChartPlaceholderExample() {
  return (
    <div className="p-6">
      <ChartPlaceholder market="XAU/USD" timeframe="5m" />
    </div>
  );
}

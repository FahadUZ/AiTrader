import { TechnicalIndicator } from "../TechnicalIndicator";

export default function TechnicalIndicatorExample() {
  return (
    <div className="p-6 max-w-sm">
      <TechnicalIndicator
        name="RSI (14)"
        value="32.5"
        signal="Oversold"
        change={-5.2}
      />
    </div>
  );
}

import { SignalFeed } from "../SignalFeed";

export default function SignalFeedExample() {
  const signals = [
    {
      id: "1",
      direction: "BUY" as const,
      market: "XAU/USD" as const,
      entry: 2045.50,
      status: "Active" as const,
      timestamp: "2 minutes ago",
      confidence: 87,
    },
    {
      id: "2",
      direction: "SELL" as const,
      market: "BTC/USD" as const,
      entry: 43250.00,
      status: "Hit TP1" as const,
      timestamp: "15 minutes ago",
      confidence: 92,
    },
    {
      id: "3",
      direction: "BUY" as const,
      market: "XAU/USD" as const,
      entry: 2042.30,
      status: "Hit TP2" as const,
      timestamp: "1 hour ago",
      confidence: 78,
    },
    {
      id: "4",
      direction: "SELL" as const,
      market: "BTC/USD" as const,
      entry: 43500.00,
      status: "Stopped Out" as const,
      timestamp: "2 hours ago",
      confidence: 65,
    },
  ];

  return (
    <div className="p-6 max-w-md">
      <SignalFeed signals={signals} />
    </div>
  );
}

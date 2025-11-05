import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { PriceDisplay } from "@/components/PriceDisplay";
import { SignalCard } from "@/components/SignalCard";
import { TechnicalIndicatorsPanel } from "@/components/TechnicalIndicatorsPanel";
import { MultiTimeframeMatrix } from "@/components/MultiTimeframeMatrix";
import { SignalFeed } from "@/components/SignalFeed";
import { ChartPlaceholder } from "@/components/ChartPlaceholder";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import type { PriceData, Signal, TechnicalIndicator, TimeframeAnalysis } from "@shared/schema";

export default function TradingTerminal() {
  const { toast } = useToast();
  const { lastMessage, isConnected } = useWebSocket("/ws");
  
  const [xauusdPrice, setXauusdPrice] = useState<PriceData | null>(null);
  const [btcusdPrice, setBtcusdPrice] = useState<PriceData | null>(null);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [recentSignals, setRecentSignals] = useState<Signal[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);

  const { data: signalsData } = useQuery<Signal[]>({
    queryKey: ["/api/signals"],
  });

  const { data: xauIndicators } = useQuery<TechnicalIndicator[]>({
    queryKey: ["/api/indicators/xauusd"],
  });

  const { data: timeframeData } = useQuery<TimeframeAnalysis[]>({
    queryKey: ["/api/analysis/xauusd"],
  });

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "price_update":
        if (lastMessage.data.xauusd) {
          setXauusdPrice(lastMessage.data.xauusd);
        }
        if (lastMessage.data.btcusd) {
          setBtcusdPrice(lastMessage.data.btcusd);
        }
        break;

      case "new_signal":
        const newSignal = lastMessage.data as Signal;
        setCurrentSignal(newSignal);
        setRecentSignals((prev) => [newSignal, ...prev.slice(0, 19)]);
        
        toast({
          title: `New ${newSignal.direction} Signal`,
          description: `${newSignal.market} - Entry: ${newSignal.entry.toFixed(2)} - Confidence: ${newSignal.confidence}%`,
          duration: 5000,
        });
        break;

      case "indicators_update":
        if (lastMessage.data.indicators) {
          setIndicators(lastMessage.data.indicators);
        }
        break;

      case "initial_signals":
        if (Array.isArray(lastMessage.data) && lastMessage.data.length > 0) {
          setRecentSignals(lastMessage.data);
          if (!currentSignal) {
            setCurrentSignal(lastMessage.data[0]);
          }
        }
        break;
    }
  }, [lastMessage, toast]);

  useEffect(() => {
    if (signalsData && signalsData.length > 0) {
      setRecentSignals(signalsData);
      if (!currentSignal) {
        setCurrentSignal(signalsData[0]);
      }
    }
  }, [signalsData]);

  useEffect(() => {
    if (xauIndicators) {
      setIndicators(xauIndicators);
    }
  }, [xauIndicators]);

  const displayXauPrice = xauusdPrice || {
    market: "XAU/USD" as const,
    price: 2045.50,
    change: 0,
    changePercent: 0,
    high24h: 2055.80,
    low24h: 2032.40,
    timestamp: Date.now(),
  };

  const displayBtcPrice = btcusdPrice || {
    market: "BTC/USD" as const,
    price: 43280.50,
    change: 0,
    changePercent: 0,
    high24h: 43650.00,
    low24h: 42980.00,
    timestamp: Date.now(),
  };

  const displaySignal = currentSignal || {
    id: "demo",
    direction: "BUY" as const,
    market: "XAU/USD" as const,
    entry: 2045.50,
    stopLoss: 2043.00,
    takeProfits: [
      { level: 1, price: 2048.00, pips: 25, rr: 1.0 },
      { level: 2, price: 2051.50, pips: 60, rr: 2.4 },
      { level: 3, price: 2055.00, pips: 95, rr: 3.8 },
    ],
    confidence: 87,
    currentPrice: displayXauPrice.price,
    timestamp: "Waiting for AI signal...",
    reasoning: "Connect to receive live AI-generated trading signals with precise Entry, Stop Loss, and Take Profit levels.",
    status: "Pending" as const,
  };

  const displayIndicators = indicators.length > 0 ? indicators : [
    { name: "RSI (14)", value: "...", signal: "Neutral" as const },
    { name: "MACD", value: "...", signal: "Neutral" as const },
    { name: "EMA (9)", value: "...", signal: "Neutral" as const },
    { name: "EMA (21)", value: "...", signal: "Neutral" as const },
    { name: "Bollinger Bands", value: "...", signal: "Neutral" as const },
    { name: "Stochastic", value: "...", signal: "Neutral" as const },
  ];

  const displayTimeframes = timeframeData || [
    { timeframe: "1m", signal: "NEUTRAL" as const, strength: 50, rsi: 50, macd: "Neutral" },
    { timeframe: "5m", signal: "NEUTRAL" as const, strength: 50, rsi: 50, macd: "Neutral" },
    { timeframe: "15m", signal: "NEUTRAL" as const, strength: 50, rsi: 50, macd: "Neutral" },
    { timeframe: "30m", signal: "NEUTRAL" as const, strength: 50, rsi: 50, macd: "Neutral" },
    { timeframe: "1h", signal: "NEUTRAL" as const, strength: 50, rsi: 50, macd: "Neutral" },
  ];

  const displayRecentSignals = recentSignals.length > 0 ? recentSignals : [
    {
      id: "demo-1",
      direction: "BUY" as const,
      market: "XAU/USD" as const,
      entry: 2045.50,
      status: "Pending" as const,
      timestamp: "Waiting for signals...",
      confidence: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-trading-buy animate-pulse' : 'bg-trading-sell'}`}></div>
          <span className="text-muted-foreground">
            {isConnected ? 'Connected - Live Updates Active' : 'Connecting...'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PriceDisplay {...displayXauPrice} lastUpdate="Live" />
              <PriceDisplay {...displayBtcPrice} lastUpdate="Live" />
            </div>

            <ChartPlaceholder market="XAU/USD" timeframe="5m" />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SignalCard 
                {...displaySignal} 
                currentPrice={displaySignal.market === "XAU/USD" ? displayXauPrice.price : displayBtcPrice.price}
              />
              <div className="space-y-6">
                <TechnicalIndicatorsPanel indicators={displayIndicators} />
              </div>
            </div>

            <MultiTimeframeMatrix analyses={displayTimeframes} />
          </div>

          <div className="lg:col-span-1">
            <SignalFeed signals={displayRecentSignals} />
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-md text-center text-sm text-muted-foreground">
          <p className="font-medium mb-1">⚠️ Trading Disclaimer</p>
          <p>These signals are for educational and informational purposes only. Trading XAU/USD and BTC/USD involves substantial risk. Always use proper risk management and conduct your own analysis.</p>
        </div>
      </main>
    </div>
  );
}

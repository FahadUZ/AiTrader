import { RSI, MACD, EMA, BollingerBands, Stochastic } from "technicalindicators";
import type { CandleData, TechnicalIndicator, TimeframeAnalysis } from "@shared/schema";

export class TechnicalIndicatorsService {
  calculateRSI(candles: CandleData[], period: number = 14): number {
    const closes = candles.map((c) => c.close);
    const rsiValues = RSI.calculate({ values: closes, period });
    return rsiValues[rsiValues.length - 1] || 50;
  }

  calculateMACD(candles: CandleData[]): {
    value: number;
    signal: number;
    histogram: number;
  } {
    const closes = candles.map((c) => c.close);
    const macdValues = MACD.calculate({
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });

    const latest = macdValues[macdValues.length - 1];
    if (!latest) {
      return { value: 0, signal: 0, histogram: 0 };
    }

    return {
      value: latest.MACD || 0,
      signal: latest.signal || 0,
      histogram: latest.histogram || 0,
    };
  }

  calculateEMA(candles: CandleData[], period: number): number {
    const closes = candles.map((c) => c.close);
    const emaValues = EMA.calculate({ values: closes, period });
    return emaValues[emaValues.length - 1] || closes[closes.length - 1];
  }

  calculateBollingerBands(candles: CandleData[], period: number = 20): {
    upper: number;
    middle: number;
    lower: number;
  } {
    const closes = candles.map((c) => c.close);
    const bbValues = BollingerBands.calculate({
      values: closes,
      period,
      stdDev: 2,
    });

    const latest = bbValues[bbValues.length - 1];
    if (!latest) {
      const lastClose = closes[closes.length - 1];
      return { upper: lastClose, middle: lastClose, lower: lastClose };
    }

    return {
      upper: latest.upper,
      middle: latest.middle,
      lower: latest.lower,
    };
  }

  calculateStochastic(candles: CandleData[]): { k: number; d: number } {
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const closes = candles.map((c) => c.close);

    const stochValues = Stochastic.calculate({
      high: highs,
      low: lows,
      close: closes,
      period: 14,
      signalPeriod: 3,
    });

    const latest = stochValues[stochValues.length - 1];
    if (!latest) {
      return { k: 50, d: 50 };
    }

    return { k: latest.k, d: latest.d };
  }

  generateIndicators(candles: CandleData[]): TechnicalIndicator[] {
    const rsi = this.calculateRSI(candles);
    const macd = this.calculateMACD(candles);
    const ema9 = this.calculateEMA(candles, 9);
    const ema21 = this.calculateEMA(candles, 21);
    const ema50 = this.calculateEMA(candles, 50);
    const bb = this.calculateBollingerBands(candles);
    const stoch = this.calculateStochastic(candles);

    const currentPrice = candles[candles.length - 1].close;

    const indicators: TechnicalIndicator[] = [
      {
        name: "RSI (14)",
        value: rsi.toFixed(1),
        signal: rsi < 30 ? "Oversold" : rsi > 70 ? "Overbought" : "Neutral",
      },
      {
        name: "MACD",
        value: macd.histogram.toFixed(2),
        signal: macd.histogram > 0 ? "Bullish Cross" : "Bearish Cross",
      },
      {
        name: "EMA (9)",
        value: ema9.toFixed(2),
        signal: currentPrice > ema9 ? "Bullish" : "Bearish",
      },
      {
        name: "EMA (21)",
        value: ema21.toFixed(2),
        signal: currentPrice > ema21 ? "Bullish" : "Bearish",
      },
      {
        name: "EMA (50)",
        value: ema50.toFixed(2),
        signal: currentPrice > ema50 ? "Bullish" : "Bearish",
      },
      {
        name: "Bollinger Bands",
        value: `${bb.upper.toFixed(2)}`,
        signal: currentPrice > bb.upper ? "Overbought" : currentPrice < bb.lower ? "Oversold" : "Neutral",
      },
      {
        name: "Stochastic",
        value: stoch.k.toFixed(1),
        signal: stoch.k < 20 ? "Oversold" : stoch.k > 80 ? "Overbought" : "Neutral",
      },
    ];

    return indicators;
  }

  analyzeTimeframe(candles: CandleData[], timeframe: string): TimeframeAnalysis {
    const rsi = this.calculateRSI(candles);
    const macd = this.calculateMACD(candles);
    const ema9 = this.calculateEMA(candles, 9);
    const currentPrice = candles[candles.length - 1].close;

    let bullishSignals = 0;
    let bearishSignals = 0;

    if (rsi < 40) bullishSignals++;
    if (rsi > 60) bearishSignals++;
    if (macd.histogram > 0) bullishSignals++;
    if (macd.histogram < 0) bearishSignals++;
    if (currentPrice > ema9) bullishSignals++;
    if (currentPrice < ema9) bearishSignals++;

    const totalSignals = bullishSignals + bearishSignals;
    const strength = totalSignals > 0 ? Math.round((Math.max(bullishSignals, bearishSignals) / totalSignals) * 100) : 50;

    let signal: "BUY" | "SELL" | "NEUTRAL" = "NEUTRAL";
    if (bullishSignals > bearishSignals) signal = "BUY";
    if (bearishSignals > bullishSignals) signal = "SELL";

    return {
      timeframe,
      signal,
      strength,
      rsi,
      macd: macd.histogram > 0 ? "Bullish" : "Bearish",
    };
  }
}

export const indicatorsService = new TechnicalIndicatorsService();

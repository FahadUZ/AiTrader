import OpenAI from "openai";
import type { Signal, TechnicalIndicator, CandleData, TPLevel } from "@shared/schema";
import { randomUUID } from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AISignalGenerator {
  async generateSignal(
    market: "XAU/USD" | "BTC/USD",
    currentPrice: number,
    indicators: TechnicalIndicator[],
    candles: CandleData[]
  ): Promise<Signal | null> {
    try {
      const recentCandles = candles.slice(-20);
      const priceMovement = this.analyzePriceMovement(recentCandles);

      const prompt = `You are an expert trading signal generator for ${market}. Analyze the following market data and generate a trading signal with precise Entry, Stop Loss, and Take Profit levels.

Current Price: ${currentPrice.toFixed(2)}

Technical Indicators:
${indicators.map((ind) => `- ${ind.name}: ${ind.value} (${ind.signal})`).join("\n")}

Recent Price Movement:
- Trend: ${priceMovement.trend}
- Volatility: ${priceMovement.volatility}
- Support Level: ${priceMovement.support.toFixed(2)}
- Resistance Level: ${priceMovement.resistance.toFixed(2)}

Based on this analysis, generate a trading signal in the following JSON format:
{
  "direction": "BUY" or "SELL",
  "entry": number (exact entry price),
  "stopLoss": number (exact SL price),
  "tp1": number (first take profit),
  "tp2": number (second take profit),
  "tp3": number (third take profit),
  "confidence": number (0-100),
  "reasoning": "Brief explanation of the signal (2-3 sentences)"
}

Guidelines:
- For ${market === "XAU/USD" ? "Gold" : "Bitcoin"}, use appropriate pip/point distances
- SL should be 20-40 pips away from entry for scalping
- TP1: 1:1 risk-reward, TP2: 1:2, TP3: 1:3+
- Only generate a signal if confidence is above 65%
- If no clear signal, return null

Respond with only the JSON object, no additional text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert trading signal generator. Respond only with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) return null;

      const signalData = JSON.parse(response);
      
      if (!signalData.direction || signalData.confidence < 65) {
        return null;
      }

      const pipMultiplier = market === "XAU/USD" ? 10 : 1;
      const slDistance = Math.abs(signalData.entry - signalData.stopLoss);
      const slPips = Math.round(slDistance * pipMultiplier);

      const takeProfits: TPLevel[] = [
        {
          level: 1,
          price: signalData.tp1,
          pips: Math.round(Math.abs(signalData.tp1 - signalData.entry) * pipMultiplier),
          rr: Math.abs(signalData.tp1 - signalData.entry) / slDistance,
        },
        {
          level: 2,
          price: signalData.tp2,
          pips: Math.round(Math.abs(signalData.tp2 - signalData.entry) * pipMultiplier),
          rr: Math.abs(signalData.tp2 - signalData.entry) / slDistance,
        },
        {
          level: 3,
          price: signalData.tp3,
          pips: Math.round(Math.abs(signalData.tp3 - signalData.entry) * pipMultiplier),
          rr: Math.abs(signalData.tp3 - signalData.entry) / slDistance,
        },
      ];

      const signal: Signal = {
        id: randomUUID(),
        direction: signalData.direction,
        market,
        entry: signalData.entry,
        stopLoss: signalData.stopLoss,
        takeProfits,
        confidence: Math.round(signalData.confidence),
        currentPrice,
        timestamp: new Date().toISOString(),
        reasoning: signalData.reasoning,
        status: "Active",
      };

      return signal;
    } catch (error) {
      console.error("Error generating AI signal:", error);
      return null;
    }
  }

  private analyzePriceMovement(candles: CandleData[]): {
    trend: string;
    volatility: string;
    support: number;
    resistance: number;
  } {
    const closes = candles.map((c) => c.close);
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);

    const avgClose = closes.reduce((a, b) => a + b, 0) / closes.length;
    const currentClose = closes[closes.length - 1];

    const trend = currentClose > avgClose ? "Bullish" : currentClose < avgClose ? "Bearish" : "Neutral";

    const priceRange = Math.max(...highs) - Math.min(...lows);
    const avgRange = priceRange / candles.length;
    const volatility = avgRange > avgClose * 0.01 ? "High" : "Low";

    const support = Math.min(...lows.slice(-10));
    const resistance = Math.max(...highs.slice(-10));

    return { trend, volatility, support, resistance };
  }
}

export const aiSignalGenerator = new AISignalGenerator();

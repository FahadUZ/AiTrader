import axios from "axios";
import type { PriceData, CandleData } from "@shared/schema";

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY || "";
const BINANCE_API_URL = "https://api.binance.com/api/v3";

class MarketDataService {
  private priceCache: Map<string, PriceData> = new Map();
  private candleCache: Map<string, CandleData[]> = new Map();

  async getXAUUSDPrice(): Promise<PriceData> {
    try {
      const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr`, {
        params: { symbol: "PAXGUSDT" },
      });

      const data = response.data;
      const priceData: PriceData = {
        market: "XAU/USD",
        price: parseFloat(data.lastPrice),
        change: parseFloat(data.priceChange),
        changePercent: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        timestamp: Date.now(),
      };

      this.priceCache.set("XAU/USD", priceData);
      return priceData;
    } catch (error) {
      console.error("Error fetching XAU/USD price:", error);
      return this.getMockXAUUSDPrice();
    }
  }

  async getBTCUSDPrice(): Promise<PriceData> {
    try {
      const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr`, {
        params: { symbol: "BTCUSDT" },
      });

      const data = response.data;
      const priceData: PriceData = {
        market: "BTC/USD",
        price: parseFloat(data.lastPrice),
        change: parseFloat(data.priceChange),
        changePercent: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        timestamp: Date.now(),
      };

      this.priceCache.set("BTC/USD", priceData);
      return priceData;
    } catch (error) {
      console.error("Error fetching BTC/USD price:", error);
      return this.getMockBTCUSDPrice();
    }
  }

  async getXAUUSDCandles(interval: string = "5m", limit: number = 100): Promise<CandleData[]> {
    try {
      const response = await axios.get(`${BINANCE_API_URL}/klines`, {
        params: {
          symbol: "PAXGUSDT",
          interval,
          limit,
        },
      });

      const candles: CandleData[] = response.data.map((candle: any) => ({
        timestamp: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));

      this.candleCache.set(`XAU/USD-${interval}`, candles);
      return candles;
    } catch (error) {
      console.error("Error fetching XAU/USD candles:", error);
      return this.getMockCandles(2045, 50);
    }
  }

  async getBTCUSDCandles(interval: string = "5m", limit: number = 100): Promise<CandleData[]> {
    try {
      const response = await axios.get(`${BINANCE_API_URL}/klines`, {
        params: {
          symbol: "BTCUSDT",
          interval,
          limit,
        },
      });

      const candles: CandleData[] = response.data.map((candle: any) => ({
        timestamp: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));

      this.candleCache.set(`BTC/USD-${interval}`, candles);
      return candles;
    } catch (error) {
      console.error("Error fetching BTC/USD candles:", error);
      return this.getMockCandles(43250, 5000);
    }
  }

  private getMockXAUUSDPrice(): PriceData {
    const cached = this.priceCache.get("XAU/USD");
    const basePrice = cached?.price || 2045.50;
    const variance = (Math.random() - 0.5) * 5;
    const newPrice = basePrice + variance;

    return {
      market: "XAU/USD",
      price: newPrice,
      change: variance,
      changePercent: (variance / basePrice) * 100,
      high24h: newPrice + Math.random() * 10,
      low24h: newPrice - Math.random() * 10,
      timestamp: Date.now(),
    };
  }

  private getMockBTCUSDPrice(): PriceData {
    const cached = this.priceCache.get("BTC/USD");
    const basePrice = cached?.price || 43280.50;
    const variance = (Math.random() - 0.5) * 200;
    const newPrice = basePrice + variance;

    return {
      market: "BTC/USD",
      price: newPrice,
      change: variance,
      changePercent: (variance / basePrice) * 100,
      high24h: newPrice + Math.random() * 500,
      low24h: newPrice - Math.random() * 500,
      timestamp: Date.now(),
    };
  }

  private getMockCandles(basePrice: number, variance: number): CandleData[] {
    const candles: CandleData[] = [];
    const now = Date.now();
    let price = basePrice;

    for (let i = 100; i >= 0; i--) {
      const open = price;
      const close = price + (Math.random() - 0.5) * variance * 0.02;
      const high = Math.max(open, close) + Math.random() * variance * 0.01;
      const low = Math.min(open, close) - Math.random() * variance * 0.01;

      candles.push({
        timestamp: now - i * 5 * 60 * 1000,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000,
      });

      price = close;
    }

    return candles;
  }
}

export const marketDataService = new MarketDataService();

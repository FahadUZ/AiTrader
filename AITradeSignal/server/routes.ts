import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { marketDataService } from "./services/marketData";
import { indicatorsService } from "./services/indicators";
import { aiSignalGenerator } from "./services/aiSignalGenerator";
import { TradingWebSocketServer } from "./services/websocket";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/price/:market", async (req, res) => {
    try {
      const { market } = req.params;
      
      let priceData;
      if (market === "xauusd") {
        priceData = await marketDataService.getXAUUSDPrice();
      } else if (market === "btcusd") {
        priceData = await marketDataService.getBTCUSDPrice();
      } else {
        return res.status(400).json({ error: "Invalid market" });
      }
      
      res.json(priceData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch price data" });
    }
  });

  app.get("/api/candles/:market", async (req, res) => {
    try {
      const { market } = req.params;
      const interval = (req.query.interval as string) || "5m";
      const limit = parseInt(req.query.limit as string) || 100;
      
      let candles;
      if (market === "xauusd") {
        candles = await marketDataService.getXAUUSDCandles(interval, limit);
      } else if (market === "btcusd") {
        candles = await marketDataService.getBTCUSDCandles(interval, limit);
      } else {
        return res.status(400).json({ error: "Invalid market" });
      }
      
      res.json(candles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch candle data" });
    }
  });

  app.get("/api/indicators/:market", async (req, res) => {
    try {
      const { market } = req.params;
      const interval = (req.query.interval as string) || "5m";
      
      let candles;
      if (market === "xauusd") {
        candles = await marketDataService.getXAUUSDCandles(interval, 100);
      } else if (market === "btcusd") {
        candles = await marketDataService.getBTCUSDCandles(interval, 100);
      } else {
        return res.status(400).json({ error: "Invalid market" });
      }
      
      const indicators = indicatorsService.generateIndicators(candles);
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate indicators" });
    }
  });

  app.get("/api/analysis/:market", async (req, res) => {
    try {
      const { market } = req.params;
      
      let candles;
      if (market === "xauusd") {
        candles = await marketDataService.getXAUUSDCandles("5m", 100);
      } else if (market === "btcusd") {
        candles = await marketDataService.getBTCUSDCandles("5m", 100);
      } else {
        return res.status(400).json({ error: "Invalid market" });
      }
      
      const timeframes = ["1m", "5m", "15m", "30m", "1h"];
      const analyses = timeframes.map((tf) => 
        indicatorsService.analyzeTimeframe(candles, tf)
      );
      
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate analysis" });
    }
  });

  app.get("/api/signals", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const signals = await storage.getSignals(limit);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch signals" });
    }
  });

  app.get("/api/signals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const signal = await storage.getSignalById(id);
      
      if (!signal) {
        return res.status(404).json({ error: "Signal not found" });
      }
      
      res.json(signal);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch signal" });
    }
  });

  const httpServer = createServer(app);
  
  const wsServer = new TradingWebSocketServer(httpServer);
  wsServer.startPriceUpdates();
  wsServer.startSignalGeneration();
  
  console.log("WebSocket server initialized on /ws");

  return httpServer;
}

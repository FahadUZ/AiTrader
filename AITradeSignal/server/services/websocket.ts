import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import type { PriceData, Signal } from "@shared/schema";
import { marketDataService } from "./marketData";
import { indicatorsService } from "./indicators";
import { aiSignalGenerator } from "./aiSignalGenerator";

export class TradingWebSocketServer {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();
  private priceUpdateInterval: NodeJS.Timeout | null = null;
  private signalGenerationInterval: NodeJS.Timeout | null = null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws" });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("New WebSocket client connected");
      this.clients.add(ws);

      ws.on("close", () => {
        console.log("WebSocket client disconnected");
        this.clients.delete(ws);
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(ws);
      });

      this.sendInitialData(ws);
    });
  }

  private async sendInitialData(ws: WebSocket) {
    try {
      const { storage } = await import("../storage");
      const [xauPrice, btcPrice, recentSignals] = await Promise.all([
        marketDataService.getXAUUSDPrice(),
        marketDataService.getBTCUSDPrice(),
        storage.getSignals(10),
      ]);

      ws.send(
        JSON.stringify({
          type: "price_update",
          data: { xauusd: xauPrice, btcusd: btcPrice },
        })
      );

      if (recentSignals.length > 0) {
        ws.send(
          JSON.stringify({
            type: "initial_signals",
            data: recentSignals,
          })
        );
      }
    } catch (error) {
      console.error("Error sending initial data:", error);
    }
  }

  startPriceUpdates() {
    if (this.priceUpdateInterval) return;

    this.priceUpdateInterval = setInterval(async () => {
      try {
        const [xauPrice, btcPrice] = await Promise.all([
          marketDataService.getXAUUSDPrice(),
          marketDataService.getBTCUSDPrice(),
        ]);

        this.broadcast({
          type: "price_update",
          data: { xauusd: xauPrice, btcusd: btcPrice },
        });
      } catch (error) {
        console.error("Error updating prices:", error);
      }
    }, 3000);

    console.log("Price updates started");
  }

  startSignalGeneration() {
    if (this.signalGenerationInterval) return;

    this.signalGenerationInterval = setInterval(async () => {
      try {
        const markets: ("XAU/USD" | "BTC/USD")[] = ["XAU/USD", "BTC/USD"];
        const randomMarket = markets[Math.floor(Math.random() * markets.length)];

        const [candles, priceData] =
          randomMarket === "XAU/USD"
            ? await Promise.all([
                marketDataService.getXAUUSDCandles("5m", 100),
                marketDataService.getXAUUSDPrice(),
              ])
            : await Promise.all([
                marketDataService.getBTCUSDCandles("5m", 100),
                marketDataService.getBTCUSDPrice(),
              ]);

        const indicators = indicatorsService.generateIndicators(candles);
        const signal = await aiSignalGenerator.generateSignal(
          randomMarket,
          priceData.price,
          indicators,
          candles
        );

        if (signal) {
          console.log(`Generated ${signal.direction} signal for ${randomMarket}`);
          
          const { storage } = await import("../storage");
          await storage.addSignal(signal);
          
          this.broadcast({
            type: "new_signal",
            data: signal,
          });

          this.broadcast({
            type: "indicators_update",
            data: { market: randomMarket, indicators },
          });
        }
      } catch (error) {
        console.error("Error generating signal:", error);
      }
    }, 60000);

    console.log("Signal generation started");
  }

  private broadcast(message: any) {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  stop() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
      this.priceUpdateInterval = null;
    }
    if (this.signalGenerationInterval) {
      clearInterval(this.signalGenerationInterval);
      this.signalGenerationInterval = null;
    }
    this.wss.close();
  }
}

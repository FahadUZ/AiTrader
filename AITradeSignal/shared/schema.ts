import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface PriceData {
  market: "XAU/USD" | "BTC/USD";
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface TPLevel {
  level: number;
  price: number;
  pips: number;
  rr: number;
}

export interface Signal {
  id: string;
  direction: "BUY" | "SELL";
  market: "XAU/USD" | "BTC/USD";
  entry: number;
  stopLoss: number;
  takeProfits: TPLevel[];
  confidence: number;
  currentPrice: number;
  timestamp: string;
  reasoning: string;
  status: "Active" | "Hit TP1" | "Hit TP2" | "Hit TP3" | "Stopped Out" | "Pending";
}

export interface TechnicalIndicator {
  name: string;
  value: string;
  signal: "Bullish" | "Bearish" | "Neutral" | "Oversold" | "Overbought" | "Bullish Cross" | "Bearish Cross";
  change?: number;
}

export interface TimeframeAnalysis {
  timeframe: string;
  signal: "BUY" | "SELL" | "NEUTRAL";
  strength: number;
  rsi: number;
  macd: string;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAnalysis {
  market: "XAU/USD" | "BTC/USD";
  priceData: PriceData;
  indicators: TechnicalIndicator[];
  signal: Signal | null;
  timeframeAnalyses: TimeframeAnalysis[];
  candles: CandleData[];
}

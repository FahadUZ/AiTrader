import { type User, type InsertUser, type Signal } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  addSignal(signal: Signal): Promise<Signal>;
  getSignals(limit?: number): Promise<Signal[]>;
  getSignalById(id: string): Promise<Signal | undefined>;
  updateSignalStatus(id: string, status: Signal["status"]): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private signals: Map<string, Signal>;

  constructor() {
    this.users = new Map();
    this.signals = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addSignal(signal: Signal): Promise<Signal> {
    this.signals.set(signal.id, signal);
    return signal;
  }

  async getSignals(limit: number = 50): Promise<Signal[]> {
    const allSignals = Array.from(this.signals.values());
    return allSignals
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async getSignalById(id: string): Promise<Signal | undefined> {
    return this.signals.get(id);
  }

  async updateSignalStatus(id: string, status: Signal["status"]): Promise<void> {
    const signal = this.signals.get(id);
    if (signal) {
      signal.status = status;
      this.signals.set(id, signal);
    }
  }
}

export const storage = new MemStorage();

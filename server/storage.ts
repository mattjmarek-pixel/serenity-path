import { type User, type InsertUser, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
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
}

export class DbStorage implements IStorage {
  constructor(private db: NodePgDatabase) {}

  async getUser(id: string): Promise<User | undefined> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return rows[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const rows = await this.db.insert(users).values(insertUser).returning();
    return rows[0];
  }
}

function buildStorage(): IStorage {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn(
      "[storage] DATABASE_URL not set — falling back to in-memory storage. Data will NOT persist across restarts.",
    );
    return new MemStorage();
  }

  try {
    const pool = new Pool({ connectionString: databaseUrl });
    const db = drizzle(pool);
    console.log("[storage] PostgreSQL storage initialized");
    return new DbStorage(db);
  } catch (err) {
    console.warn(
      "[storage] Failed to initialize PostgreSQL storage, falling back to in-memory:",
      err,
    );
    return new MemStorage();
  }
}

export const storage: IStorage = buildStorage();

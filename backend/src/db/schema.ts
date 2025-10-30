import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const tradeTypeEnum = pgEnum("trade_type", ["BUY", "SELL"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  solana_address: varchar({ length: 255 }).notNull().unique(),
  fusd_balance: numeric({ precision: 18, scale: 2 }).default("0").notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
});

export const tradesTable = pgTable("trades", {
  id: serial("id").primaryKey(),
  user_id: integer().references(() => usersTable.id, { onDelete: "cascade" }),
  symbol: varchar({ length: 20 }).notNull(),
  type: tradeTypeEnum().notNull(),
  price: numeric({ precision: 18, scale: 8 }),
  quantity: numeric({ precision: 18, scale: 8 }),
  total: numeric({ precision: 18, scale: 8 }).notNull(),
  timestamp: timestamp({ withTimezone: true }).defaultNow(),
}, (t) => [
  index("trades_user_idx").on(t.user_id),
  index("trades_symbol_idx").on(t.symbol),
]);

export const portfolioTable = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  user_id: integer().references(() => usersTable.id, { onDelete: "cascade" }),
  symbol: varchar({ length: 20 }).notNull(),
  quantity: numeric({ precision: 18, scale: 8 }),
  avg_buy_price: numeric({ precision: 18, scale: 8 }),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
}, (t) => [
  uniqueIndex("unique_user_symbol").on(t.user_id, t.symbol),
]);

export const leaderboardTable = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  user_id: integer().references(() => usersTable.id, { onDelete: "cascade" }),
  roi_percentage: numeric({ precision: 10, scale: 4 }),
  rank: integer(),
  period: varchar({ length: 20 }),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
});

export const rewardsTable = pgTable("rewards", {
  id: serial("id").primaryKey(),
  user_id: integer().references(() => usersTable.id, { onDelete: "cascade" }),
  amount: numeric({ precision: 18, scale: 8 }),
  reason: varchar({ length: 100 }),
  is_claimed: boolean().default(false),
  claimed_tx: varchar({ length: 200 }),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
});

export const balanceSnapshotsTable = pgTable("balance_snapshots", {
  id: serial("id").primaryKey(),
  user_id: integer().notNull(),
  total_value: numeric().notNull(), // portfolio + fusd
  period: varchar("period", { length: 7 }).notNull(), // e.g., "2025-10"
  created_at: timestamp().defaultNow(), // snapshot time
}, (t) => [
  uniqueIndex("unique_user_period_idx").on(t.user_id, t.period),
]);


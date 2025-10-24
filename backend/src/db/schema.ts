import { boolean, date, integer, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const db_enum = pgEnum("trade_type",["BUY","SELL"])

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  solana_address: varchar({ length: 255 }).notNull().unique(),    //public key
  fusd_balance: integer().default(0).notNull(),      //Current LAEP balance (off-chain)
  created_at: date().defaultNow(),
  updated_at: date().defaultNow(),
});

export const tradesTable = pgTable("trades", {
  id: serial('id').primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id),
  symbol: varchar({ length: 20 }),          //e.g., “BTCUSDT”
  type: db_enum("trade_type"),              //“BUY” or “SELL”
  price: integer(),                         //Price at trade time
  quantity: integer(),                      //Virtual quantity
  total: integer().notNull(),                         //price * quantity
  timestamp: date().defaultNow()
})

export const portfolioTable = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id),
  symbol: varchar({ length: 20 }),          //Asset (BTC, SOL, ETH)
  quantity: integer(),                      //Held amount
  avg_buy_price: integer(),                 //Average buy price
  updated_at: date().defaultNow()           
})

export const leaderboardTable = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id),
  roi_percentage: integer(),              //ROI calculated weekly/monthly
  rank: integer(),                        //User’s position in leaderboard
  period: varchar({ length: 20 }),        //e.g., “2025-W42”
  created_at: date().defaultNow()      
})

export const rewardsTable = pgTable("rewards", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => usersTable.id),
  amount: integer(),	                       //LAEP amount
  reason: varchar({ length: 100 }),	        //“Top 49 % reward”, “Referral bonus”, etc.
  is_claimed: boolean().default(false),	    //If claimed on - chain
  claimed_tx: varchar({ length: 200 }),     //Solana transaction hash(optional)
  created_at: date().defaultNow()	          // Reward issued date
})

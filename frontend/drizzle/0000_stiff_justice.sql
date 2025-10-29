CREATE TYPE "public"."trade_type" AS ENUM('BUY', 'SELL');--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"roi_percentage" integer,
	"rank" integer,
	"period" varchar(20),
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "portfolio" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"symbol" varchar(20),
	"quantity" integer,
	"avg_buy_price" integer,
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"amount" integer,
	"reason" varchar(100),
	"is_claimed" boolean DEFAULT false,
	"claimed_tx" varchar(200),
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"symbol" varchar(20),
	"trade_type" "trade_type",
	"price" integer,
	"quantity" integer,
	"total" integer NOT NULL,
	"timestamp" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"solana_address" varchar(255) NOT NULL,
	"fusd_balance" integer DEFAULT 0 NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	CONSTRAINT "users_solana_address_unique" UNIQUE("solana_address")
);
--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
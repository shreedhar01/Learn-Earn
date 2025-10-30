ALTER TABLE "trades" RENAME COLUMN "trade_type" TO "type";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP CONSTRAINT "leaderboard_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "portfolio" DROP CONSTRAINT "portfolio_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rewards" DROP CONSTRAINT "rewards_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "trades" DROP CONSTRAINT "trades_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "leaderboard" ALTER COLUMN "roi_percentage" SET DATA TYPE numeric(10, 4);--> statement-breakpoint
ALTER TABLE "leaderboard" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leaderboard" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "portfolio" ALTER COLUMN "symbol" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "portfolio" ALTER COLUMN "quantity" SET DATA TYPE numeric(18, 8);--> statement-breakpoint
ALTER TABLE "portfolio" ALTER COLUMN "avg_buy_price" SET DATA TYPE numeric(18, 8);--> statement-breakpoint
ALTER TABLE "portfolio" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "portfolio" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "rewards" ALTER COLUMN "amount" SET DATA TYPE numeric(18, 8);--> statement-breakpoint
ALTER TABLE "rewards" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "rewards" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "trades" ALTER COLUMN "symbol" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "trades" ALTER COLUMN "price" SET DATA TYPE numeric(18, 8);--> statement-breakpoint
ALTER TABLE "trades" ALTER COLUMN "quantity" SET DATA TYPE numeric(18, 8);--> statement-breakpoint
ALTER TABLE "trades" ALTER COLUMN "total" SET DATA TYPE numeric(18, 8);--> statement-breakpoint
ALTER TABLE "trades" ALTER COLUMN "timestamp" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "trades" ALTER COLUMN "timestamp" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "fusd_balance" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "fusd_balance" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_symbol" ON "portfolio" USING btree ("user_id","symbol");--> statement-breakpoint
CREATE INDEX "trades_user_idx" ON "trades" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trades_symbol_idx" ON "trades" USING btree ("symbol");
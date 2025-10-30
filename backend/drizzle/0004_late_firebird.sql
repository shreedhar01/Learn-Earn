ALTER TABLE "balance_snapshots" ADD COLUMN "period" varchar(7) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_period_idx" ON "balance_snapshots" USING btree ("user_id","period");
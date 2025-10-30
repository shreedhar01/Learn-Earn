CREATE TABLE "balance_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_value" numeric NOT NULL,
	"created_at" timestamp DEFAULT now()
);

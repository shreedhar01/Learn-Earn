import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { usersTable,tradesTable,portfolioTable,leaderboardTable,rewardsTable, balanceSnapshotsTable } from "../db/schema.js";

// What TypeScript expects when you INSERT into this table
type balanceSnapshotsInsertShape = InferInsertModel<typeof balanceSnapshotsTable>;
// What you get when you SELECT from this table
type balanceSnapshotsSelectShape = InferSelectModel<typeof balanceSnapshotsTable>;

type usersTableInsertShape = InferInsertModel<typeof usersTable>;
type usersTableSelectShape = InferSelectModel<typeof usersTable>;

type tradesTableInsertShape = InferInsertModel<typeof tradesTable>;
type tradesTableSelectShape = InferSelectModel<typeof tradesTable>;

type portfolioTableInsertShape = InferInsertModel<typeof portfolioTable>;
type portfolioTableSelectShape = InferSelectModel<typeof portfolioTable>;

type leaderboardTableInsertShape = InferInsertModel<typeof leaderboardTable>;
type leaderboardTableSelectShape = InferSelectModel<typeof leaderboardTable>;

type rewardsTableInsertShape = InferInsertModel<typeof rewardsTable>;
type rewardsTableSelectShape = InferSelectModel<typeof rewardsTable>;




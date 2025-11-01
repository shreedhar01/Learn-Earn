import type { Request, Response } from "express";
import { calcStartEndDate } from "../helper/calcStartEndDate.js";
import { db } from "../db/index.js";
import { tradesTable, portfolioTable, leaderboardTable, usersTable, balanceSnapshotsTable } from "../db/schema.js";
import { and, between, eq } from "drizzle-orm";
import axios from "axios";

export async function generateLeaderBoard() {
    try {
        const { start, end } = calcStartEndDate()
        const allTradeInGivenTimeFrame = await db
            .select()
            .from(tradesTable)
            .where(between(tradesTable.timestamp, new Date(start), new Date(end)))

        const tradesByUser = new Map();

        for (const trade of allTradeInGivenTimeFrame) {
            if (!tradesByUser.has(trade.user_id)) {
                tradesByUser.set(trade.user_id, []);
            }
            tradesByUser.get(trade.user_id).push(trade);
        }

        type LeaderboardResult = { userId: any; roi: number; rank?: number };
        const results: LeaderboardResult[] = [];

        for (const [userId, trades] of tradesByUser.entries()) {
            // Step A: fetch user’s current portfolio 
            const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)); // from usersTable
            const isUserExist = user[0]
            if (!isUserExist) {
                return
            }

            const portfolio = await db
                .select()
                .from(portfolioTable)
                .where(eq(portfolioTable.user_id, userId));


            // Step B: compute portfolio value using latest market prices
            let totalPortfolioValue = 0;
            for (let i = 0; i < portfolio.length; i++) {
                const latestMP = await axios.get(`${process.env.BINANCE_REST_API}/ticker/price?symbol=${portfolio[i]?.symbol}`)
                totalPortfolioValue += latestMP.data.price * Number(portfolio[i]?.quantity)
            }

            const currentPeriod = `${new Date(start).getFullYear()}-${String(
                new Date(start).getMonth() + 1
            ).padStart(2, "0")}`;

            // Step C: determine starting balance for the month
            let startingBalanceRecord = await db
                .select()
                .from(balanceSnapshotsTable)
                .where(
                    and(
                        eq(balanceSnapshotsTable.user_id, userId),
                        eq(balanceSnapshotsTable.period, currentPeriod)
                    )
                );

            const isStartingBalanceRecordExist = startingBalanceRecord[0]
            let startingBalance;

            if (isStartingBalanceRecordExist) {
                // ✅ Snapshot exists
                startingBalance = Number(isStartingBalanceRecordExist.total_value);
            } else {
                await db.insert(balanceSnapshotsTable).values({
                    user_id: userId,
                    total_value: totalPortfolioValue.toString(),
                    period: currentPeriod,
                    created_at: new Date(start),
                });

                startingBalance = totalPortfolioValue;
            }

            // Step D: compute ROI
            const currentValue = totalPortfolioValue + Number(isUserExist.fusd_balance);
            const roi = ((currentValue - startingBalance) / startingBalance) * 100;

            // Step E: store result (temporarily in array)
            results.push({ userId, roi });
        }

        // Step F: Sort users by ROI descending
        results.sort((a, b) => b.roi - a.roi);
        let rank = 1;
        for (const result of results) {
            result.rank = rank++;
        }

        // Step H: store leaderboard
        const period = `${new Date(start).getFullYear()}-${String(new Date(start).getMonth() + 1).padStart(2, "0")}`;
        for (const { userId, roi, rank } of results) {
            await db
                .insert(leaderboardTable)
                .values({
                    user_id: userId,
                    roi_percentage: roi.toString(),
                    rank,
                    period,
                    created_at: new Date(),
                })
                .onConflictDoUpdate({
                    target: [leaderboardTable.user_id, leaderboardTable.period],
                    set: { roi_percentage: roi.toString(), rank, created_at: new Date() },
                });
        }
        console.log("Leaderboard generated successfully for period:", period);
    } catch (error) {
        console.log("error while generating leaderboard :: ", error)
    }
}

export async function getLeaderboard(req: Request, res: Response) {
    try {
        const now = new Date();
        const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const leaderboard = await db
            .select({
                userId: leaderboardTable.user_id,
                solanaAddress: usersTable.solana_address,
                roi: leaderboardTable.roi_percentage,
                rank: leaderboardTable.rank,
            })
            .from(leaderboardTable)
            .innerJoin(usersTable, eq(leaderboardTable.user_id, usersTable.id))
            .where(eq(leaderboardTable.period, period))
            .orderBy(leaderboardTable.rank);

        res.json({
            success: true,
            period,
            data: leaderboard,
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export async function getUserRanking(req: Request, res: Response) {
    try {
        const { solana_address } = req.params;
        if (!solana_address) {
            return res.status(400).json({ success: false, message: "Solana Address is not provided." });
        }

        const userExist = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.solana_address, solana_address));

        const user = userExist[0];
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const now = new Date();
        const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const leaderboardEntry = await db
            .select({
                userId: leaderboardTable.user_id,
                roi: leaderboardTable.roi_percentage,
                rank: leaderboardTable.rank,
            })
            .from(leaderboardTable)
            .where(and(eq(leaderboardTable.user_id, user.id), eq(leaderboardTable.period, period)));

        if (!leaderboardEntry[0]) {
            return res.status(404).json({ success: false, message: "User ranking not found for current period." });
        }

        res.json({ success: true, period, data: leaderboardEntry[0] });
    } catch (error) {
        console.error("Error fetching user ranking:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}    

import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { usersTable, tradesTable, portfolioTable } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import axios from "axios";

export async function placeTrade(req: Request, res: Response) {
  try {
    const { solana_address, symbol, type, quantity } = req.body

    const userExist = await db.select().from(usersTable).where(eq(usersTable.solana_address, solana_address))

    const user = userExist[0]
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const latestPrice = await axios.get(`${process.env.BINANCE_REST_API}/ticker/price?symbol=${symbol.trim().toUpperCase()}USDT`)
    const price = Number(latestPrice.data?.price ?? NaN)
    const qty = Number(quantity ?? NaN)
    if (Number.isNaN(price) || Number.isNaN(qty)) {
      return res.status(400).send({ success: false, message: "Invalid price or quantity" })
    }

    if (type === "BUY") {
      if (Number(user.fusd_balance) < (price * qty)) {
        return res.status(400).send({ success: false, message: "Insufficient balance" })
      }

      const portfolioExist = await db
        .select()
        .from(portfolioTable)
        .where(and(eq(portfolioTable.user_id, user.id), eq(portfolioTable.symbol, symbol)))

      const isPortfolioExist = portfolioExist[0]

      if (!isPortfolioExist) {
        await db.transaction(async (tx) => {
          await tx
            .insert(tradesTable)
            .values(
              {
                user_id: user.id,
                symbol: symbol,
                type: type,
                price: price.toString(),
                quantity: qty.toString(),
                total: (price * qty).toString()
              }
            );

          await tx
            .insert(portfolioTable)
            .values({
              user_id: user.id,
              symbol,
              quantity: qty.toString(),
              avg_buy_price: price.toString()
            })

          await tx
            .update(usersTable)
            .set({ fusd_balance: (Number(user.fusd_balance) - (price * qty)).toString() })
            .where(eq(usersTable.id, user.id));

        })
      } else {
        await db.transaction(async (tx) => {
          await tx
            .insert(tradesTable)
            .values(
              {
                user_id: user.id,
                symbol: symbol,
                type: type,
                price: price.toString(),
                quantity: qty.toString(),
                total: (price * qty).toString()
              }
            );

          await tx
            .update(portfolioTable)
            .set({
              quantity:(Number(isPortfolioExist?.quantity ?? 0) + qty).toString(),
              avg_buy_price:((Number(isPortfolioExist?.avg_buy_price ?? 0) + price) / 2).toString(),
            })
            .where(eq(portfolioTable.id, isPortfolioExist.id))


          await tx
            .update(usersTable)
            .set({ fusd_balance: (Number(user.fusd_balance) - (price * qty)).toString() })
            .where(eq(usersTable.id, user.id));

        })
      }
    } else {
      const userPortfolio = await db
        .select()
        .from(portfolioTable)
        .where(and(eq(portfolioTable.user_id, user.id), eq(portfolioTable.symbol, symbol)))
      const portfolio = userPortfolio[0]
      if (!portfolio) {
        return res.status(404).send({ success: false, message: "You don't have this crypto" })
      }

      const portfolioQty = Number(portfolio.quantity ?? 0)
      if (portfolioQty < qty) {
        return res.status(400).send({ success: false, message: `You have ${portfolioQty} ${symbol}` })
      }

      await db.transaction(async (tx) => {
        await tx
            .insert(tradesTable)
            .values(
              {
                user_id: user.id,
                symbol: symbol,
                type: type,
                price: price.toString(),
                quantity: qty.toString(),
                total: (price * qty).toString()
              }
            );

        await tx
          .update(portfolioTable)
          .set({ quantity: (portfolioQty - qty).toString() })
          .where(eq(portfolioTable.user_id, user.id))

        await tx
          .update(usersTable)
          .set({
            fusd_balance: (Number(user.fusd_balance) + (price * qty)).toString(),
          })
          .where(eq(usersTable.id, user.id));
      })
    }
    return res.status(201).send({
      success: true,
      message: type === "BUY" ? "You successfully bought" : "You successfully sold",
      data: {
        symbol,
        quantity: qty,
        price
      }
    });
  } catch (error) {
    console.error(error)
    return res.status(500).send({ success: false, message: "Internal server error" })
  }
}

export async function getUsersAllTrades(req: Request, res: Response) {
  try {
    const { solana_address } = req.params
    if (!solana_address) {
      return res.status(400).send({ success: false, message: "Solana address is required" })
    }
    const userExist = await db.select().from(usersTable).where(eq(usersTable.solana_address, solana_address))

    const user = userExist[0]
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" })
    }

    const allTrade = await db.select().from(tradesTable).where(eq(tradesTable.user_id, user.id))
    if (!allTrade[0]) {
      return res.status(404).send({ success: false, message: "Trade not found" })
    }
    return res.status(201).send({ success: true, message:"User trade fetch successfully",data: allTrade });
  } catch (error) {
    console.error(error)
    return res.status(500).send({ success: false, message: "Internal server error" })
  }
}
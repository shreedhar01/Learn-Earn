import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getUserFUSDTBalance = async (req: Request, res: Response) => {
  try {
    const { solana_address } = req.params;
    if (!solana_address) {
      return res.status(404).json({ success: false, message: "Solana Public address not provided" });
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.solana_address, solana_address));

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({
        success: true,
        message: "Balance fetch Success",
        data: { fusd_balance: user.fusd_balance }
      });
  } catch (error) {
    console.log('Error while getting user FUSDT Balance ::', error)
    res.status(404).json({ success: false, message: "Error while getting User FUSDT Balance" });
  }
};

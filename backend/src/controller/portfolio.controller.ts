import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { usersTable, portfolioTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const { solana_address } = req.params;
    if(!solana_address){
      return res.status(404).json({ success: false, message: "Solana Address not given" })
    }
  
    const [user] = await db.select().from(usersTable).where(eq(usersTable.solana_address, solana_address));
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
    const portfolio = await db.select().from(portfolioTable).where(eq(portfolioTable.user_id, user.id));
    if (!portfolio.length) return res.status(404).json({ success: false, message: "Portfolio is empty" });
  
    return res.status(200).json({ success: false, message:"Portfolio access Successfully", data:portfolio });
  } catch (error) {
    res.status(404).json({ success: false, message: "Error While getting Portfolio" })
  }
};

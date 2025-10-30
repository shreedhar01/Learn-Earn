import { Router, type Router as ExpressRouter } from "express";
import { getUsersAllTrades,placeTrade } from "../controller/trades.controller.js";
const router:ExpressRouter = Router()

router.route("/").post(placeTrade)
router.route("/:solana_address").get(getUsersAllTrades)


export default router
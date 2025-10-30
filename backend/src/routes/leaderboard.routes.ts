import { Router, type Router as ExpressRouter } from "express";
import { getLeaderboard,getUserRanking } from "../controller/leaderboard.controller.js";

const router:ExpressRouter = Router()

router.route("/").get(getLeaderboard)
router.route("/:solana_address").get(getUserRanking)

export default router
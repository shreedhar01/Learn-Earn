import { Router, type Router as ExpressRouter } from "express";
import { getUserFUSDTBalance } from "../controller/users.controller.js";

const router:ExpressRouter = Router()

router.route("/:solana_address").get(getUserFUSDTBalance)

export default router
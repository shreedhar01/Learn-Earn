import { Router, type Router as ExpressRouter } from "express";
import { getPortfolio } from "../controller/portfolio.controller.js";

const router:ExpressRouter = Router()

router.route("/:solana_address").get(getPortfolio)


export default router
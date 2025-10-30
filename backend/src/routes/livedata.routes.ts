import { Router, type Router as ExpressRouter  } from "express";
import { streamLiveData,allTickData } from "../controller/livedata.controller.js";

const router:ExpressRouter = Router();
// router.route("/").get(streamLiveData);
router.route("/all-ticker-data").get(allTickData)

export default router;

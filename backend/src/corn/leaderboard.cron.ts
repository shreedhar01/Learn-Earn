import cron from "node-cron";
import { generateLeaderBoard } from "../controller/leaderboard.controller.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Generating daily leaderboard...");
  await generateLeaderBoard();
});

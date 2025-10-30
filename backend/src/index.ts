import express from "express"
import cors from "cors"
import "./corn/leaderboard.cron.js"

const app = express()
app.use(cors())
app.use(express.json())


import userRoute from "./routes/users.routes.js"
import liveData from "./routes/livedata.routes.js"
import tradeRoute from "./routes/trades.routes.js"
import portfolioRoute from "./routes/portfolio.routes.js"
import leaderboardRoute from "./routes/leaderboard.routes.js"

app.use("/api/v1/user",userRoute)
app.use("/api/v1/liveData",liveData)
app.use("/api/v1/trade",tradeRoute)
app.use("/api/v1/portfolio",portfolioRoute)
app.use("/api/v1/leaderboard",leaderboardRoute)

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port :: ${process.env.PORT}`)
})
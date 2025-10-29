import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())


import userRoute from "./routes/users.routes.js"
import liveData from "./routes/livedata.routes.js"

app.use("/api/v1/user",userRoute)
app.use("/api/v1/liveData",liveData)


app.listen(process.env.PORT,()=>{
    console.log(`Server running on port :: ${process.env.PORT}`)
})
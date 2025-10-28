import express from "express"

const app = express()


import userRoute from "./routes/users.routes.js"

app.use("/api/v1/user",userRoute)


app.listen(process.env.PORT,()=>{
    console.log(`Server running on port :: ${process.env.PORT}`)
})
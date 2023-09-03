const mongoose = require("mongoose")
const express = require ("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const users = require("./routes/auth/userRoutes")
mongoose.connect("mongodb://localhost:27017/discount")

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


app.listen(5000 , ()=>console.log("server has run on port 5000"))
app.get("/",(req , res)=>{
    res.send("hi I am working")
})

// app.use("/auth-business-owner",authBusinessOwner)
app.use("/",users)
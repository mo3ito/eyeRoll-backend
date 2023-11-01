const mongoose = require("mongoose")
const express = require ("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const businessOwnersRegisteration = require("./routes/businessOwners/registeration")
const usersRegisteration  = require("./routes/users/registeration")
const businessOwnersOnlineMenu = require("./routes/businessOwners/onlineMenu")
const rollSetting = require("./routes/businessOwners/rolls")
require('dotenv').config();

mongoose.connect("mongodb://localhost:27017/discount")

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


app.listen(5000 , ()=>console.log("server has run on port 5000"))
app.get("/",(req , res)=>{
    res.send("hi I am working")
    
})


app.use("/",businessOwnersRegisteration)
app.use("/",businessOwnersOnlineMenu)
app.use("/",usersRegisteration)
app.use("/",rollSetting)
app.use('/public', express.static('public'));


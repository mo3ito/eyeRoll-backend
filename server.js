const mongoose = require("mongoose")
const express = require ("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const adminRegisteration = require("./routes/admins/registeration")
const businessOwnersRegisteration = require("./routes/businessOwners/registeration")
const usersRegisteration  = require("./routes/users/registeration")
const businessOwnersOnlineMenu = require("./routes/businessOwners/onlineMenu")
const rollSetting = require("./routes/businessOwners/rolls")
const searchInformation = require("./routes/searchInformation/searchInformation")
const usersSeenReports = require("./routes/reports/userSeenReports")
const registerationRequests = require("./routes/admins/requests")
require('dotenv').config();
const {createServer} = require("http")
const {Server} = require("socket.io")
const ServerPort = process.env.SERVER_PORT ? process.env.SERVERPORT : 5000;
const {configureSocketRequests} = require("./socket/requestSocket")

mongoose.connect("mongodb://localhost:27017/eyeRoll")
app.use(express.json())
app.use(bodyParser.json())
app.use(cors({
    origin:'*'
}))

app.get("/",(req , res)=>{
    res.send("hi I am working")
    
})

const socketServer = createServer(app)


socketServer.listen(ServerPort , ()=>console.log("server has run on port 5000"))
const ioConfigureSocketRequests = configureSocketRequests(socketServer)

app.use("/",adminRegisteration)
app.use("/",businessOwnersRegisteration)
app.use("/",businessOwnersOnlineMenu)
app.use("/",usersRegisteration)
app.use("/",rollSetting)
app.use("/",searchInformation)
app.use("/",usersSeenReports)
app.use("/",registerationRequests)
app.use('/public', express.static('public'));


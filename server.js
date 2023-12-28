const mongoose = require("mongoose")
const express = require ("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const businessOwnersRegisteration = require("./routes/businessOwners/registeration")
const usersRegisteration  = require("./routes/users/registeration")
const businessOwnersOnlineMenu = require("./routes/businessOwners/onlineMenu")
const rollSetting = require("./routes/businessOwners/rolls")
const searchInformation = require("./routes/searchInformation/searchInformation")
const usersSeenReports = require("./routes/reports/userSeenReports")
require('dotenv').config();
const {createServer} = require("http")
const {Server} = require("socket.io")
const ServerPort = process.env.SERVER_PORT ? process.env.SERVERPORT : 5000;
const onlineMenuSocketPort = process.env.SOCKET_PORT ? process.env.SOCKET_PORT : 5001;
const eyeRollSocketPort = process.env.EYE_ROLL_SERVER_PORT ? process.env.SERVERPORT : 5002;
const {configurePageOnlineMenuSocket} = require("./socket/onlineMenuSocket")
const {configurePageEyeRollSocket} = require("./socket/pageEyeRollSocket")

mongoose.connect("mongodb://localhost:27017/discount")




const onlineMenuSocketServer = createServer()
const eyeRollSocketServer = createServer();



const ioPageOnlineMenu = configurePageOnlineMenuSocket(onlineMenuSocketServer)
const ioPageEyeRoll = configurePageEyeRollSocket(eyeRollSocketServer);




app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.get("/",(req , res)=>{
    res.send("hi I am working")
    
})

app.listen(ServerPort , ()=>console.log("server has run on port 5000"))
onlineMenuSocketServer.listen(onlineMenuSocketPort , ()=> console.log("online menu server socket connected on port 5001"))
eyeRollSocketServer.listen(eyeRollSocketPort, () => console.log("eyeRoll page server socket connected on port 5002"));



app.use("/",businessOwnersRegisteration)
app.use("/",businessOwnersOnlineMenu)
app.use("/",usersRegisteration)
app.use("/",rollSetting)
app.use("/",searchInformation)
app.use("/",usersSeenReports)
app.use('/public', express.static('public'));


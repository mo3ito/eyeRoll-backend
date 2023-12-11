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
require('dotenv').config();
const {createServer} = require("http")
const {Server} = require("socket.io")
const ServerPort = process.env.SERVER_PORT ? process.env.SERVERPORT : 5000;
const socketPort = process.env.SOCKET_PORT ? process.env.SOCKET_PORT : 5001;
const configureSocket = require("./socket/socket")

mongoose.connect("mongodb://localhost:27017/discount")


const server = createServer(app)


const io = configureSocket(server)




app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


app.listen(ServerPort , ()=>console.log("server has run on port 5000"))
app.get("/",(req , res)=>{
    res.send("hi I am working")
    
})

server.listen(socketPort , ()=> console.log("socket connected on port 5001"))


app.use("/",businessOwnersRegisteration)
app.use("/",businessOwnersOnlineMenu)
app.use("/",usersRegisteration)
app.use("/",rollSetting)
app.use("/",searchInformation)
app.use('/public', express.static('public'));


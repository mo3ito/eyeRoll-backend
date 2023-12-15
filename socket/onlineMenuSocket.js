const {Server} = require("socket.io")

const configureSocket = (server)=>{
    let seenUser = 0

const io = new Server(server , {
    cors:{
        origin: "*",
    }
})

io.on("connection" , (socket)=>{
    console.log("A user connected");
    console.log("online menu seen", seenUser += 1 );
    console.log(socket.id);
})

return io;

}

module.exports = configureSocket;
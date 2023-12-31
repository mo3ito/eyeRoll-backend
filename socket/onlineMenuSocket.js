const { Server } = require("socket.io");
const ReportsModel = require("../models/BusinessOwners/Reports");



const configurePageOnlineMenuSocket = async (server) => {
  
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

    io.on("connection", async (socket) => {
      
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    socket.on("join", async (dataFromClient) => {
      console.log("Received data from client:", dataFromClient);

      const { seenUser, seenDate, businessOwnerId } = dataFromClient;
      let report = await ReportsModel.findOne({ businessOwnerId });

      if (!report) {
        // اگر داکیومنت برای این businessOwnerId وجود نداشت، آن را ایجاد کنید
        report = await new ReportsModel({
          businessOwnerId,
          eyeRoll_all_seen_user: [],
          online_menu_all_seen_user:[]
        });
      }

      // افزودن seen جدید به آرایه all_seen_user
      report.online_menu_all_seen_user.push({ seenUser, seenDate });
      await report.save();
    });
    
  });

  return io;
};

module.exports = { configurePageOnlineMenuSocket };


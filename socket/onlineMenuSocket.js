
// const { Server } = require("socket.io");

// const configurePageOnlineMenuSocket = (server) => {
//     let seenUser = 0;

//     const io = new Server(server, {
//         cors: {
//             origin: "*",
//         },
//     });

//     io.on("connection", async (socket) => {
//         console.log("A user connected");
//         console.log("Seen users:", seenUser);
//         console.log(socket.id);

//         // ارسال تعداد seenUser به فرانت‌اند هنگام اتصال جدید
//         io.emit("updateSeenUser", seenUser);

//         // افزایش تعداد seenUser در هر نقره صفحه
//         socket.on("pageSeen", () => {
//             seenUser += 1;
//             // ارسال تعداد به‌روزرسانی شده به همه کلاینت‌ها
//             io.emit("updateSeenUser", seenUser);
//         });

//         // Cleanup
//         socket.on("disconnect", () => {
//             console.log("A user disconnected");
//         });
//     });

    
//     return io;
// };

// module.exports = configurePageOnlineMenuSocket;

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
        report = new ReportsModel({
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


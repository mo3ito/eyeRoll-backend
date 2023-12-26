const {Server} = require("socket.io")

const configurePageEyeRollSocket = (server)=>{
    let seenUser = 0

const io = new Server(server , {
    cors:{
        origin: "*",
    }
})

io.on("connection" , (socket)=>{
    console.log("A user connected");
    console.log("eyeRoll seen", seenUser += 1 );
    console.log(socket.id);
})

return io;

}

module.exports = configurePageEyeRollSocket;


// const { Server } = require("socket.io");

// const configurePageEyeRollSocket = (server) => {
//     let seenUser = 0;

//     const io = new Server(server, {
//         cors: {
//             origin: "*",
//         },
//     });

//     io.on("connection", (socket) => {
//         console.log("A user connected");
//         console.log("eyeRoll seen", seenUser);
//         console.log(socket.id);
//         seenUser+=1

//         // ارسال اطلاعات به فرانت‌اند هنگام اتصال جدید
//         socket.emit("updateSeenUser", seenUser);

//         // افزایش تعداد seenUser در هر نقره صفحه
//         socket.on("pageSeen", () => {
//             seenUser;
//             // ارسال تعداد به‌روزرسانی شده به همه کلاینت‌ها
//             io.emit("updateSeenUser", seenUser);
//         });

//         // Cleanup
//         socket.on("disconnect", () => {
//             console.log("A user disconnected");
//             // ارسال تعداد به‌روزرسانی شده به همه کلاینت‌ها بعد از دیسکانکت
//             io.emit("updateSeenUser", seenUser);
//         });
//     });

//     return io;
// };

// module.exports = configurePageEyeRollSocket;

const { Server } = require("socket.io");

const configurePageOnlineMenuSocket = (server) => {
    let seenUser = 0;

    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", async (socket) => {
        console.log("A user connected");
        console.log("Seen users:", seenUser);
        console.log(socket.id);

        // ارسال تعداد seenUser به فرانت‌اند هنگام اتصال جدید
        io.emit("updateSeenUser", seenUser);

        // افزایش تعداد seenUser در هر نقره صفحه
        socket.on("pageSeen", () => {
            seenUser += 1;
            // ارسال تعداد به‌روزرسانی شده به همه کلاینت‌ها
            io.emit("updateSeenUser", seenUser);
        });

        // Cleanup
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    return io;
};

module.exports = configurePageOnlineMenuSocket;

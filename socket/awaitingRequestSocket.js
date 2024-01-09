// const {Server} = require("socket.io")
// const AwaitingDiscountPaymentModel = require("../models/BusinessOwners/AwaitingDiscountPayment")

// const configureAwaitingRequest = (server)=>{

//     const io = new Server(server, {
//         cors: {
//           origin: "*",
//         },
//       });

//       io.on("connection", async (socket) => {
//         console.log(socket.id);
//         socket.on("getBusinessOwnerId", async (businessOwnerId) => {
//           try {
//             const businessOwnerRequests = await AwaitingDiscountPaymentModel.findOne({ businessOwnerId });
//             const allRequest = businessOwnerRequests ? businessOwnerRequests.awaiting_discounts.reverse() : [];
//             console.log("Sending data to clients:", allRequest);
//             socket.emit("awaitingData", allRequest);
//           } catch (error) {
//             console.error("Error retrieving data:", error);
//           }
//         });
    
//         socket.on("disconnect", () => {
//           console.log("A user disconnected");
//         });
//       });

// }

// module.exports = {configureAwaitingRequest}

// socketManager.js

// socketManager.js

const { Server } = require("socket.io");
const AwaitingDiscountPaymentModel = require("../models/BusinessOwners/AwaitingDiscountPayment");

let io; // متغیر global برای ذخیره شیء io

const configureAwaitingRequest = (server) => {
  if (io) {
    // اگر io قبلاً مقداردهی شده باشد، مانع از مقداردهی مجدد شود
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log(socket.id);
    socket.on("getBusinessOwnerId", async (businessOwnerId) => {
      try {
        const businessOwnerRequests = await AwaitingDiscountPaymentModel.findOne({ businessOwnerId });
        const allRequest = businessOwnerRequests ? businessOwnerRequests.awaiting_discounts.reverse() : [];
        console.log("Sending data to clients:", allRequest);
        socket.emit("awaitingData", allRequest);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

const getIo = () => {
  
  return io;
};

module.exports = { configureAwaitingRequest, getIo };





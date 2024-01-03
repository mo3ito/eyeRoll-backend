// const {Server} = require("socket.io")
// const AwaitingDiscountPaymentModel = require("../models/BusinessOwners/AwaitingDiscountPayment")

// const configureAwaitingRequest = (server)=>{

//     const io = new Server(server, {
//         cors: {
//           origin: "*",
//         },
//       });

//       io.on("connection", async (socket) => {
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





const { Server } = require("socket.io");
const AwaitingDiscountPaymentModel = require("../models/BusinessOwners/AwaitingDiscountPayment");

const configureAwaitingRequest = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    const changeStream = AwaitingDiscountPaymentModel.watch();
    changeStream.on("change", (change) => {
      console.log("Change occurred in AwaitingDiscountPaymentModel:", change);
      if (change.operationType === "insert" || change.operationType === "update" || change.operationType === "replace") {
        sendAwaitingData(socket);
      }
    });
    socket.on("getBusinessOwnerId", () => {
      sendAwaitingData(socket);
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
const sendAwaitingData = async (socket) => {
  try {
    const allRequests = await AwaitingDiscountPaymentModel.find();
    const flattenedRequests = allRequests.flatMap(request => request).reverse();
    console.log("Sending data to clients:", flattenedRequests);
    socket.emit("awaitingData", flattenedRequests);
  } catch (error) {
    console.error("Error retrieving and sending data:", error);
  }
};

module.exports = { configureAwaitingRequest };


// const { Server } = require("socket.io");
// const AwaitingDiscountPaymentModel = require("../models/BusinessOwners/AwaitingDiscountPayment");

// const configureAwaitingRequest = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   // Function to send data to all clients
//   const emitDataToClients = async () => {
//     try {
//       const businessOwnerRequests = await AwaitingDiscountPaymentModel.find();
//       const allRequest = businessOwnerRequests.map((data) => data.awaiting_discounts.reverse());
//       console.log("Sending data to clients:", allRequest);
//       io.emit("awaitingData", allRequest);
//     } catch (error) {
//       console.error("Error retrieving data:", error);
//     }
//   };

//   io.on("connection", async (socket) => {
//     // Emit data when a new client connects
//     emitDataToClients();

//     // Watch for changes in the AwaitingDiscountPaymentModel
//     const changeStream = AwaitingDiscountPaymentModel.watch();
//     changeStream.on("change", (change) => {
//       console.log("Change in AwaitingDiscountPaymentModel detected:", change);
//       // When there's a change, emit data to all clients
//       emitDataToClients();
//     });

//     socket.on("disconnect", () => {
//       console.log("A user disconnected");
//     });
//   });
// };

// module.exports = { configureAwaitingRequest };

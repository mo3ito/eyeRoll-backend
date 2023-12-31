const {Server} = require("socket.io")
const AwaitingDiscountPaymentModel = require("../models/BusinessOwners/AwaitingDiscountPayment")

const configureAwaitingRequest = (server)=>{

    const io = new Server(server, {
        cors: {
          origin: "*",
        },
      });

      io.on("connection", async (socket) => {
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

}

module.exports = {configureAwaitingRequest}
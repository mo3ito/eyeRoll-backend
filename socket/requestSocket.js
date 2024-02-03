const { Server } = require("socket.io");
const AwaitingDiscountPaymentModel = require("../models/BusinessOwners/AwaitingDiscountPayment");
const BusinessOwnersSocketIdModel = require("../models/BusinessOwners/BusinessOwnersSocketId");
const moment = require("moment");
const ReportsModel = require("../models/BusinessOwners/Reports");

let intervalDeleteExpireDiscount;

const addNewBusinessOwner = async (businessOwnerId, socketId) => {
  try {
    const existingBusinessOwner = await BusinessOwnersSocketIdModel.findOne({
      businessOwnerId,
    });

    if (!existingBusinessOwner) {
      const newBusinessOwner = new BusinessOwnersSocketIdModel({
        businessOwnerId,
        socketId,
      });
      await newBusinessOwner.save();
      console.log(
        `Business owner with businessOwnerId ${businessOwnerId} and socketId ${socketId} added successfully.`
      );
    } else {
      console.log(
        `Business owner with businessOwnerId ${businessOwnerId} already exists.`
      );
      existingBusinessOwner.socketId = socketId;
      existingBusinessOwner.save();
    }
  } catch (error) {
    console.error("Error adding new business owner:", error);
  }
};

const removeBusinssOwner = async (socketId) => {
  try {
    await BusinessOwnersSocketIdModel.deleteOne({ socketId });
    console.log(
      `Business owner with socketId ${socketId} removed successfully.`
    );
  } catch (error) {
    console.error(
      `Error removing business owner with socketId ${socketId}:`,
      error
    );
  }
};

const removeExpireAwaitingRequest = async (
  model,
  businessOwnerId,
  io,
  receiver
) => {
  try {
    if (
      !model ||
      !model.awaiting_discounts ||
      model.awaiting_discounts.length === 0
    ) {
      let validRequest = [];
      return validRequest;
    }

    const dateNow = moment();

    const validRequest = model.awaiting_discounts.filter((discount) => {
      if (discount.expiration_time) {
        const discountExpiration = moment(discount.expiration_time);
        return discountExpiration.isSameOrAfter(dateNow);
      }
      return false;
    });

    await AwaitingDiscountPaymentModel.findOneAndUpdate(
      { businessOwnerId },
      { awaiting_discounts: validRequest },
      { new: true }
    );

    io.to(receiver.socketId).emit("awaitingData", validRequest);

    console.log("validRequest", validRequest);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getBusinessOwner = async (businessOwnerId) => {
  return await BusinessOwnersSocketIdModel.findOne({ businessOwnerId });
};

const configureSocketRequests = (server) => {
  console.log("config server");
  const io = new Server(server, {
    origin: "*",
    cors: {
      origin: "*",
    },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("start connection socket ");
    socket.on("newBusinessOwner", (businessOwnerId) => {
      addNewBusinessOwner(businessOwnerId, socket.id);
    });

    socket.on("sendAllRequest", async ({ businessOwnerId }) => {
      try {
        console.log(businessOwnerId);
        const result = await AwaitingDiscountPaymentModel.findOne({
          businessOwnerId,
        });
        const receiver = await getBusinessOwner(businessOwnerId);
        console.log("result", result);
        let allRequest = await result.awaiting_discounts.reverse();
        io.to(receiver.socketId).emit("awaitingData", allRequest);

        if (!intervalDeleteExpireDiscount) {
          intervalDeleteExpireDiscount = setInterval(async () => {
            const result = await AwaitingDiscountPaymentModel.findOne({
              businessOwnerId,
            });
            const receiver = await getBusinessOwner(businessOwnerId);
            await removeExpireAwaitingRequest(
              result,
              businessOwnerId,
              io,
              receiver
            );
          }, 30000);
        }
      } catch (error) {
        console.error("error", error);
      }
    });

    socket.on("sendNewRequest", async ({ businessOwnerId, newRequest }) => {
      try {
        const result = await AwaitingDiscountPaymentModel.findOneAndUpdate(
          { businessOwnerId },
          { $push: { awaiting_discounts: newRequest } },
          { new: true, upsert: true }
        );

        console.log("result", result.awaiting_discounts);

        const receiver = await getBusinessOwner(businessOwnerId);
        console.log("businessOwnerId", businessOwnerId);
        console.log("receiver", receiver);
        let allRequest = await result.awaiting_discounts.reverse();
        io.to(receiver.socketId).emit("awaitingData", allRequest);
      } catch (error) {
        console.error("error", error);
      }
    });

    socket.on("disconnect", () => {
      removeBusinssOwner(socket.id);
    });

    socket.on("join_online_menu_socket", async (dataFromClient) => {
      console.log("Received data from client:", dataFromClient);

      const { seenUser, seenDate, businessOwnerId } = dataFromClient;
      let report = await ReportsModel.findOne({ businessOwnerId });

      if (!report) {
        report = await new ReportsModel({
          businessOwnerId,
          eyeRoll_all_seen_user: [],
          online_menu_all_seen_user:[]
        });
      }

      report.online_menu_all_seen_user.push({ seenUser, seenDate });
      await report.save();
    });

    socket.on("join_pageEyRollSocket", async (dataFromClient) => {
      console.log("Received data from client:", dataFromClient);

      const { seenUser, seenDate, businessOwnerId } = dataFromClient;
      
      let report = await ReportsModel.findOne({ businessOwnerId });

      if (!report) {
        report = await new ReportsModel({
          businessOwnerId,
          eyeRoll_all_seen_user: [],
          online_menu_all_seen_user:[]
        });
      }

      report.eyeRoll_all_seen_user.push({ seenUser, seenDate });
      await report.save();
    });
    
  });

  io.on("error", (err) => {
    console.log("socket error => ", err);
  });
};

module.exports = { configureSocketRequests };

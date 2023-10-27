const mongoose = require("mongoose");
const { Schema } = mongoose;

const RollAdjustedSchema = new Schema({
  businessOwner_id: {
    type: "String",
  },
  minPercentageAllProducts: {
    type: "String",
  },
  maxPercentageAllProducts: {
    type: "String",
  },
  minPercentagePeak: {
    type: "String",
  },
  maxPercentagePeak: {
    type: "String",
  },
  giftValue: {
    type: "String",
  },
  numberPurchaseGift: {
    type: "String",
  },
  startDateWithoutTime: {
    type: "String",
  },
  endDateWithoutTime: {
    type: "String",
   
  },
  firstHour: {
    type: "String",
  },
  firstMins: {
    type: "String",
  },
  lastHour: {
    type: "String",
  },
  lastMins: {
    type: "String",
  },
  startDate: {
    type: "String",
  },
  firstHourPeak: {
    type: "String",
  },
  firstMinsPeak: {
    type: "String",
  },
  lastHourPeak: {
    type: "String",
  },
  lastMinsPeak: {
    type: "String",
  },
});

const RollAdjusted = mongoose.model("roll-adjusted", RollAdjustedSchema);

module.exports = RollAdjusted;

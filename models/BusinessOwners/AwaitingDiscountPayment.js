const mongoose = require("mongoose");
const { Schema } = mongoose;

const AwaitingDiscountPaymentSchema = new Schema({
  businessOwnerId: {
    type: String,
  },
  awaiting_discounts: {
    type: Array,
    default: [],
  },
});

const AwaitingDiscountPayment = mongoose.model(
  "awaiting-discount-payment",
  AwaitingDiscountPaymentSchema
);

module.exports = AwaitingDiscountPayment;

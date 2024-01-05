const mongoose = require("mongoose");
const { Schema } = mongoose;

const AwaitingDiscountPaymentSchema = new Schema({
  businessOwnerId: {
    type: String,
    required: true,
  },
  awaiting_discounts: [
    {
      discountId: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      discount: {
        type: String,
        required: true,
      },
      expiration_time: {
        type: Date,
        required: true,
      },
    },
  ],
});

const AwaitingDiscountPayment = mongoose.model(
  "awaiting-discount-payment",
  AwaitingDiscountPaymentSchema
);

module.exports = AwaitingDiscountPayment;

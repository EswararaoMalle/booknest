const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  total: Number,
  paymentMethod: { type: String, default: "Cash on Delivery" }
});

module.exports = mongoose.model("Order", orderSchema);

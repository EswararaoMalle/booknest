const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
        quantity: { type: Number, default: 1 },

        // ✅ snapshots so even if book changes later, order still shows image/title
        title: { type: String, default: "" },
        author: { type: String, default: "" },
        cover: { type: String, default: "" },
        price: { type: Number, default: 0 },

        // ✅ for seller filtering
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      },
    ],

    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },

    // ✅ NEW: Order status
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

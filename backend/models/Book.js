const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    cover: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },

    // ✅ NEW: link book to seller
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

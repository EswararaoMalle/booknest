const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    cover: { type: String, default: "" }, // ✅ cover url
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

const router = require("express").Router();
const Cart = require("../models/Cart");

// ✅ Add to cart
router.post("/add", async (req, res) => {
  try {
    console.log("CART REQ BODY:", req.body);

    const { userId, bookId, quantity } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ message: "userId and bookId required" });
    }

    const existing = await Cart.findOne({ userId, bookId });

    if (existing) {
      existing.quantity += Number(quantity || 1);
      await existing.save();
      return res.json(existing);
    }

    const item = await Cart.create({
      userId,
      bookId,
      quantity: Number(quantity || 1),
    });

    return res.status(201).json(item);
  } catch (err) {
    console.log("CART ADD ERROR >>>", err);
    return res.status(500).json({ message: err.message });
  }
});

// ✅ Get cart items for user (with book details)
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId }).populate("bookId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete single cart item
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Cart item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const router = require("express").Router();
const Order = require("../models/Order");
const Book = require("../models/Book");

/**
 * ✅ CREATE ORDER
 * Body:
 * { userId, items:[{bookId, quantity}], total, paymentMethod }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, items, total, paymentMethod } = req.body;

    if (!userId || !items?.length) {
      return res.status(400).json({ message: "userId and items required" });
    }

    // fetch books to create snapshots + sellerId
    const bookIds = items.map((i) => i.bookId);
    const books = await Book.find({ _id: { $in: bookIds } });

    const enrichedItems = items.map((it) => {
      const b = books.find((x) => String(x._id) === String(it.bookId));
      return {
        bookId: it.bookId,
        quantity: Number(it.quantity || 1),

        title: b?.title || "",
        author: b?.author || "",
        cover: b?.cover || "",
        price: b?.price || 0,
        sellerId: b?.sellerId || null,
      };
    });

    const order = await Order.create({
      userId,
      items: enrichedItems,
      total: Number(total || 0),
      paymentMethod: paymentMethod || "Cash on Delivery",
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order create failed", error: err.message });
  }
});

/** ✅ USER: get orders by userId */
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("items.bookId"); // optional
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch user orders failed" });
  }
});

/** ✅ SELLER: get orders that contain sellerId in items */
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const orders = await Order.find({ "items.sellerId": req.params.sellerId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch seller orders failed" });
  }
});

/** ✅ ADMIN: get all orders */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch all orders failed" });
  }
});

/** ✅ UPDATE STATUS (Seller/Admin)
 * PUT /api/orders/:id/status
 * Body: { status: "Accepted" | "Delivered" | "Cancelled" | "Pending" }
 */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["Pending", "Accepted", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

module.exports = router;

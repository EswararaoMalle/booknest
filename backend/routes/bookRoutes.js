const router = require("express").Router();
const Book = require("../models/Book");

// ✅ GET books with optional search + category
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { author: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// ✅ ADD BOOK (Seller)
router.post("/", async (req, res) => {
  try {
    const { title, author, price, cover, category, sellerId } = req.body;

    if (!title || !author || price === undefined) {
      return res.status(400).json({ message: "title, author, price required" });
    }

    const book = await Book.create({
      title: String(title).trim(),
      author: String(author).trim(),
      price: Number(price),
      cover: cover ? String(cover).trim() : "",
      category: category ? String(category).trim() : "General",
      sellerId: sellerId || null,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: "Failed to add book", error: err.message });
  }
});

// ✅ DELETE BOOK
router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;

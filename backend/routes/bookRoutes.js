const router = require("express").Router();
const Book = require("../models/Book");

// ✅ Add Book (with cover)
router.post("/", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { title, author, price, cover } = req.body;

    if (!title || !author || price === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const book = await Book.create({
      title,
      author,
      price: Number(price),
      cover: cover ? String(cover).trim() : "",
    });

    return res.status(201).json(book);
  } catch (err) {
    console.log("ADD BOOK ERROR >>>", err);
    return res.status(500).json({ message: err.message });
  }
});

// ✅ Get All Books
router.get("/", async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
});

// ✅ Delete Book
router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

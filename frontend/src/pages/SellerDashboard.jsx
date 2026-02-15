import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function SellerDashboard() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState(""); // ✅ NEW
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:5000/api/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async () => {
    if (!title || !author || !price) {
      alert("All fields required");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        author: author.trim(),
        price: Number(price),
        cover: cover.trim(), // ✅ send cover
      };

      console.log("SENDING:", payload);

      await axios.post("http://localhost:5000/api/books", payload);

      alert("Book Added Successfully ✅");
      setTitle("");
      setAuthor("");
      setPrice("");
      setCover("");
      fetchBooks();
    } catch (err) {
      console.log("BACKEND MESSAGE:", err?.response?.data);
      alert(err?.response?.data?.message || "Failed to add book");
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      alert("Book Deleted ✅");
      fetchBooks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Seller Dashboard</h2>

        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>Add Book</h3>

          <input
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="Cover Image URL (paste link)"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />

          <button onClick={addBook}>Add Book</button>
        </div>

        <h3>All Books</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {books.map((b) => (
            <div className="card" key={b._id}>
              <img
                src={
                  b.cover && b.cover.trim()
                    ? b.cover
                    : "https://via.placeholder.com/300x400?text=No+Cover"
                }
                alt={b.title}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x400?text=No+Cover";
                }}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />

              <h3>{b.title}</h3>
              <p>
                <b>Author:</b> {b.author}
              </p>
              <p>
                <b>Price:</b> ₹{b.price}
              </p>
              <button onClick={() => deleteBook(b._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

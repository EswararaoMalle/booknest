import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = ["All", "General", "Fiction", "Technology", "Education", "Biography"];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/books", {
        params: {
          search: q,
          category: category,
        },
      });
      setBooks(res.data || []);
    } catch (err) {
      console.log("BOOK FETCH ERROR:", err?.response?.data || err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category]);

  const addToCart = async (bookId) => {
    if (!user?._id) {
      alert("Please login to add to cart");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        bookId,
        quantity: 1,
      });
      alert("Added to Cart ✅");
    } catch (err) {
      alert(err?.response?.data?.message || "Add to cart failed");
    }
  };

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-chip">🔎 Search • Filter • Add to Cart</div>
            <h1>Browse Books</h1>
            <p>Search by title/author and filter category-wise.</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
              <input
                className="input"
                placeholder="Search by title or author..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ maxWidth: "420px" }}
              />

              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ maxWidth: "220px" }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button className="btn btn-primary" onClick={fetchBooks}>
                Search
              </button>
            </div>
          </div>

          <div className="hero-card">
            <b>Results</b>
            <ul>
              <li>Category: <b>{category}</b></li>
              <li>Query: <b>{q.trim() ? q.trim() : "—"}</b></li>
              <li>Books: <b>{books.length}</b></li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container">
        <h2 style={{ margin: 0 }}>Available Books</h2>
        <p className="muted" style={{ marginTop: "6px" }}>
          Showing <b>{books.length}</b> book(s)
        </p>

        {loading ? (
          <p className="muted" style={{ marginTop: "12px" }}>Loading books...</p>
        ) : books.length === 0 ? (
          <p className="muted" style={{ marginTop: "12px" }}>
            No books found. Try another search or category.
          </p>
        ) : (
          <div className="grid" style={{ marginTop: "14px" }}>
            {books.map((book) => (
              <div className="card" key={book._id}>
                <img
                  className="card-img"
                  src={
                    book.cover && book.cover.trim()
                      ? book.cover
                      : "https://via.placeholder.com/300x400?text=No+Cover"
                  }
                  alt={book.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/300x400?text=No+Cover";
                  }}
                />

                <div className="card-body">
                  <h3 className="card-title" title={book.title}>
                    {book.title}
                  </h3>

                  <p className="muted">
                    <b>Author:</b> {book.author}
                  </p>

                  <p className="muted" style={{ marginTop: "6px" }}>
                    <b>Category:</b> {book.category || "General"}
                  </p>

                  <div className="row">
                    <span className="price">₹{book.price}</span>
                    <button className="btn btn-primary" onClick={() => addToCart(book._id)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

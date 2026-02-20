import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        setBooks((res.data || []).slice(0, 8));
      } catch (e) {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <Navbar />

      {/* ✅ HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-chip">🛒 Online Book Store using MERN Stack</div>
            <h1>Discover your next favorite book.</h1>
            <p>
              Browse books as a guest. Login/Register to add to cart and place
              <b> Cash on Delivery</b> orders.
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
              <Link className="btn btn-primary" to="/register">
                Create Account
              </Link>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
            </div>
          </div>

          
        </div>
      </section>

      {/* ✅ BOOKS */}
      <div className="container">
        <h2 style={{ margin: 0 }}>Popular Books</h2>
        <p className="muted" style={{ marginTop: "6px" }}>
          Login to purchase • Showing top {books.length} books
        </p>

        {loading ? (
          <p className="muted" style={{ marginTop: "12px" }}>Loading books...</p>
        ) : books.length === 0 ? (
          <p className="muted" style={{ marginTop: "12px" }}>
            No books found. Add books from Seller Dashboard.
          </p>
        ) : (
          <div className="grid">
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

                  <div className="row">
                    <span className="price">₹{book.price}</span>
                    <Link className="btn btn-primary" to="/login">
                      Login to Buy
                    </Link>
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

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/books").then((res) => {
      // show only first 8 books on landing
      setBooks(res.data.slice(0, 8));
    });
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <h1>BookNest 📚</h1>
          <p>Discover books, add to cart, and order with Cash on Delivery.</p>
        </div>
      </div>

      {/* PREVIEW BOOKS */}
      <div style={{ padding: "20px" }}>
        <h2>Popular Books</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "15px",
          }}
        >
          {books.map((book) => (
            <div className="card" key={book._id}>
              <img
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
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />
              <h3>{book.title}</h3>
              <p><b>Author:</b> {book.author}</p>
              <p><b>Price:</b> ₹{book.price}</p>
              <p style={{ fontSize: "13px", color: "#555" }}>
                Login to add to cart & order
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

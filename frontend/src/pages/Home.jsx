import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [books, setBooks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://localhost:5000/api/books").then((res) => setBooks(res.data));
  }, []);

  const addToCart = async (bookId) => {
    await axios.post("http://localhost:5000/api/cart/add", {
      userId: user._id,
      bookId,
      quantity: 1,
    });

    alert("Added to Cart ✅");
  };

  return (
    <>
      <Navbar />

      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to BookNest 📚</h1>
          <p>Your favorite online bookstore</p>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <h2>Available Books</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
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

              <button onClick={() => addToCart(book._id)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    if (!user?._id) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      setCart(res.data || []);
    } catch (err) {
      console.log("CART FETCH ERROR:", err?.response?.data || err.message);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      fetchCart();
    } catch (err) {
      alert("Remove failed");
    }
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item?.bookId?.price || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [cart]);

 const placeOrder = async () => {
  try {
    const cleanItems = cart.map((it) => ({
      bookId: it.bookId?._id || it.bookId,
      quantity: it.quantity || 1,
    }));

    await axios.post("http://localhost:5000/api/orders", {
      userId: user._id,
      items: cleanItems,
      total,
      paymentMethod: "Cash on Delivery",
    });

    for (let item of cart) {
      await axios.delete(`http://localhost:5000/api/cart/${item._id}`);
    }

    alert("Order Placed ✅ (Cash on Delivery)");
    fetchCart();
  } catch (err) {
    alert(err?.response?.data?.message || "Order failed");
  }
};


  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-chip">🧺 Cart • Checkout</div>
            <h1>Your Cart</h1>
            <p>
              Review items, remove unwanted books, and place your COD order.
            </p>
          </div>

          <div className="hero-card">
            <b>Summary</b>
            <ul>
              <li>Items: <b>{cart.length}</b></li>
              <li>Total: <b>₹{total}</b></li>
              <li>Payment: <b>Cash on Delivery</b></li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container">
        {!user?._id ? (
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ margin: 0 }}>Login required</h3>
            <p className="muted" style={{ marginTop: "8px" }}>
              Please login to view your cart.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Link className="btn btn-primary" to="/login">
                Go to Login
              </Link>
              <Link className="btn btn-ghost" to="/register">
                Create Account
              </Link>
            </div>
          </div>
        ) : loading ? (
          <p className="muted">Loading cart...</p>
        ) : cart.length === 0 ? (
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ margin: 0 }}>Your cart is empty</h3>
            <p className="muted" style={{ marginTop: "8px" }}>
              Add some books from Home and come back.
            </p>
            <Link className="btn btn-primary" to="/home">
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
              {cart.map((item) => (
                <div className="card" key={item._id}>
                  <img
                    className="card-img"
                    src={
                      item.bookId?.cover && item.bookId.cover.trim()
                        ? item.bookId.cover
                        : "https://via.placeholder.com/300x400?text=No+Cover"
                    }
                    alt={item.bookId?.title || "Book"}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x400?text=No+Cover";
                    }}
                  />

                  <div className="card-body">
                    <h3 className="card-title" title={item.bookId?.title || ""}>
                      {item.bookId?.title || "Unknown Book"}
                    </h3>

                    <p className="muted">
                      <b>Price:</b> ₹{item.bookId?.price || 0} • <b>Qty:</b>{" "}
                      {item.quantity || 1}
                    </p>

                    <div className="row">
                      <span className="price">
                        ₹{(item.bookId?.price || 0) * (item.quantity || 1)}
                      </span>

                      <button
                        className="btn btn-danger"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout bar */}
            <div
              className="card"
              style={{
                marginTop: "16px",
                padding: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <b>Total:</b> ₹{total}{" "}
                <span className="muted">• COD</span>
              </div>

              <button className="btn btn-primary" onClick={placeOrder}>
                Place Order (COD)
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

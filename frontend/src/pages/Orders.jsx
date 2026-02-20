import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    if (!user?._id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${user._id}`
      );
      setOrders(res.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const badgeStyle = (status) => {
    const base = {
      padding: "6px 10px",
      borderRadius: "999px",
      fontWeight: 900,
      fontSize: "13px",
      border: "1px solid var(--border)",
      background: "#fff",
    };

    if (status === "Pending")
      return { ...base, color: "#b45309", background: "rgba(245,158,11,0.10)" };
    if (status === "Accepted")
      return { ...base, color: "#1d4ed8", background: "rgba(59,130,246,0.10)" };
    if (status === "Delivered")
      return { ...base, color: "#047857", background: "rgba(16,185,129,0.12)" };
    if (status === "Cancelled")
      return { ...base, color: "#b91c1c", background: "rgba(239,68,68,0.10)" };

    return base;
  };

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-chip">🧾 Orders • Track Status</div>
            <h1>Your Orders</h1>
            <p>See your orders with images and delivery status.</p>
          </div>

          <div className="hero-card">
            <b>Summary</b>
            <ul>
              <li>Total Orders: <b>{orders.length}</b></li>
              <li>Payment: <b>COD</b></li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container">
        {loading ? (
          <p className="muted">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="card" style={{ padding: "16px" }}>
            <h3>No orders yet</h3>
            <p className="muted">Place an order to see it here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {orders.map((order) => (
              <div className="card" key={order._id}>
                <div
                  style={{
                    padding: "14px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <b>Order:</b> <span className="muted">{order._id}</span>
                    <div className="muted" style={{ fontSize: "13px", marginTop: "4px" }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div className="price">₹{order.total}</div>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "6px" }}>
                      <span style={badgeStyle(order.status)}>{order.status}</span>
                    </div>
                    <div className="muted" style={{ fontSize: "13px", marginTop: "6px" }}>
                      {order.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* items */}
                <div style={{ padding: "14px", display: "grid", gap: "12px" }}>
                  {(order.items || []).map((it, idx) => {
                    // Prefer snapshot; fallback to populated book
                    const cover =
                      (it.cover && it.cover.trim()) ||
                      (it.bookId?.cover && it.bookId.cover.trim()) ||
                      "https://via.placeholder.com/100x140?text=No+Cover";

                    const title = it.title || it.bookId?.title || "Book";
                    const author = it.author || it.bookId?.author || "—";
                    const price = it.price || it.bookId?.price || 0;

                    return (
                      <div
                        key={it._id || idx}
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          border: "1px solid var(--border)",
                          borderRadius: "14px",
                          padding: "10px",
                          background: "#fff",
                        }}
                      >
                        <img
                          src={cover}
                          alt={title}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/100x140?text=No+Cover";
                          }}
                          style={{
                            width: "80px",
                            height: "110px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 950, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {title}
                          </div>
                          <div className="muted" style={{ fontSize: "13px" }}>
                            Author: {author}
                          </div>
                          <div className="muted" style={{ fontSize: "13px" }}>
                            Qty: {it.quantity || 1}
                          </div>
                        </div>

                        <div className="price">₹{price * (it.quantity || 1)}</div>
                      </div>
                    );
                  })}
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

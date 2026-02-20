import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [u, o, b] = await Promise.all([
        axios.get("http://localhost:5000/api/users"),
        axios.get("http://localhost:5000/api/orders"),
        axios.get("http://localhost:5000/api/books"),
      ]);

      setUsers(u.data || []);
      setOrders(o.data || []);
      setBooks(b.data || []);
    } catch (err) {
      console.log("ADMIN FETCH ERROR:", err?.response?.data || err.message);
      setUsers([]);
      setOrders([]);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      alert("Book Deleted ✅");
      fetchAll();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status,
      });
      alert(`Order set to ${status} ✅`);
      fetchAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Status update failed");
    }
  };

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

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toLocaleString();
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-chip">🛡️ Admin • Users • Orders • Books</div>
            <h1>Admin Dashboard</h1>
            <p>Control users, track orders with status, and manage books.</p>
          </div>

          <div className="hero-card">
            <b>Quick Stats</b>
            <ul>
              <li>Users: <b>{users.length}</b></li>
              <li>Orders: <b>{orders.length}</b></li>
              <li>Books: <b>{books.length}</b></li>
              <li>Revenue: <b>₹{totalRevenue}</b></li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container">
        {/* STATS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "16px",
          }}
        >
          <div className="card" style={{ padding: "14px" }}>
            <div className="muted">Total Users</div>
            <div style={{ fontSize: "28px", fontWeight: 950, marginTop: "4px" }}>
              {users.length}
            </div>
          </div>

          <div className="card" style={{ padding: "14px" }}>
            <div className="muted">Total Orders</div>
            <div style={{ fontSize: "28px", fontWeight: 950, marginTop: "4px" }}>
              {orders.length}
            </div>
          </div>

          <div className="card" style={{ padding: "14px" }}>
            <div className="muted">Total Books</div>
            <div style={{ fontSize: "28px", fontWeight: 950, marginTop: "4px" }}>
              {books.length}
            </div>
          </div>

          <div className="card" style={{ padding: "14px" }}>
            <div className="muted">Total Revenue</div>
            <div style={{ fontSize: "28px", fontWeight: 950, marginTop: "4px" }}>
              ₹{totalRevenue}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading admin data...</p>
        ) : (
          <>
            {/* USERS */}
            <div className="card" style={{ padding: "14px", marginBottom: "16px" }}>
              <h2 style={{ margin: 0 }}>All Users</h2>
              <p className="muted" style={{ marginTop: "6px" }}>
                Name • Email • Role
              </p>

              <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
                {users.map((u) => (
                  <div
                    key={u._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "10px",
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      background: "#fff",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 950 }}>{u.name || "User"}</div>
                      <div className="muted" style={{ fontSize: "13px" }}>
                        {u.email}
                      </div>
                    </div>

                    <span className="price" style={{ fontSize: "13px" }}>
                      {u.role || "user"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDERS */}
            <div className="card" style={{ padding: "14px", marginBottom: "16px" }}>
              <h2 style={{ margin: 0 }}>All Orders</h2>
              <p className="muted" style={{ marginTop: "6px" }}>
                Includes images + status controls.
              </p>

              {orders.length === 0 ? (
                <p className="muted" style={{ marginTop: "10px" }}>
                  No orders yet.
                </p>
              ) : (
                <div style={{ display: "grid", gap: "16px", marginTop: "12px" }}>
                  {orders.map((o) => (
                    <div
                      key={o._id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "#fff",
                      }}
                    >
                      {/* ORDER HEADER */}
                      <div
                        style={{
                          padding: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "10px",
                          borderBottom: "1px solid var(--border)",
                          background: "rgba(0,0,0,0.02)",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 950 }}>
                            Order: <span className="muted">{o._id}</span>
                          </div>
                          <div className="muted" style={{ fontSize: "13px", marginTop: "4px" }}>
                            UserId: {o.userId}
                          </div>
                          <div className="muted" style={{ fontSize: "13px" }}>
                            {formatDate(o.createdAt)}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div className="price">₹{o.total}</div>
                          <div className="muted" style={{ fontSize: "13px" }}>
                            {o.paymentMethod}
                          </div>
                          <div style={{ marginTop: "6px" }}>
                            <span style={badgeStyle(o.status)}>{o.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* ORDER ITEMS (with images) */}
                      <div style={{ padding: "14px", display: "grid", gap: "12px" }}>
                        {(o.items || []).map((it, idx) => {
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
                                <div
                                  style={{
                                    fontWeight: 950,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {title}
                                </div>
                                <div className="muted" style={{ fontSize: "13px" }}>
                                  Author: {author}
                                </div>
                                <div className="muted" style={{ fontSize: "13px" }}>
                                  Qty: {it.quantity || 1}
                                </div>
                              </div>

                              <div className="price">
                                ₹{price * (it.quantity || 1)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* STATUS ACTIONS */}
                      <div
                        style={{
                          padding: "14px",
                          borderTop: "1px solid var(--border)",
                          display: "flex",
                          gap: "10px",
                          justifyContent: "flex-end",
                          flexWrap: "wrap",
                          background: "rgba(0,0,0,0.02)",
                        }}
                      >
                        <button className="btn btn-ghost" onClick={() => updateStatus(o._id, "Pending")}>
                          Pending
                        </button>
                        <button className="btn btn-primary" onClick={() => updateStatus(o._id, "Accepted")}>
                          Accept
                        </button>
                        <button className="btn btn-primary" onClick={() => updateStatus(o._id, "Delivered")}>
                          Delivered
                        </button>
                        <button className="btn btn-danger" onClick={() => updateStatus(o._id, "Cancelled")}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOOKS */}
            <h2 style={{ margin: 0 }}>All Books (Admin Control)</h2>
            <p className="muted" style={{ marginTop: "6px" }}>
              Delete books if needed.
            </p>

            <div className="grid" style={{ marginTop: "14px" }}>
              {books.map((b) => (
                <div className="card" key={b._id}>
                  <img
                    className="card-img"
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
                  />

                  <div className="card-body">
                    <h3 className="card-title" title={b.title}>
                      {b.title}
                    </h3>

                    <p className="muted">
                      <b>Author:</b> {b.author}
                    </p>

                    <p className="muted" style={{ marginTop: "6px" }}>
                      <b>Category:</b> {b.category || "General"}
                    </p>

                    <div className="row">
                      <span className="price">₹{b.price}</span>
                      <button className="btn btn-danger" onClick={() => deleteBook(b._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
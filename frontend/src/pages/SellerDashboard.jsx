import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = ["General", "Fiction", "Technology", "Education", "Biography"];

export default function SellerDashboard() {
  const seller = JSON.parse(localStorage.getItem("user"));
  const sellerId = seller?._id;

  const [tab, setTab] = useState("books"); // books | orders

  // add book
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState("");
  const [category, setCategory] = useState("General");

  // data
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const coverPreview = useMemo(() => {
    const c = (cover || "").trim();
    if (!c) return "https://via.placeholder.com/300x400?text=Cover+Preview";
    return c;
  }, [cover]);

  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data || []);
    } catch (err) {
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchSellerOrders = async () => {
    if (!sellerId) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }
    try {
      setLoadingOrders(true);
      const res = await axios.get(
        `http://localhost:5000/api/orders/seller/${sellerId}`
      );
      setOrders(res.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchSellerOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBook = async () => {
    if (!title.trim() || !author.trim() || !price) {
      alert("All fields required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/books", {
        title: title.trim(),
        author: author.trim(),
        price: Number(price),
        cover: cover.trim(),
        category: category || "General",

        // ✅ IMPORTANT
        sellerId,
      });

      alert("Book Added ✅");
      setTitle("");
      setAuthor("");
      setPrice("");
      setCover("");
      setCategory("General");
      fetchBooks();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add book");
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      alert("Book Deleted ✅");
      fetchBooks();
    } catch {
      alert("Delete failed");
    }
  };

  // ✅ SAME AS ADMIN: update order status
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status,
      });
      alert(`Order set to ${status} ✅`);
      fetchSellerOrders();
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
            <div className="hero-chip">📦 Seller • Books & Orders</div>
            <h1>Seller Dashboard</h1>
            <p>Manage books and update orders status like admin.</p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "16px",
                flexWrap: "wrap",
              }}
            >
              <button
                className={`btn ${tab === "books" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTab("books")}
              >
                Books
              </button>

              <button
                className={`btn ${tab === "orders" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTab("orders")}
              >
                Orders
              </button>
            </div>
          </div>

          <div className="hero-card">
            <b>Stats</b>
            <ul>
              <li>Books: <b>{books.length}</b></li>
              <li>Orders: <b>{orders.length}</b></li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container">
        {/* ===================== BOOKS TAB ===================== */}
        {tab === "books" && (
          <>
            <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
              <h2 style={{ margin: 0 }}>Add New Book</h2>
              <p className="muted" style={{ marginTop: "6px" }}>
                Add title, author, price, category and cover URL.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginTop: "12px",
                }}
              >
                <div style={{ display: "grid", gap: "10px" }}>
                  <input className="input" placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input className="input" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                  <input className="input" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

                  <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <input className="input" placeholder="Cover Image URL" value={cover} onChange={(e) => setCover(e.target.value)} />

                  <button className="btn btn-primary" onClick={addBook}>
                    Add Book
                  </button>
                </div>

                <div className="card" style={{ margin: 0, overflow: "hidden" }}>
                  <img
                    className="card-img"
                    src={coverPreview}
                    alt="Cover Preview"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x400?text=Invalid+URL";
                    }}
                  />
                  <div className="card-body">
                    <div className="muted" style={{ fontSize: "13px" }}>
                      Cover Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 style={{ margin: 0 }}>All Books</h2>
            <p className="muted" style={{ marginTop: "6px" }}>
              Delete books if required.
            </p>

            {loadingBooks ? (
              <p className="muted">Loading books...</p>
            ) : (
              <div className="grid" style={{ marginTop: "14px" }}>
                {books.map((b) => (
                  <div className="card" key={b._id}>
                    <img
                      className="card-img"
                      src={b.cover?.trim() ? b.cover : "https://via.placeholder.com/300x400?text=No+Cover"}
                      alt={b.title}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x400?text=No+Cover";
                      }}
                    />

                    <div className="card-body">
                      <h3 className="card-title">{b.title}</h3>
                      <p className="muted"><b>Author:</b> {b.author}</p>
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
            )}
          </>
        )}

        {/* ===================== ORDERS TAB ===================== */}
        {tab === "orders" && (
          <>
            <h2 style={{ margin: 0 }}>Orders (Seller)</h2>
            <p className="muted" style={{ marginTop: "6px" }}>
              Status control same as Admin: Pending → Accepted → Delivered.
            </p>

            {loadingOrders ? (
              <p className="muted">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="card" style={{ padding: "16px", marginTop: "12px" }}>
                <h3>No orders yet</h3>
                <p className="muted">When users order your books, they appear here.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px", marginTop: "14px" }}>
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
                    {/* HEADER */}
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
                          {formatDate(o.createdAt)}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div className="price">₹{o.total}</div>
                        <div style={{ marginTop: "6px" }}>
                          <span style={badgeStyle(o.status)}>{o.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* ITEMS (only this seller items) */}
                    <div style={{ padding: "14px", display: "grid", gap: "12px" }}>
                      {(o.items || [])
                        .filter((it) => String(it.sellerId) === String(sellerId))
                        .map((it, idx) => (
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
                              src={it.cover?.trim() ? it.cover : "https://via.placeholder.com/100x140?text=No+Cover"}
                              alt={it.title}
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
                                {it.title}
                              </div>
                              <div className="muted" style={{ fontSize: "13px" }}>
                                Qty: {it.quantity || 1}
                              </div>
                            </div>

                            <div className="price">
                              ₹{(it.price || 0) * (it.quantity || 1)}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* ✅ SAME BUTTONS AS ADMIN */}
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
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
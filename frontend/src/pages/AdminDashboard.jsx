import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);

  const fetchAll = async () => {
    const u = await axios.get("http://localhost:5000/api/users");
    const o = await axios.get("http://localhost:5000/api/orders");
    const b = await axios.get("http://localhost:5000/api/books");

    setUsers(u.data);
    setOrders(o.data);
    setBooks(b.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      alert("Book Deleted ✅");
      fetchAll();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>

        {/* USERS */}
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>All Users</h3>
          {users.map((u) => (
            <div key={u._id} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
              <b>{u.name}</b> — {u.email} — <span style={{ color: "#1e3a8a" }}>{u.role || "user"}</span>
            </div>
          ))}
        </div>

        {/* ORDERS */}
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>All Orders</h3>
          {orders.map((o) => (
            <div key={o._id} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <p><b>UserId:</b> {o.userId}</p>
              <p><b>Total:</b> ₹{o.total}</p>
              <p><b>Payment:</b> {o.paymentMethod}</p>
            </div>
          ))}
        </div>

        {/* BOOKS */}
        <h3>All Books (Admin Control)</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {books.map((b) => (
            <div className="card" key={b._id}>
              <h3>{b.title}</h3>
              <p><b>Author:</b> {b.author}</p>
              <p><b>Price:</b> ₹{b.price}</p>
              <button onClick={() => deleteBook(b._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

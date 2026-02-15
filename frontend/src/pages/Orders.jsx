import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders/${user._id}`)
      .then((res) => setOrders(res.data));
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Order History</h2>

        {orders.map((order) => (
          <div key={order._id} className="card">
            <p><b>Total:</b> ₹{order.total}</p>
            <p><b>Payment:</b> {order.paymentMethod}</p>
          </div>
        ))}
      </div>
    </>
  );
}

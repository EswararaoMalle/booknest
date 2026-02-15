import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      setCart(res.data);
    } catch (err) {
      console.log("CART FETCH ERROR:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      fetchCart();
    } catch (err) {
      alert("Remove failed");
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = item?.bookId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const placeOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders", {
        userId: user._id,
        items: cart,
        total,
        paymentMethod: "Cash on Delivery",
      });

      // clear cart
      for (let item of cart) {
        await axios.delete(`http://localhost:5000/api/cart/${item._id}`);
      }

      alert("Order Placed ✅ (Cash on Delivery)");
      fetchCart();
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "20px",
                marginTop: "15px",
              }}
            >
              {cart.map((item) => (
                <div className="card" key={item._id}>
                  <img
                    src={
                      item.bookId?.cover && item.bookId.cover.trim()
                        ? item.bookId.cover
                        : "https://via.placeholder.com/300x400?text=No+Cover"
                    }
                    alt={item.bookId?.title || "Book"}
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "10px",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x400?text=No+Cover";
                    }}
                  />

                  <h3>{item.bookId?.title || "Unknown Book"}</h3>
                  <p><b>Price:</b> ₹{item.bookId?.price || 0}</p>
                  <p><b>Qty:</b> {item.quantity}</p>

                  <button onClick={() => removeItem(item._id)}>Remove</button>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: "20px" }}>Total: ₹{total}</h3>
            <button onClick={placeOrder}>Place Order (COD)</button>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        BookNest
      </h2>

      {/* GUEST */}
      {!user && (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register" style={{ marginLeft: "12px" }}>
            Register
          </Link>
        </div>
      )}

      {/* LOGGED IN */}
      {user && (
        <div>
          {user.role === "admin" ? (
            <Link to="/admin">Admin Dashboard</Link>
          ) : user.role === "seller" ? (
            <Link to="/seller">Seller Dashboard</Link>
          ) : (
            <>
              <Link to="/home">Home</Link>{" | "}
              <Link to="/cart">Cart</Link>{" | "}
              <Link to="/orders">Orders</Link>{" | "}
            </>
          )}

          <button onClick={logout} className="logout-btn" style={{ marginLeft: "12px" }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

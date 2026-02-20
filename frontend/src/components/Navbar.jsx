import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* BRAND */}
       <div className="brand" onClick={() => navigate("/")}>
  <div className="brand-icon">BN</div>
  <span>BookNest</span>
</div>



        {/* NAV LINKS */}
        <nav className="nav-links">
          {/* GUEST */}
          {!user && (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/register">Register</Link>
            </>
          )}

          {/* LOGGED IN */}
          {user && (
            <>
              {user.role === "admin" && (
                <Link className="nav-link" to="/admin">Admin</Link>
              )}

              {user.role === "seller" && (
                <Link className="nav-link" to="/seller">Seller</Link>
              )}

              {user.role === "user" && (
                <>
                  <Link className="nav-link" to="/home">Home</Link>
                  <Link className="nav-link" to="/cart">Cart</Link>
                  <Link className="nav-link" to="/orders">Orders</Link>
                </>
              )}

              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

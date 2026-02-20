import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const register = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registered Successfully ✅");
      navigate("/login"); // ✅ better than "/" because landing is public
    } catch (err) {
      alert(err?.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") register();
  };

  return (
    <>
      <Navbar />

      {/* Optional hero */}
      <section className="hero" style={{ paddingBottom: "0" }}>
        <div className="hero-inner" style={{ paddingBottom: "20px" }}>
          <div>
            <div className="hero-chip">🚀 Create Account</div>
            <h1 style={{ fontSize: "34px" }}>Join BookNest</h1>
            <p>
              Register as a <b>User</b> to buy books or <b>Seller</b> to add
              books.
            </p>
          </div>
          <div className="hero-card">
            <b>Choose Role</b>
            <ul>
              <li>User → browse, cart, orders</li>
              <li>Seller → add & manage books</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="auth-wrap">
        <div className="auth-card">
          <h2>Register</h2>
          <p className="muted" style={{ marginTop: "-6px" }}>
            Create a new account in seconds
          </p>

          <div className="stack">
            <input
              className="input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={onKeyDown}
            />

            <input
              className="input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
            />

            {/* ✅ Styled select (uses same .input) */}
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User (Buy Books)</option>
              <option value="seller">Seller (Add Books)</option>
            </select>

            <button
              className="btn btn-primary"
              onClick={register}
              disabled={loading}
              style={{ opacity: loading ? 0.8 : 1 }}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>

          <p className="auth-note">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)", fontWeight: 900 }}>
              Login
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

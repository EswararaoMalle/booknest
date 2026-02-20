import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Please enter all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ Role Based Redirect
      if (res.data.role === "seller") navigate("/seller");
      else if (res.data.role === "admin") navigate("/admin");
      else navigate("/home");
    } catch (err) {
      alert("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <>
      <Navbar />

      {/* Optional mini hero feel */}
      <section className="hero" style={{ paddingBottom: "0" }}>
        <div className="hero-inner" style={{ paddingBottom: "20px" }}>
          <div>
            <div className="hero-chip">🔐 Secure Login (Basic)</div>
            <h1 style={{ fontSize: "34px" }}>Welcome back</h1>
            <p>Login to access cart, orders, and your dashboard.</p>
          </div>
          <div className="hero-card">
            <b>Tip</b>
            <ul>
              <li>Use the email & password you registered.</li>
              <li>Role will redirect automatically.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="auth-wrap">
        <div className="auth-card">
          <h2>Login</h2>
          <p className="muted" style={{ marginTop: "-6px" }}>
            Enter your credentials to continue
          </p>

          <div className="stack">
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

            <button
              className="btn btn-primary"
              onClick={login}
              disabled={loading}
              style={{ opacity: loading ? 0.8 : 1 }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="auth-note">
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent)", fontWeight: 900 }}>
              Register
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, UtensilsCrossed
} from "lucide-react";
import "./Login.css";
import { API_BASE_URL } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("saffron_user", JSON.stringify(data.user || data));
      localStorage.setItem("saffron_token", data.token || "");

      navigate(data.user?.role === "owner" ? "/owner" : "/user");
    } catch {
      setError("Cannot connect to the server. Check whether Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-image">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=85"
          alt="Elegant restaurant dining table"
        />
        <div className="login-image-overlay">
          <span>SAFFRON & SAGE</span>
          <h2>Good food.<br />Beautiful moments.</h2>
          <p>Your favourite flavours are waiting for you.</p>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-form-box">
          <Link to="/" className="login-brand">
            <UtensilsCrossed size={25} />
            <span>Saffron & Sage</span>
          </Link>

          <span className="login-eyebrow">WELCOME BACK</span>
          <h1>Sign in to your account</h1>
          <p className="login-subtitle">Enter your details to continue.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <div className="login-input-wrap">
              <Mail size={18} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <Lock size={18} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="login-signup">
            Don't have an account? <Link to="/signin">Create account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
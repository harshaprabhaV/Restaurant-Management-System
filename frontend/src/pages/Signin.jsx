import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound, Mail, Phone, Lock, Eye, EyeOff,
  ArrowRight, UtensilsCrossed
} from "lucide-react";
import "./Signin.css";
import { API_BASE_URL } from "../services/api";

function Signin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Unable to create account.");
        return;
      }

      alert("Account created successfully! Please sign in.");
      navigate("/login");
    } catch {
      setError("Cannot connect to the server. Check whether Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signin-page">
      <section className="signin-image">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=85"
          alt="Warm and elegant restaurant interior"
        />
        <div className="signin-image-overlay">
          <span>JOIN OUR TABLE</span>
          <h2>Discover flavours.<br />Create memories.</h2>
          <p>Your next favourite meal is just around the corner.</p>
        </div>
      </section>

      <section className="signin-form-section">
        <div className="signin-form-box">
          <Link to="/" className="signin-brand">
            <UtensilsCrossed size={25} />
            <span>Saffron & Sage</span>
          </Link>

          <span className="signin-eyebrow">BECOME A MEMBER</span>
          <h1>Create your account</h1>
          <p className="signin-subtitle">
            Join us for delicious food and memorable experiences.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Full name</label>
            <div className="signin-input-wrap">
              <UserRound size={18} />
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                required
              />
            </div>

            <label htmlFor="signup-email">Email address</label>
            <div className="signin-input-wrap">
              <Mail size={18} />
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="signup-phone">Phone number</label>
            <div className="signin-input-wrap">
              <Phone size={18} />
              <input
                id="signup-phone"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                autoComplete="tel"
                required
              />
            </div>

            <label htmlFor="signup-password">Password</label>
            <div className="signin-input-wrap">
              <Lock size={18} />
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="signin-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label htmlFor="signup-confirm">Confirm password</label>
            <div className="signin-input-wrap">
              <Lock size={18} />
              <input
                id="signup-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="signin-eye"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="signin-error">{error}</p>}

            <button
              type="submit"
              className="signin-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="signin-login">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Signin;
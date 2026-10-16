import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "", email: "", password: "", first_name: "", last_name: "", phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { applyTokens } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to send the person once they're signed in (e.g. back to
  // /checkout if they came from the cart). Only accept in-app paths.
  const rawFrom = location.state?.from;
  const redirectTo = typeof rawFrom === "string" && rawFrom.startsWith("/") ? rawFrom : null;

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await client.post("/accounts/register/", form);
    } catch (err) {
      const data = err.response?.data;
      setError(
        data && typeof data === "object"
          ? Object.values(data).flat().join(" ")
          : "Registration failed."
      );
      setSubmitting(false);
      return;
    }

    // Account created - sign them in straight away so they don't have to
    // type their credentials a second time (important when they're in the
    // middle of checking out).
    try {
      const { data } = await client.post("/accounts/login/", {
        username: form.username,
        password: form.password,
      });
      await applyTokens(data);
      navigate(redirectTo || "/");
    } catch {
      navigate("/login", { state: { from: redirectTo } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Create your account</h2>
      {redirectTo === "/checkout" && (
        <p style={{ color: "var(--hl-gray)", textAlign: "center", marginTop: 0 }}>
          Create an account to complete your order. Your cart is saved.
        </p>
      )}
      {error && <p className="status-rejected">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field"><label>Username</label><input value={form.username} onChange={update("username")} required /></div>
        <div className="field"><label>Email</label><input type="email" value={form.email} onChange={update("email")} required /></div>
        <div className="field"><label>First name</label><input value={form.first_name} onChange={update("first_name")} /></div>
        <div className="field"><label>Last name</label><input value={form.last_name} onChange={update("last_name")} /></div>
        <div className="field"><label>Phone number</label><input value={form.phone_number} onChange={update("phone_number")} /></div>
        <div className="field">
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={update("password")}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button className="btn" type="submit" style={{ width: "100%" }} disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login" state={{ from: redirectTo }}>Log in</Link>
      </p>
    </div>
  );
}
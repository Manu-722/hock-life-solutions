import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await client.post("/accounts/forgot-password/", { email });
    setSent(true);
    setTimeout(() => navigate("/reset-password", { state: { email } }), 1200);
  };

  return (
    <div className="card form-card">
      <h2>Forgot password</h2>
      <p style={{ color: "var(--hl-gray)" }}>
        Enter your email and we'll send you a 6-digit code. It expires in 5 minutes.
      </p>
      {sent ? (
        <p className="status-approved">Code sent! Redirecting you to enter it...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn" type="submit" style={{ width: "100%" }}>Send code</button>
        </form>
      )}
    </div>
  );
}

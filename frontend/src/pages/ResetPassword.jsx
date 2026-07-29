import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/accounts/reset-password/", { email, code, new_password: newPassword });
      setDone(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.detail || "That code is invalid or has expired.");
    }
  };

  return (
    <div className="card form-card">
      <h2>Reset password</h2>
      {done ? (
        <p className="status-approved">Password reset! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="status-rejected">{error}</p>}
          <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="field"><label>5-minute code</label><input value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} required /></div>
          <div className="field"><label>New password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
          <button className="btn" type="submit" style={{ width: "100%" }}>Reset password</button>
        </form>
      )}
    </div>
  );
}

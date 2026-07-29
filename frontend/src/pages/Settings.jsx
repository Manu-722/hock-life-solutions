import { useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await client.post("/accounts/change-password/", { old_password: oldPassword, new_password: newPassword });
      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      refreshUser();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update password.");
    }
  };

  return (
    <div>
      <h2>Settings</h2>

      {user?.must_change_password && (
        <div className="card" style={{ borderColor: "var(--hl-amber)", marginBottom: 20 }}>
          <p className="status-pending">
            For security, you must change your starter admin password before continuing.
          </p>
        </div>
      )}

      <div className="card" style={{ maxWidth: 420 }}>
        <h3>Change password</h3>
        {message && <p className="status-approved">{message}</p>}
        {error && <p className="status-rejected">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Current password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          </div>
          <div className="field">
            <label>New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit" style={{ width: "100%" }}>Update password</button>
        </form>
      </div>
    </div>
  );
}

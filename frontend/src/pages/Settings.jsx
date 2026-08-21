import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, Phone, User as UserIcon, ShieldCheck, Eye, EyeOff, ArrowRight, Package, LayoutDashboard } from "lucide-react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await client.post("/accounts/change-password/", { old_password: oldPassword, new_password: newPassword });
      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      refreshUser();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update password.");
    } finally {
      setSaving(false);
    }
  };

  const initial = (user?.first_name || user?.username || "?").charAt(0).toUpperCase();

  return (
    <div>
      <h2>Settings</h2>

      {/* --- Account overview --- */}
      {user && (
        <div className="card settings-overview">
          <div className="settings-avatar">{initial}</div>
          <div className="settings-overview-details">
            <h3 style={{ margin: "0 0 4px" }}>
              {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}
              {user.is_admin && <span className="admin-pill" style={{ marginLeft: 10 }}>Admin</span>}
            </h3>
            <p style={{ margin: "4px 0", color: "var(--hl-gray)", display: "flex", alignItems: "center", gap: 6 }}>
              <UserIcon size={14} /> {user.username}
            </p>
            <p style={{ margin: "4px 0", color: "var(--hl-gray)", display: "flex", alignItems: "center", gap: 6 }}>
              <Mail size={14} /> {user.email || "No email set"}
            </p>
            <p style={{ margin: "4px 0", color: "var(--hl-gray)", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} /> {user.phone_number || "No phone set"}
            </p>
          </div>
        </div>
      )}

      {user?.must_change_password && (
        <div className="card" style={{ borderColor: "var(--hl-amber)", marginTop: 20 }}>
          <p className="status-pending" style={{ display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <ShieldCheck size={18} />
            For security, please change your starter admin password before continuing.
          </p>
        </div>
      )}

      {/* --- Quick links --- */}
      <div className="settings-quicklinks">
        <Link to="/profile" className="settings-quicklink-card">
          <div>
            <h4 style={{ margin: "0 0 4px" }}>Edit profile</h4>
            <p style={{ margin: 0, color: "var(--hl-gray)", fontSize: "0.88rem" }}>Update your name, email, and phone number</p>
          </div>
          <ArrowRight size={18} />
        </Link>
        <Link to="/profile" className="settings-quicklink-card">
          <div>
            <h4 style={{ margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 }}><Package size={16} /> Order history</h4>
            <p style={{ margin: 0, color: "var(--hl-gray)", fontSize: "0.88rem" }}>See your past and pending orders</p>
          </div>
          <ArrowRight size={18} />
        </Link>
        {user?.is_admin && (
          <Link to="/admin" className="settings-quicklink-card">
            <div>
              <h4 style={{ margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 }}><LayoutDashboard size={16} /> Admin Dashboard</h4>
              <p style={{ margin: 0, color: "var(--hl-gray)", fontSize: "0.88rem" }}>Manage products, offers, and orders</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        )}
      </div>

      {/* --- Change password --- */}
      <h3 className="section-title">Change password</h3>
      <div className="card" style={{ maxWidth: 420 }}>
        {message && <p className="status-approved">{message}</p>}
        {error && <p className="status-rejected">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label><Lock size={13} style={{ verticalAlign: "-2px" }} /> Current password</label>
            <div className="password-field">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle" tabIndex={-1} onClick={() => setShowOld((v) => !v)}>
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="field">
            <label><Lock size={13} style={{ verticalAlign: "-2px" }} /> New password</label>
            <div className="password-field">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle" tabIndex={-1} onClick={() => setShowNew((v) => !v)}>
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button className="btn" type="submit" style={{ width: "100%" }} disabled={saving}>
            {saving ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
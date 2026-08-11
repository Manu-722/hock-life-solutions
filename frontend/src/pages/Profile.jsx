import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

const statusClass = {
  PENDING: "status-pending",
  APPROVED: "status-approved",
  REJECTED: "status-rejected",
};

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone_number: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    client.get("/orders/").then((res) => setOrders(res.data.results || res.data));
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const startEditing = () => {
    setMessage("");
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
      });
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await client.patch("/accounts/me/", form);
      await refreshUser();
      setMessage("Profile updated.");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>My profile</h2>

      {user && (
        <div className="card" style={{ maxWidth: 500 }}>
          {!editing ? (
            <>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : "—"}</p>
              <p><strong>Phone:</strong> {user.phone_number || "—"}</p>
              {message && <p className="status-approved">{message}</p>}
              <button className="btn secondary" onClick={startEditing}>
                <Pencil size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
                Edit profile
              </button>
            </>
          ) : (
            <form onSubmit={saveProfile}>
              <p style={{ color: "var(--hl-gray)", fontSize: "0.85rem", marginTop: 0 }}>
                Username: <strong>{user.username}</strong> (can't be changed)
              </p>
              {error && <p className="status-rejected">{error}</p>}
              <div className="field"><label>First name</label><input value={form.first_name} onChange={update("first_name")} /></div>
              <div className="field"><label>Last name</label><input value={form.last_name} onChange={update("last_name")} /></div>
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={update("email")} /></div>
              <div className="field"><label>Phone number</label><input value={form.phone_number} onChange={update("phone_number")} /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
                <button type="button" className="btn secondary" onClick={cancelEditing}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      <h3 className="section-title">My orders</h3>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Order #</th><th>Items</th><th>Total</th><th>Status</th><th>Placed</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.items.map((i) => `${i.product_name_snapshot} x${i.quantity}`).join(", ")}</td>
                  <td>KES {Number(o.total_amount).toLocaleString()}</td>
                  <td className={statusClass[o.status]}>{o.status === "APPROVED" ? "Approved" : o.status === "REJECTED" ? "Rejected" : "Pending"}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
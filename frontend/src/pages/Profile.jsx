import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

const statusClass = {
  PENDING: "status-pending",
  APPROVED: "status-approved",
  REJECTED: "status-rejected",
};

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    client.get("/orders/").then((res) => setOrders(res.data.results || res.data));
  }, []);

  return (
    <div>
      <h2>My profile</h2>
      {user && (
        <div className="card" style={{ maxWidth: 500 }}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Phone:</strong> {user.phone_number || "—"}</p>
        </div>
      )}

      <h3 className="section-title">My orders</h3>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
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
      )}
    </div>
  );
}

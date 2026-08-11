import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import client from "../../api/client";

const statusClass = { PENDING: "status-pending", APPROVED: "status-approved", REJECTED: "status-rejected" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const load = () => {
    setLoadError("");
    client
      .get("/orders/")
      .then((r) => setOrders(Array.isArray(r.data) ? r.data : r.data.results || []))
      .catch((err) => {
        setLoadError(
          err.response?.status === 401 || err.response?.status === 403
            ? "You need to be logged in as an admin to view orders."
            : "Couldn't load orders. Is the backend server running?"
        );
      });
  };
  useEffect(load, []);

  const approve = async (id) => {
    try {
      await client.post(`/orders/${id}/approve/`);
      load();
    } catch {
      setActionError("Could not approve that order.");
    }
  };
  const reject = async (id) => {
    try {
      await client.post(`/orders/${id}/reject/`);
      load();
    } catch {
      setActionError("Could not reject that order.");
    }
  };

  if (loadError) {
    return (
      <div className="empty-state">
        <p style={{ fontWeight: 700 }}>{loadError}</p>
        <button className="btn" onClick={load}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <h3>Customer orders</h3>
      <p style={{ color: "var(--hl-gray)" }}>
        Approve an order once you've confirmed the customer paid via the Hawk Life Solutions Paybill number.
        The customer sees the status update immediately in their Profile order history.
      </p>
      {actionError && <p className="status-rejected">{actionError}</p>}

      {orders.length === 0 ? (
        <p style={{ color: "var(--hl-gray)" }}>No orders yet - they'll appear here as soon as a customer checks out.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Placed</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer_username}</td>
                  <td>{o.items.map((i) => `${i.product_name_snapshot} x${i.quantity}`).join(", ")}</td>
                  <td>KES {Number(o.total_amount).toLocaleString()}</td>
                  <td className={statusClass[o.status]}>{o.status}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    {o.status === "PENDING" && (
                      <>
                        <button className="btn" onClick={() => approve(o.id)}><CheckCircle2 size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Approve</button>
                        <button className="btn danger" onClick={() => reject(o.id)}><XCircle size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
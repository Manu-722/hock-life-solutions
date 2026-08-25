import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import client from "../../api/client";
import { confirmToast } from "../../utils/confirmToast";

const statusClass = { PENDING: "status-pending", APPROVED: "status-approved", REJECTED: "status-rejected" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loadError, setLoadError] = useState("");

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

  const doApprove = async (o) => {
    try {
      await client.post(`/orders/${o.id}/approve/`);
      toast.success(`Order #${o.id} approved. The customer will now see it as Approved.`);
      load();
    } catch {
      toast.error(`Could not approve order #${o.id}.`);
    }
  };

  const doReject = async (o) => {
    try {
      await client.post(`/orders/${o.id}/reject/`);
      toast.success(`Order #${o.id} rejected.`);
      load();
    } catch {
      toast.error(`Could not reject order #${o.id}.`);
    }
  };

  const approve = (o) => {
    confirmToast(`Approve order #${o.id} for ${o.customer_username}? Only do this after confirming payment.`, () => doApprove(o));
  };

  const reject = (o) => {
    confirmToast(`Reject order #${o.id} for ${o.customer_username}? This can't be undone.`, () => doReject(o));
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
                        <button className="btn" onClick={() => approve(o)}><CheckCircle2 size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Approve</button>
                        <button className="btn danger" onClick={() => reject(o)}><XCircle size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Reject</button>
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
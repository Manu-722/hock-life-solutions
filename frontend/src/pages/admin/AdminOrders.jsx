import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import client from "../../api/client";

const statusClass = { PENDING: "status-pending", APPROVED: "status-approved", REJECTED: "status-rejected" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => client.get("/orders/").then((r) => setOrders(r.data.results || r.data));
  useEffect(load, []);

  const approve = async (id) => { await client.post(`/orders/${id}/approve/`); load(); };
  const reject = async (id) => { await client.post(`/orders/${id}/reject/`); load(); };

  return (
    <div>
      <h3>Customer orders</h3>
      <p style={{ color: "var(--hl-gray)" }}>
        Approve an order once you've confirmed the customer paid via the Hawk Life Solutions till/paybill number.
        The customer sees the status update immediately in their Profile order history.
      </p>
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
  );
}
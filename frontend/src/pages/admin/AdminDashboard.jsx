import { NavLink, Route, Routes } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminSlideshow from "./AdminSlideshow";
import AdminOrders from "./AdminOrders";

export default function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{ display: "flex", gap: 16, borderBottom: "1px solid #333", marginBottom: 20 }}>
        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "admin-pill" : "linklike")} style={{ padding: "8px 0" }}>Products</NavLink>
        <NavLink to="/admin/slideshow" className={({ isActive }) => (isActive ? "admin-pill" : "linklike")} style={{ padding: "8px 0" }}>Slideshow / Offers</NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "admin-pill" : "linklike")} style={{ padding: "8px 0" }}>Orders</NavLink>
      </div>
      <Routes>
        <Route path="products" element={<AdminProducts />} />
        <Route path="slideshow" element={<AdminSlideshow />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="*" element={<AdminOrders />} />
      </Routes>
    </div>
  );
}

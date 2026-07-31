import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { LayoutDashboard, Package, Image, Receipt } from "lucide-react";
import client from "../../api/client";
import AdminProducts from "./AdminProducts";
import AdminSlideshow from "./AdminSlideshow";
import AdminOrders from "./AdminOrders";

function DashboardHome({ stats }) {
  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total products</div>
          <div className="stat-value">{stats.productCount ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending orders</div>
          <div className="stat-value amber">{stats.pendingCount ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active slides</div>
          <div className="stat-value">{stats.activeSlides ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Items on offer</div>
          <div className="stat-value amber">{stats.offerCount ?? "—"}</div>
        </div>
      </div>
      <p style={{ color: "var(--hl-gray)", marginTop: 20 }}>
        Use the menu on the left to manage products, the homepage slideshow, and customer orders.
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      client.get("/products/"),
      client.get("/orders/"),
      client.get("/offers/slideshow/"),
    ]).then(([productsRes, ordersRes, slidesRes]) => {
      const products = productsRes.data.results || productsRes.data;
      const orders = ordersRes.data.results || ordersRes.data;
      const slides = slidesRes.data.results || slidesRes.data;
      setStats({
        productCount: products.length,
        offerCount: products.filter((p) => p.is_on_offer).length,
        pendingCount: orders.filter((o) => o.status === "PENDING").length,
        activeSlides: slides.filter((s) => s.active).length,
      });
    });
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p style={{ color: "var(--hl-gray)", marginTop: -8 }}>Hawk Life Solutions control center</p>

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
            <LayoutDashboard size={17} /> Overview
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
            <Package size={17} /> Products
          </NavLink>
          <NavLink to="/admin/slideshow" className={({ isActive }) => (isActive ? "active" : "")}>
            <Image size={17} /> Slideshow / Offers
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            <Receipt size={17} /> Orders
          </NavLink>
        </aside>

        <div className="admin-main">
          <Routes>
            <Route path="/" element={<DashboardHome stats={stats} />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="slideshow" element={<AdminSlideshow />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
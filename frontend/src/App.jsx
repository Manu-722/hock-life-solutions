import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { RequireAdmin, RequireAuth } from "./components/Guards";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="container">
        {/* If any page throws a render error, ErrorBoundary catches it here
            instead of the crash bubbling up and unmounting the entire app
            (which is what used to cause "blank page, and other pages stop
            working too" - once React unmounts everything there's nothing
            left to handle clicks). Keying by pathname resets it whenever
            the person navigates to a different page. */}
        <ErrorBoundary locationKey={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

            {/* Only reachable by an authenticated admin - see RequireAdmin */}
            <Route path="/admin/*" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

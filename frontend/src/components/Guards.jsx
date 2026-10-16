import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p className="container">Loading...</p>;
  // Remember where the person was trying to go (e.g. /checkout), so login
  // can send them straight back there afterwards.
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="container">Loading...</p>;
  // Guards the /admin route itself: even if a non-admin types the URL
  // directly, the backend never told the frontend they're an admin, so
  // they're bounced straight back to the shop.
  if (!user || !user.is_admin) return <Navigate to="/" replace />;
  return children;
}
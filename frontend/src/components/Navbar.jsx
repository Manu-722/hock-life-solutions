import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">Hock Life Solutions</Link>
      <nav>
        <Link to="/">Shop</Link>
        <Link to="/cart">Cart ({count})</Link>

        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>

            {/* This link only ever renders when the backend confirms the
                logged-in account's role is ADMIN - a normal customer's
                `user.is_admin` is always false, so they never see it. */}
            {user.is_admin && (
              <>
                <span className="admin-pill">Admin: {user.first_name || user.username}</span>
                <Link to="/admin">Admin Dashboard</Link>
              </>
            )}

            <button className="linklike" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

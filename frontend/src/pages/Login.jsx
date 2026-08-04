import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider, isFirebaseConfigured } from "../firebase";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const { applyTokens } = useAuth();
  const navigate = useNavigate();

  const afterLogin = (data) => {
    // Same login flow for everyone, whether via username/password or
    // Google. The backend tells us if this account is an admin - if so we
    // greet them by name as admin and send them to the dashboard;
    // otherwise it's a completely normal shopper login.
    if (data.is_admin) {
      setGreeting(`Welcome, ${data.username} (Admin)`);
      setTimeout(() => navigate(data.must_change_password ? "/settings" : "/admin"), 900);
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await client.post("/accounts/login/", { username, password });
      await applyTokens(data);
      afterLogin(data);
    } catch {
      setError("Invalid username or password.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      // Firebase handles the actual Google popup and identity verification.
      // We only need the resulting ID token, which our backend verifies
      // independently before issuing our own JWTs.
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const { data } = await client.post("/accounts/firebase-login/", { id_token: idToken });
      await applyTokens(data);
      afterLogin(data);
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") {
        // User just closed the popup - not a real error, stay quiet.
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Log in</h2>
      {greeting && <p className="status-approved">{greeting}</p>}
      {error && <p className="status-rejected">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit" style={{ width: "100%" }}>Log in</button>
      </form>

      <div className="divider"><span>or</span></div>

      {isFirebaseConfigured ? (
        <button
          type="button"
          className="btn secondary google-btn"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 16.2 3 9.4 7.4 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 36.6 26.8 37.5 24 37.5c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.3 40.5 16.1 45 24 45z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.3 5.2C40.9 35.9 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" />
          </svg>
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>
      ) : (
        <button type="button" className="btn secondary" disabled title="Google sign-in isn't configured yet">
          Continue with Google (not configured)
        </button>
      )}

      <p style={{ marginTop: 16 }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p>
        No account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}

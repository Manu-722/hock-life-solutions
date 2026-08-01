import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { GOOGLE_CLIENT_ID } from "../main";

// Isolated so useGoogleLogin() is only ever called while this component is
// mounted - and this component is only mounted when GOOGLE_CLIENT_ID exists
// (see the conditional render below). That keeps the Hooks rules happy
// while completely avoiding the "Missing required parameter client_id" crash.
function GoogleLoginButton({ onSuccess, onError }) {
  const googleLogin = useGoogleLogin({ onSuccess, onError });
  return (
    <button type="button" className="btn secondary google-btn" onClick={() => googleLogin()}>
      <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 16.2 3 9.4 7.4 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 36.6 26.8 37.5 24 37.5c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.3 40.5 16.1 45 24 45z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.3 5.2C40.9 35.9 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" />
      </svg>
      Continue with Google
    </button>
  );
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");
  const { applyTokens } = useAuth();
  const navigate = useNavigate();

  const afterLogin = (data) => {
    // Same login form for everyone. The backend tells us if this account
    // is an admin - if so we greet them by name as admin and send them to
    // the dashboard; otherwise it's a completely normal shopper login.
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

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const { data } = await client.post("/accounts/google/", { access_token: tokenResponse.access_token });
      await applyTokens(data);
      afterLogin(data);
    } catch {
      setError("Google sign-in failed. Please try again.");
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

      {GOOGLE_CLIENT_ID ? (
        <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={() => setError("Google sign-in failed. Please try again.")} />
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
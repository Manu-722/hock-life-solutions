import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await client.post("/accounts/google/", { access_token: tokenResponse.access_token });
        await applyTokens(data);
        afterLogin(data);
      } catch {
        setError("Google sign-in failed. Please try again.");
      }
    },
    onError: () => setError("Google sign-in failed. Please try again."),
  });

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

      <div style={{ margin: "16px 0", textAlign: "center", color: "var(--hl-gray)" }}>or</div>
      <button className="btn secondary" style={{ width: "100%" }} onClick={() => googleLogin()}>
        Continue with Google
      </button>

      <p style={{ marginTop: 16 }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p>
        No account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}

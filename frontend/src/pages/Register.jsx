import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", first_name: "", last_name: "", phone_number: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/accounts/register/", form);
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Registration failed.");
    }
  };

  return (
    <div className="card form-card">
      <h2>Create your account</h2>
      {error && <p className="status-rejected">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field"><label>Username</label><input value={form.username} onChange={update("username")} required /></div>
        <div className="field"><label>Email</label><input type="email" value={form.email} onChange={update("email")} required /></div>
        <div className="field"><label>First name</label><input value={form.first_name} onChange={update("first_name")} /></div>
        <div className="field"><label>Last name</label><input value={form.last_name} onChange={update("last_name")} /></div>
        <div className="field"><label>Phone number</label><input value={form.phone_number} onChange={update("phone_number")} /></div>
        <div className="field"><label>Password</label><input type="password" value={form.password} onChange={update("password")} required /></div>
        <button className="btn" type="submit" style={{ width: "100%" }}>Sign up</button>
      </form>
      <p style={{ marginTop: 16 }}>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}

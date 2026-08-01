import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./theme.css";

// Get this from https://console.cloud.google.com/apis/credentials
// Set it in frontend/.env as VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Only load/initialize Google's SDK when a real client ID is configured.
// Wrapping with GoogleOAuthProvider using an empty clientId crashes the
// whole app the moment any component calls useGoogleLogin() - so instead
// we skip the provider entirely until a real ID is set, and the Login page
// shows Google sign-in as unavailable until then instead of crashing.
ReactDOM.createRoot(document.getElementById("root")).render(
  GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{tree}</GoogleOAuthProvider>
  ) : (
    tree
  )
);
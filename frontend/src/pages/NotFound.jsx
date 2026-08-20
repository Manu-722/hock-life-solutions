import { Link } from "react-router-dom";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="empty-state" style={{ padding: "100px 20px" }}>
      <PackageX size={56} />
      <h1 style={{ margin: "10px 0 4px" }}>Page not found</h1>
      <p style={{ maxWidth: 380 }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn">Back to shop</Link>
    </div>
  );
}
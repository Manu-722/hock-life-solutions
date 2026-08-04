import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

function StarRow({ rating, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={22}
          fill={n <= rating ? "var(--hl-amber)" : "none"}
          color={n <= rating ? "var(--hl-amber)" : "var(--hl-border)"}
          style={{ cursor: onChange ? "pointer" : "default" }}
          onClick={() => onChange && onChange(n)}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    client
      .get("/products/reviews/", { params: { product: productId } })
      .then((res) => {
        const data = res.data.results || res.data;
        setReviews(data);
        // Pre-fill the form with the user's existing review, if any, so
        // submitting again naturally acts as "editing my review".
        const mine = user && data.find((r) => r.username === user.username);
        if (mine) {
          setMyRating(mine.rating);
          setMyComment(mine.comment);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [productId, user]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (myRating < 1) {
      setMessage("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      await client.post("/products/reviews/", { product: productId, rating: myRating, comment: myComment });
      setMessage("Thanks for your review!");
      load();
    } catch {
      setMessage("Could not submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="card" style={{ maxWidth: 800, margin: "24px auto" }}>
      <h3 className="section-title" style={{ marginTop: 0 }}>
        Reviews {average && <span style={{ color: "var(--hl-gray)", fontWeight: 400 }}>({average}/5 from {reviews.length})</span>}
      </h3>

      {user ? (
        <form onSubmit={submitReview} style={{ marginBottom: 24 }}>
          <div className="field">
            <label>Your rating</label>
            <StarRow rating={myRating} onChange={setMyRating} />
          </div>
          <div className="field">
            <label>Your review (optional)</label>
            <textarea rows={3} value={myComment} onChange={(e) => setMyComment(e.target.value)} placeholder="What did you think of this product?" />
          </div>
          {message && <p className="status-approved">{message}</p>}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </form>
      ) : (
        <p style={{ color: "var(--hl-gray)" }}>
          <Link to="/login">Log in</Link> to leave a review.
        </p>
      )}

      {loading ? (
        <p style={{ color: "var(--hl-gray)" }}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: "var(--hl-gray)" }}>No reviews yet - be the first!</p>
      ) : (
        <div>
          {reviews.map((r) => (
            <div key={r.id} style={{ borderTop: "1px solid var(--hl-border)", padding: "14px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{r.username}</strong>
                <StarRow rating={r.rating} />
              </div>
              {r.comment && <p style={{ margin: "6px 0 0", color: "var(--hl-gray)" }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

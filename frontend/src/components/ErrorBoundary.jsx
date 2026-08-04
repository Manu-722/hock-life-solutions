import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log it so it's still visible in the browser console for debugging.
    console.error("Caught by ErrorBoundary:", error, info);
  }

  // Reset the error state whenever the route changes (e.g. the person
  // clicks a different nav link) so navigating away from a broken page
  // recovers instead of staying permanently blank.
  componentDidUpdate(prevProps) {
    if (prevProps.locationKey !== this.props.locationKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="empty-state">
          <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>Something went wrong loading this page.</p>
          <p style={{ color: "var(--hl-gray)", maxWidth: 420 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button className="btn" onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

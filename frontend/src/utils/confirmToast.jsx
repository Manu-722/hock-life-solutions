import { toast } from "react-toastify";

/**
 * Shows a styled, in-app confirmation toast (Yes/Cancel buttons) instead of
 * the browser's native confirm() popup, which looks jarring next to the
 * rest of our themed toast notifications. Stays open until the person
 * picks one of the two buttons - never auto-dismisses.
 */
export function confirmToast(message, onConfirm) {
  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ margin: "0 0 12px", color: "var(--hl-white)", fontSize: "0.95rem" }}>{message}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn danger"
            style={{ padding: "7px 16px", fontSize: "0.85rem" }}
            onClick={() => {
              onConfirm();
              closeToast();
            }}
          >
            Yes, remove
          </button>
          <button
            className="btn secondary"
            style={{ padding: "7px 16px", fontSize: "0.85rem" }}
            onClick={closeToast}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    { autoClose: false, closeOnClick: false, draggable: false }
  );
}
// Remembers the visitor's cookie choice in their browser.
// Values: "all" or "essential". null means they haven't chosen yet.
const KEY = "hl_cookie_consent:v1";
const EVENT = "hl-consent-change";

export function getConsent() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Storage is blocked. The choice only lasts until the page is closed.
  }
  window.dispatchEvent(new Event(EVENT));
}

// Forgets the choice, which brings the cookie banner back.
export function clearConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear if storage is blocked.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeConsent(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
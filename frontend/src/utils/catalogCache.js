// Saves PUBLIC shop data (products, categories, homepage slides) in the
// browser so returning visitors see the shop instantly while fresh data
// loads in the background. Never use this for anything private: logins,
// account details and orders must always come fresh from the server.
const PREFIX = "hl_cache:v1:";

export function readCache(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    // Storage is full or blocked (private mode). The site still works, it
    // just loses the instant-load boost.
  }
}
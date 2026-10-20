import { useSyncExternalStore } from "react";
import { getConsent, subscribeConsent } from "../utils/consent";

// Returns "all", "essential", or null (not chosen yet) and updates
// automatically when the choice changes anywhere in the app.
export function useConsent() {
  return useSyncExternalStore(subscribeConsent, getConsent, () => null);
}
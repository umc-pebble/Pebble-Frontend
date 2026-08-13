export const FOLLOW_UPDATED_EVENT = "pebble:follow-updated";
export const FOLLOW_SYNC_INTERVAL_MS = 5_000;

export function notifyFollowUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(FOLLOW_UPDATED_EVENT));
  }
}

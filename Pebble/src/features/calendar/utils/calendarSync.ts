export const CALENDAR_UPDATED_EVENT = "pebble:calendar-updated";

const CALENDAR_REFRESH_DELAYS_MS = [0, 500, 1500];

export function notifyCalendarUpdated() {
  if (typeof window !== "undefined") {
    CALENDAR_REFRESH_DELAYS_MS.forEach((delay) => {
      window.setTimeout(() => {
        window.dispatchEvent(new Event(CALENDAR_UPDATED_EVENT));
      }, delay);
    });
  }
}

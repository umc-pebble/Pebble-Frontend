import { useContext } from "react";

import { CalendarLayoutContext } from "@/features/calendar/context/calendarLayoutContext";

export const useCalendarLayoutContext = () => {
  const context = useContext(CalendarLayoutContext);

  if (!context) {
    throw new Error(
      "useCalendarLayoutContext must be used within CalendarLayoutProvider.",
    );
  }

  return context;
};

import { createContext } from "react";

import type { CalendarLayoutContextValue } from "@/features/calendar/context/calendarLayoutContext.types";

export const CalendarLayoutContext =
  createContext<CalendarLayoutContextValue | null>(null);

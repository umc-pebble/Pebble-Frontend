export type CalendarDay = {
  day: number;
  monthOffset: -1 | 0 | 1;
};

export type CalendarEvent = {
  id: string;
  title: string;
  leftPercent: number;
  widthPercent: number;
  topOffset: number;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  isCompleted: boolean;
  variant: "milestone" | "task" | "standaloneTask";
};

export type CalendarWeek = {
  days: CalendarDay[];
  events?: CalendarEvent[];
};

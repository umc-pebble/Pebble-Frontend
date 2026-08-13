import type { MilestoneItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import type {
  CreateMilestoneRequest,
  MilestoneDateType,
  MilestoneResponse,
  UpdateMilestoneRequest,
} from "./milestoneApi.types";

const getDateTypeFromInput = (
  input: CreateScheduleItemInput,
): MilestoneDateType => {
  if (input.dates && input.dates.length > 1) {
    return "MULTIPLE";
  }

  if (input.end) {
    return "RANGE";
  }

  return "SINGLE";
};

const normalizeApiDate = (date?: string | null) => date?.slice(0, 10) ?? null;

export function mapMilestoneResponseToMilestone(
  milestone: MilestoneResponse,
  fallbackInput?: CreateScheduleItemInput,
): MilestoneItem {
  const fallbackStart = fallbackInput?.dates?.[0] ?? fallbackInput?.start ?? "";
  const responseDates = milestone.dates
    ?.map((date) => normalizeApiDate(date) ?? date)
    .sort((a, b) => a.localeCompare(b));
  const fallbackDates = fallbackInput?.dates
    ? [...fallbackInput.dates].sort((a, b) => a.localeCompare(b))
    : undefined;
  const dates = responseDates ?? fallbackDates;
  const startDate = normalizeApiDate(milestone.startDate);
  const endDate = normalizeApiDate(milestone.endDate);

  return {
    id: String(milestone.id),
    categoryId: milestone.categoryId ? String(milestone.categoryId) : undefined,
    title: milestone.name || fallbackInput?.title || "",
    start: startDate ?? dates?.[0] ?? fallbackStart,
    end: endDate ?? fallbackInput?.end ?? undefined,
    itemType: "milestone",
    seriesId: milestone.seriesId ?? undefined,
    dateType: milestone.dateType,
    dates,
    isCompleted: milestone.isCompleted ?? false,
    displayOrder: milestone.displayOrder,
    tasks: [],
  };
}

export function mapScheduleInputToCreateMilestoneRequest(
  input: CreateScheduleItemInput,
): CreateMilestoneRequest {
  const dateType = getDateTypeFromInput(input);

  return {
    name: input.title,
    dateType,
    startDate: dateType === "MULTIPLE" ? undefined : input.start,
    endDate: dateType === "RANGE" ? input.end ?? null : null,
    dates: dateType === "MULTIPLE" ? input.dates ?? [] : null,
  };
}

export function mapScheduleInputToUpdateMilestoneRequest(
  input: CreateScheduleItemInput,
  categoryId: string,
): UpdateMilestoneRequest {
  const dateType = getDateTypeFromInput(input);

  return {
    name: input.title,
    categoryId: Number(categoryId),
    dateType,
    startDate: dateType === "MULTIPLE" ? undefined : input.start,
    endDate: dateType === "RANGE" ? input.end ?? null : null,
    dates: dateType === "MULTIPLE" ? input.dates ?? [] : null,
  };
}

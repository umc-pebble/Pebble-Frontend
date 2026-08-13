import { apiRequest } from "@/services/api";
import type { MilestoneItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  mapMilestoneResponseToMilestone,
  mapScheduleInputToCreateMilestoneRequest,
  mapScheduleInputToUpdateMilestoneRequest,
} from "./milestoneMapper";
import type {
  CreateMilestoneResponse,
  GetMilestonesResponse,
  MilestoneDeleteScope,
  MilestoneResponse,
} from "./milestoneApi.types";

const mapCreatedMilestones = (
  data: CreateMilestoneResponse | MilestoneResponse | null,
  input: CreateScheduleItemInput,
) => {
  if (!data) {
    return [];
  }

  if ("milestones" in data && data.milestones?.length) {
    return data.milestones.map((milestone) =>
      mapMilestoneResponseToMilestone(milestone, input),
    );
  }

  if ("milestone" in data && data.milestone) {
    return [mapMilestoneResponseToMilestone(data.milestone, input)];
  }

  if ("id" in data) {
    return [mapMilestoneResponseToMilestone(data, input)];
  }

  return [];
};

export async function getMilestones(categoryId: string): Promise<MilestoneItem[]> {
  const data = await apiRequest<GetMilestonesResponse>({
    method: "GET",
    url: `/categories/${categoryId}/milestones`,
  });

  return (
    data?.milestones.map((milestone) =>
      mapMilestoneResponseToMilestone(milestone),
    ) ?? []
  );
}

export async function getUserCategoryMilestones(
  userId: number,
  categoryId: string,
): Promise<MilestoneItem[]> {
  const data = await apiRequest<GetMilestonesResponse>({
    method: "GET",
    url: `/users/${userId}/categories/${categoryId}/milestones`,
  });

  return (
    data?.milestones.map((milestone) =>
      mapMilestoneResponseToMilestone(milestone),
    ) ?? []
  );
}

export async function getMonthlyMilestones(
  baseDate?: string,
): Promise<MilestoneItem[]> {
  const data = await apiRequest<GetMilestonesResponse>({
    method: "GET",
    url: "/milestones",
    params: baseDate ? { baseDate } : undefined,
  });

  return (
    data?.milestones.map((milestone) =>
      mapMilestoneResponseToMilestone(milestone),
    ) ?? []
  );
}

export async function createMilestone(
  categoryId: string,
  input: CreateScheduleItemInput,
): Promise<MilestoneItem[]> {
  const data = await apiRequest<CreateMilestoneResponse | MilestoneResponse>({
    method: "POST",
    url: `/categories/${categoryId}/milestones`,
    data: mapScheduleInputToCreateMilestoneRequest(input),
  });

  return mapCreatedMilestones(data, input);
}

export async function updateMilestone(
  milestoneId: string,
  categoryId: string,
  input: CreateScheduleItemInput,
): Promise<MilestoneItem | null> {
  const data = await apiRequest<MilestoneResponse>({
    method: "PATCH",
    url: `/milestones/${milestoneId}`,
    data: mapScheduleInputToUpdateMilestoneRequest(input, categoryId),
  });

  return data ? mapMilestoneResponseToMilestone(data) : null;
}

export async function deleteMilestone(
  milestoneId: string,
  deleteScope?: MilestoneDeleteScope,
): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/milestones/${milestoneId}`,
    params: deleteScope ? { deleteScope } : undefined,
  });
}

export async function toggleMilestoneComplete(
  milestoneId: string,
  isCompleted: boolean,
): Promise<MilestoneItem | null> {
  const data = await apiRequest<MilestoneResponse>({
    method: "PATCH",
    url: `/milestones/${milestoneId}`,
    data: { isCompleted },
  });

  return data ? mapMilestoneResponseToMilestone(data) : null;
}

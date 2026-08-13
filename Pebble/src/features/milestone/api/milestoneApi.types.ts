export type MilestoneDateType = "SINGLE" | "RANGE" | "MULTIPLE";
export type MilestoneEditScope = "THIS_ONLY" | "ALL";
export type MilestoneDeleteScope = "THIS_ONLY" | "ALL";

export type MilestoneResponse = {
  id: number;
  categoryId?: number;
  seriesId?: number | null;
  series?: MilestoneResponse[];
  name: string;
  dateType: MilestoneDateType;
  startDate?: string | null;
  endDate?: string | null;
  dates?: string[] | null;
  isCompleted?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type GetMilestonesResponse = {
  milestones: MilestoneResponse[];
};

export type CreateMilestoneResponse = {
  milestone?: MilestoneResponse;
  milestones?: MilestoneResponse[];
};

export type CreateMilestoneRequest = {
  name: string;
  dateType: MilestoneDateType;
  startDate?: string | null;
  endDate?: string | null;
  dates?: string[] | null;
};

export type UpdateMilestoneRequest = {
  name?: string;
  categoryId?: number;
  dateType?: MilestoneDateType;
  startDate?: string | null;
  endDate?: string | null;
  dates?: string[] | null;
  isCompleted?: boolean;
  editScope?: MilestoneEditScope;
};

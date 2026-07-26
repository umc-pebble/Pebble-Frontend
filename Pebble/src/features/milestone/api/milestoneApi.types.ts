export type MilestoneDateType = "SINGLE" | "RANGE" | "MULTIPLE";
export type MilestoneEditScope = "THIS_ONLY" | "ALL";
export type MilestoneDeleteScope = "THIS_ONLY" | "ALL";

export type MilestoneResponse = {
  id: number;
  categoryId?: number;
  seriesId?: number | null;
  name: string;
  dateType: MilestoneDateType;
  startDate?: string | null;
  endDate?: string | null;
  isCompleted?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type GetMilestonesResponse = {
  milestones: MilestoneResponse[];
};

export type CreateMilestoneResponse = {
  milestones: MilestoneResponse[];
};

export type CreateMilestoneRequest = {
  name: string;
  dateType: MilestoneDateType;
  startDate?: string | null;
  endDate?: string | null;
  dates?: string[] | null;
};

export type UpdateMilestoneRequest = Partial<CreateMilestoneRequest> & {
  isCompleted?: boolean;
  editScope?: MilestoneEditScope;
};

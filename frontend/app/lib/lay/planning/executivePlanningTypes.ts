import type { ExecutiveJudgmentResult } from "../judgment/executiveJudgmentEngine.ts";

export type ExecutivePlanningCapabilityId =
  | "goalPlanning"
  | "milestonePlanning"
  | "dependencyPlanning"
  | "phasePlanning"
  | "resourcePlanning"
  | "timelinePlanning"
  | "explanationGeneration";

export type ExecutivePlanningInput = Readonly<{
  sessionId: string;
  judgment: ExecutiveJudgmentResult;
}>;

export type ExecutivePlanningSession = Readonly<{
  sessionId: string;
  phase: "LAY-4";
  judgmentSessionId: string;
}>;

export type ExecutiveGoal = Readonly<{
  goalId: string;
  label: string;
  sourceJudgmentId: string;
  priorityOrder: number;
  rationaleReference: string;
}>;

export type ExecutiveMilestone = Readonly<{
  milestoneId: string;
  goalId: string;
  label: string;
  logicalOrder: number;
  sourceJudgmentId: string;
}>;

export type ExecutiveDependency = Readonly<{
  dependencyId: string;
  fromId: string;
  toId: string;
  dependencyType: "goal-to-milestone" | "milestone-to-milestone" | "phase-to-phase";
  explanation: string;
}>;

export type ExecutivePhase = Readonly<{
  phaseId: string;
  label: string;
  logicalOrder: number;
  milestoneIds: readonly string[];
  sourceJudgmentId: string;
}>;

export type ExecutiveResource = Readonly<{
  resourceId: string;
  label: string;
  resourceType: "attention" | "capacity" | "coordination";
  linkedGoalId: string;
  allocationMode: "logical-only";
}>;

export type ExecutiveTimeline = Readonly<{
  timelineId: string;
  mode: "logical-only";
  sequence: readonly string[];
  realDatesAssigned: false;
  durationsAssigned: false;
}>;

export type ExecutivePlanExplanation = Readonly<{
  explanationId: string;
  whyThisPlan: readonly string[];
  whyTheseMilestones: readonly string[];
  whyThisSequence: readonly string[];
  judgmentTrace: readonly string[];
  narrative: string;
}>;

export type ExecutivePlanningValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type ExecutivePlanningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutivePlanningValidationIssue[];
}>;

export type ExecutivePlanningResult = Readonly<{
  session: ExecutivePlanningSession;
  input: ExecutivePlanningInput;
  goals: readonly ExecutiveGoal[];
  milestones: readonly ExecutiveMilestone[];
  dependencies: readonly ExecutiveDependency[];
  phases: readonly ExecutivePhase[];
  resources: readonly ExecutiveResource[];
  timeline: ExecutiveTimeline;
  explanation: ExecutivePlanExplanation;
  validation: ExecutivePlanningValidationResult;
}>;

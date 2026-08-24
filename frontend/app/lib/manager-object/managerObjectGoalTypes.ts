/**
 * MO:4 — Goal-Directed Executive Navigation schemas.
 * Consumes MO:3 paths. Does not own goals, KPIs, decisions, or execution.
 */

import type { ExplanationEpistemicStatus } from "./managerObjectExplainTypes.ts";
import type { ExecutiveExplorationPath } from "./managerObjectExplorationTypes.ts";
import type { ManagerObjectKind } from "./managerObjectInteractionFoundation.ts";

export const goalDirectedNavigationIdentity =
  "MO:4/GoalDirectedExecutiveNavigation" as const;
export const goalDirectedNavigationVersion = "1.0.0" as const;
export const goalDirectedNavigationNamespace =
  "nexora.manager-object.goal-directed-navigation" as const;

export const GOAL_SOURCES = Object.freeze([
  "explicit",
  "resolved",
  "inferred",
  "unknown",
] as const);
export type GoalSource = (typeof GOAL_SOURCES)[number];

export const GOAL_PRIORITY_ROLES = Object.freeze([
  "ACTIVE",
  "SECONDARY",
  "CONFLICTING",
  "UNKNOWN_PRIORITY",
] as const);
export type GoalPriorityRole = (typeof GOAL_PRIORITY_ROLES)[number];

export const GOAL_PROGRESS_STATES = Object.freeze([
  "UNKNOWN",
  "OFF_TRACK",
  "AT_RISK",
  "ON_TRACK",
  "ACHIEVED",
] as const);
export type GoalProgressState = (typeof GOAL_PROGRESS_STATES)[number];

export const GOAL_DIRECTED_NAVIGATION_BOUNDARY = Object.freeze({
  identity: goalDirectedNavigationIdentity,
  consumesMo3: true as const,
  duplicatesMo3: false as const,
  redesignsStage: false as const,
  redesignsAdvisor: false as const,
  writesStageCoordinates: false as const,
  createsParallelGoalTruth: false as const,
  createsParallelStrategy: false as const,
  createsParallelOkr: false as const,
  createsParallelGraph: false as const,
  createsParallelAdvisor: false as const,
  inventsRelationships: false as const,
  inventsGoals: false as const,
  promotesInferredToConfirmed: false as const,
  commitsDecisions: false as const,
  startsExecution: false as const,
  inventsOutcomes: false as const,
  usesLlm: false as const,
  hardcodedJourneys: false as const,
  truthPrecedence:
    "Canonical Runtime Truth > MO Context > MO:2 Explanation > MO:3 Paths > MO:4 Goal Direction > Presentation" as const,
  llmBoundary:
    "Optional future wording only. Must not invent manager goals, priorities, relationships, KPI values, gaps, blockers, scenarios, trade-offs, decisions, execution, or outcomes.",
});

export type ExecutiveGoalSuccessSignal = {
  readonly id: string;
  readonly label: string;
  readonly value: string | null;
  readonly target: string | null;
  readonly objectId: string | null;
  readonly epistemicStatus: ExplanationEpistemicStatus;
};

export type ExecutiveGoalGap = {
  readonly quantification: "measured" | "unknown";
  readonly desiredState: string | null;
  readonly currentState: string | null;
  readonly summary: string;
  readonly epistemicStatus: ExplanationEpistemicStatus;
};

export type ExecutiveGoalContext = {
  readonly goalId: string | null;
  readonly title: string;
  readonly description: string | null;
  readonly source: GoalSource;
  readonly status: "understood" | "unknown";
  readonly epistemicStatus: ExplanationEpistemicStatus;
  readonly relatedObjects: readonly string[];
  readonly successSignals: readonly ExecutiveGoalSuccessSignal[];
  readonly constraints: readonly string[];
  readonly currentGap: ExecutiveGoalGap | null;
  readonly managerConfirmed: boolean;
  readonly persisted: boolean;
  readonly role: GoalPriorityRole;
};

export type ExecutiveGoalCurrentPosition = {
  readonly objectId: string | null;
  readonly label: string | null;
  readonly kind: ManagerObjectKind | null;
  readonly relationToGoal:
    | "goal-itself"
    | "on-path"
    | "unrelated"
    | "unknown";
  readonly summary: string;
  readonly epistemicStatus: ExplanationEpistemicStatus;
};

export type GoalRelevanceSignal = {
  readonly id: string;
  readonly label: string;
  readonly contribution: number;
  readonly epistemicStatus: ExplanationEpistemicStatus;
};

export type RankedGoalPath = {
  readonly path: ExecutiveExplorationPath;
  readonly goalScore: number;
  readonly relevanceSignals: readonly GoalRelevanceSignal[];
  readonly conflictsWith: readonly string[];
  readonly why: string;
};

export type ExecutiveGoalNavigation = {
  readonly engineId: typeof goalDirectedNavigationIdentity;
  readonly goal: ExecutiveGoalContext;
  readonly secondaryGoals: readonly ExecutiveGoalContext[];
  readonly currentPosition: ExecutiveGoalCurrentPosition;
  readonly goalGap: ExecutiveGoalGap;
  readonly recommendedDirection: string;
  readonly recommendedPath: RankedGoalPath | null;
  readonly alternativePaths: readonly RankedGoalPath[];
  readonly progressState: GoalProgressState;
  readonly progressSignals: readonly string[];
  readonly blockers: readonly string[];
  readonly unknowns: readonly string[];
  readonly conflicts: readonly string[];
  readonly reasoningSummary: string;
  readonly managerFacingText: string;
  readonly usesLlm: false;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly writesStageCoordinates: false;
};

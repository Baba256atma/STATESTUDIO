/**
 * MO:5 — Executive Journey & Progress Intelligence schemas.
 * Projection over existing authorities. Not a workflow or truth engine.
 */

import type { ExplanationEpistemicStatus } from "./managerObjectExplainTypes.ts";
import type { ExecutiveGoalContext } from "./managerObjectGoalTypes.ts";
import type { ManagerObjectKind } from "./managerObjectInteractionFoundation.ts";

export const executiveJourneyIntelligenceIdentity =
  "MO:5/ExecutiveJourneyProgressIntelligence" as const;
export const executiveJourneyIntelligenceVersion = "1.0.0" as const;
export const executiveJourneyIntelligenceNamespace =
  "nexora.manager-object.executive-journey-intelligence" as const;

export const JOURNEY_PHASES = Object.freeze([
  "CONTEXT",
  "GOAL",
  "REALITY",
  "ISSUE",
  "SCENARIO",
  "DECISION",
  "EXECUTION",
  "OUTCOME",
  "LEARNING",
] as const);
export type JourneyPhase = (typeof JOURNEY_PHASES)[number];

export const JOURNEY_STATES = Object.freeze([
  "UNKNOWN",
  "DISCOVERING",
  "INVESTIGATING",
  "EVALUATING",
  "AWAITING_DECISION",
  "EXECUTING",
  "AWAITING_OUTCOME",
  "LEARNING",
  "GOAL_ACHIEVED",
  "STALLED",
] as const);
export type JourneyState = (typeof JOURNEY_STATES)[number];

export const JOURNEY_HEALTH_STATES = Object.freeze([
  "UNKNOWN",
  "HEALTHY",
  "AT_RISK",
  "BLOCKED",
] as const);
export type JourneyHealth = (typeof JOURNEY_HEALTH_STATES)[number];

export const JOURNEY_ITEM_STATUSES = Object.freeze([
  "RESOLVED",
  "UNRESOLVED",
  "UNKNOWN",
] as const);
export type JourneyItemStatus = (typeof JOURNEY_ITEM_STATUSES)[number];

export const JOURNEY_BLOCKER_KINDS = Object.freeze([
  "MISSING_GOAL",
  "INSUFFICIENT_REALITY",
  "UNRESOLVED_ISSUE",
  "INSUFFICIENT_EVIDENCE",
  "SCENARIO_REQUIRED",
  "TRADEOFF_UNRESOLVED",
  "DECISION_REQUIRED",
  "EXECUTION_BLOCKED",
  "OUTCOME_REQUIRED",
  "LEARNING_REQUIRED",
  "UNKNOWN",
] as const);
export type JourneyBlockerKind = (typeof JOURNEY_BLOCKER_KINDS)[number];

export const JOURNEY_DECISION_STATES = Object.freeze([
  "none",
  "proposed",
  "recommended",
  "awaiting-confirmation",
  "committed",
  "rejected",
  "unknown",
] as const);
export type JourneyDecisionState = (typeof JOURNEY_DECISION_STATES)[number];

export const JOURNEY_EXECUTION_STATES = Object.freeze([
  "NOT_STARTED",
  "ACTIVE",
  "BLOCKED",
  "COMPLETED",
  "UNKNOWN",
] as const);
export type JourneyExecutionState = (typeof JOURNEY_EXECUTION_STATES)[number];

export const JOURNEY_OUTCOME_STATES = Object.freeze([
  "NOT_OBSERVED",
  "OBSERVED",
  "IMPROVED",
  "UNCHANGED",
  "DEGRADED",
  "UNKNOWN",
] as const);
export type JourneyOutcomeState = (typeof JOURNEY_OUTCOME_STATES)[number];

export const JOURNEY_LEARNING_STATES = Object.freeze([
  "NOT_AVAILABLE",
  "AVAILABLE",
  "CAPTURED",
  "UNKNOWN",
] as const);
export type JourneyLearningState = (typeof JOURNEY_LEARNING_STATES)[number];

export const GOAL_REEVALUATION_ACTIONS = Object.freeze([
  "CONTINUE",
  "REASSESS",
  "REVISIT_DECISION",
  "REVISIT_SCENARIO",
  "REVISIT_ISSUE",
  "CLOSE_GOAL",
  "UNKNOWN",
] as const);
export type GoalReevaluationAction = (typeof GOAL_REEVALUATION_ACTIONS)[number];

export const EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY = Object.freeze({
  identity: executiveJourneyIntelligenceIdentity,
  readerResolverInterpreter: true as const,
  workflowEngine: false as const,
  duplicatesMo3: false as const,
  duplicatesMo4: false as const,
  redesignsStage: false as const,
  redesignsAdvisor: false as const,
  writesStageCoordinates: false as const,
  createsParallelHistory: false as const,
  createsParallelDecisionRuntime: false as const,
  createsParallelExecutionRuntime: false as const,
  createsParallelOutcomeTruth: false as const,
  createsParallelLearningStore: false as const,
  treatsVisitedAsResolved: false as const,
  commitsDecisions: false as const,
  startsExecution: false as const,
  closesGoals: false as const,
  usesLlm: false as const,
  hardcodedJourneys: false as const,
  truthPrecedence:
    "Canonical Runtime Truth > MO Context > MO:2 Explanation > MO:3 Paths > MO:4 Goal Direction > MO:5 Journey Projection > Presentation" as const,
  llmBoundary:
    "Optional future wording only. Must not invent journey facts, blockers, decisions, execution, outcomes, learning, or progress percentages.",
});

export type ExecutiveJourneyItem = {
  readonly id: string;
  readonly label: string;
  readonly status: JourneyItemStatus;
  readonly epistemicStatus: ExplanationEpistemicStatus;
  readonly subjectId: string | null;
};

export type ExecutiveJourneyBlocker = {
  readonly kind: JourneyBlockerKind;
  readonly subjectId: string | null;
  readonly reason: string;
  readonly evidence: readonly string[];
  readonly epistemicStatus: ExplanationEpistemicStatus;
  readonly severity: "low" | "medium" | "high" | null;
  readonly recommendedResolutionPath: string | null;
  readonly isBusinessCause: false;
};

export type ExecutiveJourneyVisit = {
  readonly objectId: string;
  readonly kind: ManagerObjectKind | null;
  readonly label: string | null;
};

export type ExecutiveJourneySnapshot = {
  readonly goalTitle: string;
  readonly phase: JourneyPhase;
  readonly journeyState: JourneyState;
  readonly blockerKind: JourneyBlockerKind | null;
  readonly objectId: string | null;
};

export type ExecutiveJourneyProgressSignal = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly epistemicStatus: ExplanationEpistemicStatus;
};

export type ExecutiveJourneyIntelligence = {
  readonly engineId: typeof executiveJourneyIntelligenceIdentity;
  readonly journeyId: string;
  readonly activeGoal: ExecutiveGoalContext;
  readonly secondaryGoals: readonly ExecutiveGoalContext[];
  readonly currentObjectId: string | null;
  readonly currentPhase: JourneyPhase;
  readonly journeyState: JourneyState;
  readonly health: JourneyHealth;
  readonly visitedSubjects: readonly ExecutiveJourneyVisit[];
  readonly resolvedItems: readonly ExecutiveJourneyItem[];
  readonly unresolvedItems: readonly ExecutiveJourneyItem[];
  readonly blockedItems: readonly ExecutiveJourneyItem[];
  readonly activeProblems: readonly string[];
  readonly activeRisks: readonly string[];
  readonly availableScenarios: readonly string[];
  readonly scenarioBranches: readonly string[];
  readonly decisionState: JourneyDecisionState;
  readonly executionState: JourneyExecutionState;
  readonly outcomeState: JourneyOutcomeState;
  readonly learningState: JourneyLearningState;
  readonly progressSignals: readonly ExecutiveJourneyProgressSignal[];
  readonly unknowns: readonly string[];
  readonly history: readonly ExecutiveJourneySnapshot[];
  readonly semanticProjection: readonly string[];
  readonly blocker: ExecutiveJourneyBlocker | null;
  readonly nextMilestone: string;
  readonly objectFit: string;
  readonly reevaluation: GoalReevaluationAction;
  readonly closesGoal: false;
  readonly reasoningSummary: string;
  readonly accomplishedText: string;
  readonly unresolvedText: string;
  readonly blockerText: string;
  readonly managerFacingText: string;
  readonly usesLlm: false;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly writesStageCoordinates: false;
};

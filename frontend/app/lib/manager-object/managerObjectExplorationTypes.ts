/**
 * MO:3 — Object-Guided Executive Exploration schemas.
 * Reader + path resolver. Does not own KPI, relationships, decisions, or execution.
 */

import type { ExplanationEpistemicStatus } from "./managerObjectExplainTypes.ts";
import type { ManagerObjectIntent } from "./managerObjectInteractionFoundation.ts";
import type { ManagerObjectKind } from "./managerObjectInteractionFoundation.ts";

export const objectGuidedExplorationIdentity =
  "MO:3/ObjectGuidedExecutiveExploration" as const;
export const objectGuidedExplorationVersion = "1.0.0" as const;

export const EXPLORATION_PATH_KINDS = Object.freeze([
  "RELATED_OBJECT",
  "INVESTIGATE",
  "QUESTION",
  "EVIDENCE",
  "RISK",
  "OPPORTUNITY",
  "SCENARIO",
  "COMPARE",
  "RECOMMENDATION",
  "DECISION",
  "EXECUTION",
  "OUTCOME",
  "GOAL",
] as const);
export type ExplorationPathKind = (typeof EXPLORATION_PATH_KINDS)[number];

export const EXPLORATION_STATES = Object.freeze([
  "ready",
  "limited",
  "blocked",
  "unknown",
] as const);
export type ExplorationState = (typeof EXPLORATION_STATES)[number];

export const OBJECT_GUIDED_EXPLORATION_BOUNDARY = Object.freeze({
  identity: objectGuidedExplorationIdentity,
  readerPathResolver: true as const,
  redesignsStage: false as const,
  redesignsAdvisor: false as const,
  writesStageCoordinates: false as const,
  createsParallelCatalog: false as const,
  createsParallelGraph: false as const,
  createsParallelNavigation: false as const,
  inventsPaths: false as const,
  inventsDecisions: false as const,
  commitsDecisions: false as const,
  startsExecution: false as const,
  usesLlm: false as const,
  perObjectExplorationBranches: false as const,
  truthPrecedence:
    "Canonical Runtime Truth > MO Context > MO:2 Explanation > MO:3 Paths > Presentation" as const,
  llmBoundary:
    "Optional future wording only. Must not invent objects, edges, goals, evidence, risks, scenarios, decisions, outcomes, or unsupported paths." as const,
});

export type ExecutiveExplorationPath = {
  readonly pathId: string;
  readonly kind: ExplorationPathKind;
  readonly label: string;
  readonly targetObjectId: string | null;
  readonly question: string | null;
  readonly action: string | null;
  readonly reason: string;
  readonly relevance: string;
  readonly priority: number;
  readonly evidence: string | null;
  readonly epistemicStatus: ExplanationEpistemicStatus;
  readonly requiresManagerChoice: true;
  readonly commitsDecision: false;
  readonly startsExecution: false;
};

export type ExecutiveObjectExploration = {
  readonly engineId: typeof objectGuidedExplorationIdentity;
  readonly subject: {
    readonly id: string | null;
    readonly label: string | null;
    readonly kind: ManagerObjectKind | null;
  };
  readonly intent: ManagerObjectIntent;
  readonly explorationState: ExplorationState;
  readonly recommendedPaths: readonly ExecutiveExplorationPath[];
  readonly alternativePaths: readonly ExecutiveExplorationPath[];
  readonly availablePaths: readonly ExecutiveExplorationPath[];
  readonly blockedPaths: readonly ExecutiveExplorationPath[];
  readonly unknowns: readonly string[];
  readonly reasoningSummary: string;
  readonly managerFacingText: string;
  readonly usesLlm: false;
  readonly commitsDecision: false;
  readonly startsExecution: false;
};

export type ManagerObjectExplorationAnchor = {
  readonly pathId: string;
  readonly kind: ExplorationPathKind;
  readonly targetObjectId: string | null;
  readonly reason: string;
  readonly label: string;
};

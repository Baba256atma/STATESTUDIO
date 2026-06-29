/**
 * APP-4:7 — Executive Decision Memory domain types.
 */

import type { ExecutiveMemoryId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type {
  EXECUTIVE_DECISION_MEMORY_CONFIDENCE_LEVEL_KEYS,
  EXECUTIVE_DECISION_MEMORY_REFERENCE_TYPE_KEYS,
  EXECUTIVE_DECISION_MEMORY_STATE_KEYS,
} from "./executiveDecisionMemoryConstants.ts";

export type ExecutiveDecisionMemoryId = string;
export type ExecutiveDecisionId = string;
export type ExecutiveDecisionMemoryState = (typeof EXECUTIVE_DECISION_MEMORY_STATE_KEYS)[number];
export type ExecutiveDecisionMemoryReferenceType =
  (typeof EXECUTIVE_DECISION_MEMORY_REFERENCE_TYPE_KEYS)[number];
export type ExecutiveDecisionConfidenceLevel =
  (typeof EXECUTIVE_DECISION_MEMORY_CONFIDENCE_LEVEL_KEYS)[number];

export type ExecutiveDecisionMemoryReference = Readonly<{
  referenceId: string;
  referenceType: ExecutiveDecisionMemoryReferenceType;
  targetId: string;
  label: string;
  readOnly: true;
}>;

export type ExecutiveDecisionEvidence = Readonly<{
  evidenceId: string;
  source: string;
  summary: string;
  capturedAt: string;
  reliability: "low" | "medium" | "high" | "unknown";
  readOnly: true;
}>;

export type ExecutiveDecisionOutcome = Readonly<{
  outcomeId: string;
  label: string;
  description: string;
  kind: "expected" | "actual";
  status: "projected" | "achieved" | "missed" | "unknown";
  readOnly: true;
}>;

export type ExecutiveDecisionRationale = Readonly<{
  rationaleId: string;
  summary: string;
  explanation: string;
  decidedBy: string;
  decidedAt: string;
  readOnly: true;
}>;

export type ExecutiveDecisionConstraint = Readonly<{
  constraintId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ExecutiveDecisionAlternative = Readonly<{
  alternativeId: string;
  label: string;
  description: string;
  rejectedReason: string | null;
  readOnly: true;
}>;

export type ExecutiveDecisionConfidence = Readonly<{
  confidenceId: string;
  score: number | null;
  level: ExecutiveDecisionConfidenceLevel;
  source: string;
  explanation: string;
  readOnly: true;
}>;

export type ExecutiveDecisionReview = Readonly<{
  reviewId: string;
  reviewer: string;
  reviewedAt: string;
  summary: string;
  status: "pending" | "approved" | "rejected" | "deferred";
  readOnly: true;
}>;

export type ExecutiveDecisionMemoryMetadata = Readonly<{
  title: string;
  summary: string;
  owner: string;
  sourceModule: string;
  customMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveDecisionMemoryVersion = Readonly<{
  versionId: string;
  semanticVersion: string;
  schemaVersion: string;
  contractVersion: string;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveDecisionMemory = Readonly<{
  memoryId: ExecutiveDecisionMemoryId;
  decisionId: ExecutiveDecisionId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  goalId: string | null;
  intentId: string | null;
  scenarioId: string | null;
  executiveMemoryIds: readonly ExecutiveMemoryId[];
  riskIds: readonly string[];
  kpiIds: readonly string[];
  objectIds: readonly string[];
  relationshipIds: readonly string[];
  timelineIds: readonly string[];
  assumptions: readonly string[];
  evidence: readonly ExecutiveDecisionEvidence[];
  constraints: readonly ExecutiveDecisionConstraint[];
  alternatives: readonly ExecutiveDecisionAlternative[];
  rationale: ExecutiveDecisionRationale;
  confidence: ExecutiveDecisionConfidence;
  expectedOutcomes: readonly ExecutiveDecisionOutcome[];
  actualOutcomes: readonly ExecutiveDecisionOutcome[];
  lessonsLearned: readonly string[];
  reviews: readonly ExecutiveDecisionReview[];
  references: readonly ExecutiveDecisionMemoryReference[];
  metadata: ExecutiveDecisionMemoryMetadata;
  lifecycle: ExecutiveDecisionMemoryState;
  version: ExecutiveDecisionMemoryVersion;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  schemaVersion: string;
  contractVersion: string;
  readOnly: true;
}>;

export type CreateExecutiveDecisionMemoryInput = Readonly<{
  memoryId: ExecutiveDecisionMemoryId;
  decisionId: ExecutiveDecisionId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  goalId?: string | null;
  intentId?: string | null;
  scenarioId?: string | null;
  executiveMemoryIds?: readonly ExecutiveMemoryId[];
  riskIds?: readonly string[];
  kpiIds?: readonly string[];
  objectIds?: readonly string[];
  relationshipIds?: readonly string[];
  timelineIds?: readonly string[];
  assumptions?: readonly string[];
  evidence?: readonly ExecutiveDecisionEvidence[];
  constraints?: readonly ExecutiveDecisionConstraint[];
  alternatives?: readonly ExecutiveDecisionAlternative[];
  rationale: ExecutiveDecisionRationale;
  confidence: ExecutiveDecisionConfidence;
  expectedOutcomes?: readonly ExecutiveDecisionOutcome[];
  actualOutcomes?: readonly ExecutiveDecisionOutcome[];
  lessonsLearned?: readonly string[];
  reviews?: readonly ExecutiveDecisionReview[];
  references?: readonly ExecutiveDecisionMemoryReference[];
  metadata: ExecutiveDecisionMemoryMetadata;
  version: ExecutiveDecisionMemoryVersion;
  createdAt: string;
  updatedAt: string;
  schemaVersion?: string;
  contractVersion?: string;
}>;

export type UpdateExecutiveDecisionMemoryInput = Readonly<{
  metadata?: Readonly<{
    title?: string;
    summary?: string;
    customMetadata?: Readonly<Record<string, string>>;
  }>;
  confidence?: ExecutiveDecisionConfidence;
  rationale?: Readonly<{
    summary?: string;
    explanation?: string;
  }>;
  expectedOutcomes?: readonly ExecutiveDecisionOutcome[];
  actualOutcomes?: readonly ExecutiveDecisionOutcome[];
  lessonsLearned?: readonly string[];
  reviews?: readonly ExecutiveDecisionReview[];
}>;

export type ExecutiveDecisionMemoryQuery = Readonly<{
  memoryId?: ExecutiveDecisionMemoryId;
  decisionId?: ExecutiveDecisionId;
  workspaceId?: ExecutiveMemoryWorkspaceId;
  goalId?: string;
  intentId?: string;
  scenarioId?: string;
  riskId?: string;
  kpiId?: string;
  lifecycle?: ExecutiveDecisionMemoryState;
}>;

export type ExecutiveDecisionTargetRegistration = Readonly<{
  decisionId: ExecutiveDecisionId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  status?: string | null;
}>;

export type ExecutiveDecisionMemoryError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveDecisionMemoryResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ExecutiveDecisionMemoryError | null;
  readOnly: true;
}>;

export type ExecutiveDecisionMemoryStatistics = Readonly<{
  totalMemories: number;
  activeMemories: number;
  archivedMemories: number;
  memoriesByWorkspace: Readonly<Record<string, number>>;
  memoriesByDecision: Readonly<Record<string, number>>;
  memoriesByGoal: Readonly<Record<string, number>>;
  memoriesByIntent: Readonly<Record<string, number>>;
  memoriesByScenario: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveDecisionMemoryGraph = Readonly<{
  memoryId: ExecutiveDecisionMemoryId | null;
  decisionId: ExecutiveDecisionId | null;
  linkedGoalIds: readonly string[];
  linkedIntentIds: readonly string[];
  linkedScenarioIds: readonly string[];
  linkedExecutiveMemoryIds: readonly ExecutiveMemoryId[];
  linkedRiskIds: readonly string[];
  linkedKpiIds: readonly string[];
  linkedEvidenceIds: readonly string[];
  linkedOutcomeIds: readonly string[];
  directReferenceCount: number;
  readOnly: true;
}>;

export type ExecutiveDecisionMemoryEngineState = Readonly<{
  engineId: "executive-decision-memory-engine";
  contractVersion: string;
  initialized: boolean;
  memoryCount: number;
  registeredDecisionCount: number;
  timestamp: string;
  readOnly: true;
}>;

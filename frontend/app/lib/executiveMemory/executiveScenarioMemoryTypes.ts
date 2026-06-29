/**
 * APP-4:6 — Executive Scenario Memory domain types.
 */

import type { ExecutiveMemoryId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type {
  EXECUTIVE_SCENARIO_MEMORY_REFERENCE_TYPE_KEYS,
  EXECUTIVE_SCENARIO_MEMORY_STATE_KEYS,
} from "./executiveScenarioMemoryConstants.ts";

export type ExecutiveScenarioMemoryId = string;
export type ExecutiveScenarioId = string;
export type ExecutiveScenarioMemoryState = (typeof EXECUTIVE_SCENARIO_MEMORY_STATE_KEYS)[number];
export type ExecutiveScenarioMemoryReferenceType =
  (typeof EXECUTIVE_SCENARIO_MEMORY_REFERENCE_TYPE_KEYS)[number];

export type ExecutiveScenarioMemoryReference = Readonly<{
  referenceId: string;
  referenceType: ExecutiveScenarioMemoryReferenceType;
  targetId: string;
  label: string;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryAssumption = Readonly<{
  assumptionId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryOutcome = Readonly<{
  outcomeId: string;
  label: string;
  description: string;
  status: "projected" | "achieved" | "missed" | "unknown";
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryEvidence = Readonly<{
  evidenceId: string;
  source: string;
  summary: string;
  capturedAt: string;
  readOnly: true;
}>;

export type ExecutiveScenarioDecisionPathStep = Readonly<{
  stepId: string;
  label: string;
  decisionId: string | null;
  order: number;
  readOnly: true;
}>;

export type ExecutiveScenarioDecisionPath = Readonly<{
  pathId: string;
  title: string;
  steps: readonly ExecutiveScenarioDecisionPathStep[];
  readOnly: true;
}>;

export type ExecutiveScenarioBusinessContext = Readonly<{
  contextId: string;
  domain: string;
  businessUnit: string | null;
  market: string | null;
  description: string;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryMetadata = Readonly<{
  title: string;
  summary: string;
  owner: string;
  sourceModule: string;
  customMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryVersion = Readonly<{
  versionId: string;
  semanticVersion: string;
  schemaVersion: string;
  contractVersion: string;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveScenarioMemory = Readonly<{
  memoryId: ExecutiveScenarioMemoryId;
  scenarioId: ExecutiveScenarioId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  goalId: string | null;
  intentId: string | null;
  decisionId: string | null;
  riskIds: readonly string[];
  kpiIds: readonly string[];
  objectIds: readonly string[];
  relationshipIds: readonly string[];
  timelineIds: readonly string[];
  executiveMemoryIds: readonly ExecutiveMemoryId[];
  assumptions: readonly ExecutiveScenarioMemoryAssumption[];
  constraints: readonly string[];
  outcomes: readonly ExecutiveScenarioMemoryOutcome[];
  lessonsLearned: readonly string[];
  evidence: readonly ExecutiveScenarioMemoryEvidence[];
  decisionPath: ExecutiveScenarioDecisionPath | null;
  businessContext: ExecutiveScenarioBusinessContext | null;
  references: readonly ExecutiveScenarioMemoryReference[];
  metadata: ExecutiveScenarioMemoryMetadata;
  lifecycle: ExecutiveScenarioMemoryState;
  version: ExecutiveScenarioMemoryVersion;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  schemaVersion: string;
  contractVersion: string;
  readOnly: true;
}>;

export type CreateExecutiveScenarioMemoryInput = Readonly<{
  memoryId: ExecutiveScenarioMemoryId;
  scenarioId: ExecutiveScenarioId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  goalId?: string | null;
  intentId?: string | null;
  decisionId?: string | null;
  riskIds?: readonly string[];
  kpiIds?: readonly string[];
  objectIds?: readonly string[];
  relationshipIds?: readonly string[];
  timelineIds?: readonly string[];
  executiveMemoryIds?: readonly ExecutiveMemoryId[];
  assumptions?: readonly ExecutiveScenarioMemoryAssumption[];
  constraints?: readonly string[];
  outcomes?: readonly ExecutiveScenarioMemoryOutcome[];
  lessonsLearned?: readonly string[];
  evidence?: readonly ExecutiveScenarioMemoryEvidence[];
  decisionPath?: ExecutiveScenarioDecisionPath | null;
  businessContext?: ExecutiveScenarioBusinessContext | null;
  references?: readonly ExecutiveScenarioMemoryReference[];
  metadata: ExecutiveScenarioMemoryMetadata;
  version: ExecutiveScenarioMemoryVersion;
  createdAt: string;
  updatedAt: string;
  schemaVersion?: string;
  contractVersion?: string;
}>;

export type UpdateExecutiveScenarioMemoryInput = Readonly<{
  metadata?: Readonly<{
    title?: string;
    summary?: string;
    customMetadata?: Readonly<Record<string, string>>;
  }>;
  assumptions?: readonly ExecutiveScenarioMemoryAssumption[];
  outcomes?: readonly ExecutiveScenarioMemoryOutcome[];
  evidence?: readonly ExecutiveScenarioMemoryEvidence[];
  lessonsLearned?: readonly string[];
  constraints?: readonly string[];
  executiveMemoryIds?: readonly ExecutiveMemoryId[];
}>;

export type ExecutiveScenarioMemoryQuery = Readonly<{
  memoryId?: ExecutiveScenarioMemoryId;
  scenarioId?: ExecutiveScenarioId;
  workspaceId?: ExecutiveMemoryWorkspaceId;
  goalId?: string;
  intentId?: string;
  decisionId?: string;
  riskId?: string;
  kpiId?: string;
  lifecycle?: ExecutiveScenarioMemoryState;
}>;

export type ExecutiveScenarioTargetRegistration = Readonly<{
  scenarioId: ExecutiveScenarioId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  packageId?: string | null;
}>;

export type ExecutiveScenarioMemoryError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ExecutiveScenarioMemoryError | null;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryStatistics = Readonly<{
  totalMemories: number;
  activeMemories: number;
  archivedMemories: number;
  memoriesByWorkspace: Readonly<Record<string, number>>;
  memoriesByScenario: Readonly<Record<string, number>>;
  memoriesByGoal: Readonly<Record<string, number>>;
  memoriesByIntent: Readonly<Record<string, number>>;
  memoriesByDecision: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryGraph = Readonly<{
  memoryId: ExecutiveScenarioMemoryId | null;
  scenarioId: ExecutiveScenarioId | null;
  relatedExecutiveMemoryIds: readonly ExecutiveMemoryId[];
  linkedScenarioIds: readonly ExecutiveScenarioId[];
  linkedGoalIds: readonly string[];
  linkedIntentIds: readonly string[];
  linkedDecisionIds: readonly string[];
  linkedRiskIds: readonly string[];
  linkedKpiIds: readonly string[];
  directReferenceCount: number;
  readOnly: true;
}>;

export type ExecutiveScenarioMemoryEngineState = Readonly<{
  engineId: "executive-scenario-memory-engine";
  contractVersion: string;
  initialized: boolean;
  memoryCount: number;
  registeredScenarioCount: number;
  timestamp: string;
  readOnly: true;
}>;

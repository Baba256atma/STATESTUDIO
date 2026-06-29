/**
 * APP-11:3 — Executive Inbox Prioritization Engine domain types.
 */

import type {
  EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES,
  EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS,
  EXECUTIVE_INBOX_PRIORITY_LEVEL_KEYS,
} from "./executiveInboxPrioritizationEngineConstants.ts";
import type { ExecutiveInboxItem, InboxItemId, InboxWorkspaceId } from "./executiveInboxAggregationEngineTypes.ts";

export type PriorityId = string;
export type PriorityDimensionKey = (typeof EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS)[number];
export type PriorityLevel = (typeof EXECUTIVE_INBOX_PRIORITY_LEVEL_KEYS)[number];
export type PrioritizationPipelineStage = (typeof EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES)[number];

export type PriorityDimension = Readonly<{
  dimensionKey: PriorityDimensionKey;
  label: string;
  score: number;
  weight: number;
  weightedContribution: number;
  readOnly: true;
}>;

export type PriorityEvidence = Readonly<{
  evidenceId: string;
  dimensionKey: PriorityDimensionKey;
  signal: string;
  rationale: string;
  score: number;
  readOnly: true;
}>;

export type ExecutivePriorityProvenance = Readonly<{
  itemId: InboxItemId;
  originatingPlatform: string;
  workspaceId: InboxWorkspaceId;
  aggregationVersion: string;
  engineVersion: typeof EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;
  calculationVersion: typeof EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION;
  foundationVersion: "APP-11/1";
  readOnly: true;
}>;

export type PriorityCalculation = Readonly<{
  calculationId: string;
  weightedScore: number;
  priorityLevel: PriorityLevel;
  dimensions: readonly PriorityDimension[];
  weightConfiguration: Readonly<Record<PriorityDimensionKey, number>>;
  calculationVersion: typeof EXECUTIVE_INBOX_PRIORITIZATION_CALCULATION_VERSION;
  readOnly: true;
}>;

export type ExecutivePriorityProfile = Readonly<{
  profileId: string;
  itemId: InboxItemId;
  workspaceId: InboxWorkspaceId;
  priorityLevel: PriorityLevel;
  weightedScore: number;
  dimensions: readonly PriorityDimension[];
  evidence: readonly PriorityEvidence[];
  explanation: string;
  provenance: ExecutivePriorityProvenance;
  prioritizationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveInboxPriority = Readonly<{
  priorityId: PriorityId;
  itemId: InboxItemId;
  workspaceId: InboxWorkspaceId;
  priorityLevel: PriorityLevel;
  weightedScore: number;
  profile: ExecutivePriorityProfile;
  calculation: PriorityCalculation;
  provenance: ExecutivePriorityProvenance;
  prioritizationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type PriorityLearningResult = Readonly<{
  learningId: string;
  itemId: InboxItemId;
  priorityLevel: PriorityLevel;
  weightedScore: number;
  topDimensions: readonly PriorityDimensionKey[];
  explanationSummary: string;
  deterministic: true;
  readOnly: true;
}>;

export type PriorityValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type PriorityValidationResult = Readonly<{
  valid: boolean;
  issues: readonly PriorityValidationIssue[];
  readOnly: true;
}>;

export type PrioritizationRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;
  priorityCount: number;
  priorityIds: readonly PriorityId[];
  readOnly: true;
}>;

export type PrioritizationEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type PrioritizationEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: PrioritizationEngineError | null;
  readOnly: true;
}>;

export type PriorityDimensionOverride = Readonly<{
  dimensionKey: PriorityDimensionKey;
  score: number;
  signal?: string;
}>;

export type InboxItemPrioritizationInput = Readonly<{
  item: ExecutiveInboxItem;
  dimensionOverrides?: readonly PriorityDimensionOverride[];
}>;

export type ExecutiveInboxPrioritizationRequest = Readonly<{
  workspaceId: InboxWorkspaceId;
  sessionId: string;
  items: readonly InboxItemPrioritizationInput[];
  weightConfiguration?: Readonly<Partial<Record<PriorityDimensionKey, number>>>;
  prioritizationTimestamp?: string;
}>;

export type ExecutiveInboxPrioritizationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: InboxWorkspaceId;
  sessionId: string;
  prioritizedItems: readonly ExecutiveInboxPriority[];
  registeredPriorityIds: readonly PriorityId[];
  learningResults: readonly PriorityLearningResult[];
  skippedItems: number;
  pipelineStages: readonly PrioritizationPipelineStage[];
  prioritizationTimestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxPrioritizationEngineState = Readonly<{
  engineId: "executive-inbox-prioritization-engine";
  contractVersion: typeof EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredPriorityCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxPrioritizationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxPrioritizationCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-11/3";
  contractVersion: typeof EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveInboxPrioritizationCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function prioritizationEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): PrioritizationEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

/**
 * APP-3:7 — Executive Intent conflict types.
 * Conflict detection output — no resolution or recommendations.
 */

import type { ExecutiveIntentWorkspaceId, IntentIdentifier } from "./executiveIntentTypes.ts";
import type { IntentConflictDiagnostic } from "./executiveIntentConflictDiagnostics.ts";

export const EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION = "APP-3/7" as const;

export type IntentConflictCategory =
  | "financial"
  | "resource"
  | "time"
  | "strategic"
  | "operational"
  | "technology"
  | "compliance"
  | "customer"
  | "people"
  | "priority"
  | "scope"
  | "target"
  | "constraint"
  | "assumption"
  | "duplicate"
  | "unknown"
  | "custom";

export type IntentConflictSeverity =
  | "none"
  | "informational"
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "unknown";

export type IntentConflictReference = Readonly<{
  referenceId: string;
  intentId: IntentIdentifier | null;
  semanticModelId: string;
  label: string;
  readOnly: true;
}>;

export type IntentConflict = Readonly<{
  conflictId: string;
  category: IntentConflictCategory;
  severity: IntentConflictSeverity;
  ruleId: string;
  summary: string;
  explanation: string;
  leftReference: IntentConflictReference;
  rightReference: IntentConflictReference;
  compatible: false;
  readOnly: true;
}>;

export type IntentConflictPair = Readonly<{
  pairId: string;
  leftSemanticModelId: string;
  rightSemanticModelId: string;
  conflicts: readonly IntentConflict[];
  compatible: boolean;
  readOnly: true;
}>;

export type IntentConflictMatrix = Readonly<{
  matrixId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  intentCount: number;
  pairs: readonly IntentConflictPair[];
  pairIndex: Readonly<Record<string, readonly string[]>>;
  readOnly: true;
}>;

export type IntentConflictFlags = Readonly<{
  hasConflict: boolean;
  multipleConflicts: boolean;
  duplicateIntent: boolean;
  sharedResources: boolean;
  sharedTargets: boolean;
  timelineOverlap: boolean;
  requiresExecutiveReview: boolean;
  futureCompatible: true;
  readOnly: true;
  deterministic: true;
}>;

export type IntentConflictSummary = Readonly<{
  headline: string;
  conflictCount: number;
  pairCount: number;
  highestSeverity: IntentConflictSeverity;
  compatible: boolean;
  readOnly: true;
}>;

export type IntentConflictMetadata = Readonly<{
  conflictEngineVersion: typeof EXECUTIVE_INTENT_CONFLICT_ENGINE_VERSION;
  semanticModelVersion: string;
  classificationEngineVersion: string | null;
  stateEngineVersion: string | null;
  rulesApplied: readonly string[];
  intentCount: number;
  readOnly: true;
}>;

export type IntentConflictResult = Readonly<{
  resultId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  status: "clear" | "conflicts_detected" | "partial" | "unknown";
  conflicts: readonly IntentConflict[];
  matrix: IntentConflictMatrix;
  flags: IntentConflictFlags;
  diagnostics: readonly IntentConflictDiagnostic[];
  summary: IntentConflictSummary;
  metadata: IntentConflictMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type IntentConflictAnalysisInput = Readonly<{
  semanticModel: import("./executiveIntentSemanticTypes.ts").ExecutiveIntentSemanticModel;
  classification: import("./executiveIntentClassificationTypes.ts").IntentClassificationResult | null;
  state: import("./executiveIntentStateTypes.ts").IntentResolutionResult | null;
  readOnly: true;
}>;

export type IntentConflictDetectionRequest = Readonly<{
  workspaceId: ExecutiveIntentWorkspaceId;
  intents: readonly IntentConflictAnalysisInput[];
  timestamp: string;
  readOnly: true;
}>;

export type IntentConflictValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:8 extension. */
export type IntentConflictFutureExtension = Readonly<{
  resolutionBindings: null;
  recommendationBindings: null;
  priorityBindings: null;
}>;

export const CONFLICT_FUTURE_EXTENSION: IntentConflictFutureExtension = Object.freeze({
  resolutionBindings: null,
  recommendationBindings: null,
  priorityBindings: null,
});

export function createIntentConflictResult(
  input: Omit<IntentConflictResult, "readOnly">
): IntentConflictResult {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createIntentConflictAnalysisInput(
  input: Omit<IntentConflictAnalysisInput, "readOnly">
): IntentConflictAnalysisInput {
  return Object.freeze({ ...input, readOnly: true as const });
}

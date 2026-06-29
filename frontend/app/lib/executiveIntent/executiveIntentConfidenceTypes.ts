/**
 * APP-3:10 — Executive Intent confidence types.
 * Understanding confidence only — not business success prediction.
 */

import type { ExecutiveIntentWorkspaceId, IntentIdentifier } from "./executiveIntentTypes.ts";
import type { IntentConfidenceDiagnostic } from "./executiveIntentConfidenceDiagnostics.ts";

export const EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION = "APP-3/10" as const;

export type IntentConfidenceLevel =
  | "very_high"
  | "high"
  | "medium"
  | "low"
  | "very_low"
  | "unknown";

export type IntentConfidenceFactorKey =
  | "extraction_completeness"
  | "semantic_completeness"
  | "classification_determinism"
  | "conflict_impact"
  | "dependency_complexity"
  | "evolution_stability"
  | "state_integrity"
  | "structural_consistency"
  | "unknown_information"
  | "readiness"
  | "future_compatibility";

export type IntentConfidenceFactor = Readonly<{
  factorId: string;
  factorKey: IntentConfidenceFactorKey;
  factorName: string;
  rawScore: number;
  weight: number;
  weightedScore: number;
  diagnostic: string;
  explanation: string;
  contribution: number;
  blocking: boolean;
  futureCompatible: true;
  readOnly: true;
}>;

export type IntentConfidenceBreakdown = Readonly<{
  breakdownId: string;
  factors: readonly IntentConfidenceFactor[];
  aggregateScore: number;
  level: IntentConfidenceLevel;
  readOnly: true;
}>;

export type IntentConfidenceFlags = Readonly<{
  highConfidence: boolean;
  mediumConfidence: boolean;
  lowConfidence: boolean;
  requiresClarification: boolean;
  conflictAffected: boolean;
  dependencyAffected: boolean;
  evolutionStable: boolean;
  readyForReasoning: boolean;
  futureCompatible: true;
  readOnly: true;
  deterministic: true;
}>;

export type IntentConfidenceSummary = Readonly<{
  headline: string;
  level: IntentConfidenceLevel;
  aggregateScore: number;
  factorCount: number;
  blockingFactorCount: number;
  readyForReasoning: boolean;
  readOnly: true;
}>;

export type IntentConfidenceMetadata = Readonly<{
  confidenceEngineVersion: typeof EXECUTIVE_INTENT_CONFIDENCE_ENGINE_VERSION;
  semanticModelVersion: string | null;
  classificationEngineVersion: string | null;
  conflictEngineVersion: string | null;
  dependencyEngineVersion: string | null;
  evolutionEngineVersion: string | null;
  stateEngineVersion: string | null;
  rulesApplied: readonly string[];
  readOnly: true;
}>;

export type IntentConfidenceResult = Readonly<{
  resultId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  focusIntentId: IntentIdentifier | null;
  semanticModelId: string | null;
  level: IntentConfidenceLevel;
  aggregateScore: number;
  breakdown: IntentConfidenceBreakdown;
  flags: IntentConfidenceFlags;
  diagnostics: readonly IntentConfidenceDiagnostic[];
  summary: IntentConfidenceSummary;
  metadata: IntentConfidenceMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type IntentConfidenceAnalysisInput = Readonly<{
  workspaceId: ExecutiveIntentWorkspaceId;
  focusIntentId: IntentIdentifier | null;
  extraction: import("./executiveIntentExtractionTypes.ts").IntentExtractionResult | null;
  semanticModel: import("./executiveIntentSemanticTypes.ts").ExecutiveIntentSemanticModel | null;
  classification: import("./executiveIntentClassificationTypes.ts").IntentClassificationResult | null;
  conflict: import("./executiveIntentConflictTypes.ts").IntentConflictResult | null;
  dependency: import("./executiveIntentDependencyTypes.ts").IntentDependencyResult | null;
  evolution: import("./executiveIntentEvolutionTypes.ts").IntentEvolutionResult | null;
  state: import("./executiveIntentStateTypes.ts").IntentResolutionResult | null;
  timestamp: string;
  readOnly: true;
}>;

export type IntentConfidenceValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:11 extension. */
export type IntentConfidenceFutureExtension = Readonly<{
  recommendationBindings: null;
  reasoningBindings: null;
  analyticsBindings: null;
}>;

export const CONFIDENCE_FUTURE_EXTENSION: IntentConfidenceFutureExtension = Object.freeze({
  recommendationBindings: null,
  reasoningBindings: null,
  analyticsBindings: null,
});

export function createIntentConfidenceResult(
  input: Omit<IntentConfidenceResult, "readOnly">
): IntentConfidenceResult {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createIntentConfidenceAnalysisInput(
  input: Omit<IntentConfidenceAnalysisInput, "readOnly">
): IntentConfidenceAnalysisInput {
  return Object.freeze({ ...input, readOnly: true as const });
}
